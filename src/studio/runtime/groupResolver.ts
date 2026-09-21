export type GroupSide = "+" | "-";

export type Placement = {
  id: string;
  index?: number;
  offset?: number | null;
};

export type GroupDirective = {
  level: string;
  group: number | null;
  side: GroupSide;
  childrenLevel: string | null;
};

export type CompositionRelation = {
  side: GroupSide;
  offset: number;
};

export type PhysicalMember = {
  placement: Placement;
  specId: string | null;
  spec: any | null;
  group: GroupDirective | null;
  relation: CompositionRelation | null;
};

export type LogicalComposition = {
  level: string;
  group: number;
  side: GroupSide;
  specId: string;
  anchorIndex: number;
  members: PhysicalMember[];
  children: LogicalComposition[];
  ids: string[];
};

export function normalizeGroupDirective(
  spec: any,
): GroupDirective | null {
  /*
    1. Existing / legacy explicit groups schema.
    Keep this path unchanged for current Cases, Suitcases, etc.
  */
  const groups = spec?.groups;

  if (groups && typeof groups === "object") {
    const level =
      typeof groups.level === "string" && groups.level.trim()
        ? groups.level.trim().toUpperCase()
        : null;

    const rawGroup = Number(groups.group);

    const group =
      Number.isFinite(rawGroup) && rawGroup > 0
        ? rawGroup
        : null;

    const side: GroupSide | null =
      groups.side === "+" || groups.side === "-"
        ? groups.side
        : null;

    const childrenLevel =
      typeof groups.childrenLevel === "string" &&
      groups.childrenLevel.trim()
        ? groups.childrenLevel.trim().toUpperCase()
        : null;

    if (level && side) {
      return {
        level,
        group,
        side,
        childrenLevel,
      };
    }
  }

  /*
    2. Generic Structured Spec.

    A relation says:
      parentLevel -> childLevel
      direction + / -

    Product/type/model names are irrelevant.
  */
  const structure = spec?.structure;
  const relations = Array.isArray(structure?.relations)
    ? structure.relations
    : [];

  const rootLevel =
    typeof structure?.rootLevel === "string" &&
    structure.rootLevel.trim()
      ? structure.rootLevel.trim().toUpperCase()
      : null;

  if (!rootLevel || relations.length === 0) {
    return null;
  }

  const relation = relations.find((entry: any) => {
    const parentLevel = String(
      entry?.parentLevel ?? "",
    )
      .trim()
      .toUpperCase();

    return parentLevel === rootLevel;
  });

  if (!relation) {
    return null;
  }

  const childLevel = String(
    relation?.childLevel ?? "",
  )
    .trim()
    .toUpperCase();

  const side: GroupSide | null =
    relation?.direction === "+" ||
    relation?.direction === "-"
      ? relation.direction
      : null;

  if (!childLevel || !side) {
    return null;
  }

  return {
    level: rootLevel,
    group: null,
    side,
    childrenLevel: childLevel,
  };
}

export function normalizeCompositionRelation(
  spec: any,
): CompositionRelation | null {
  const displayedContent =
    spec?.compose?.displayedContent ??
    spec?.displayedContent ??
    null;

  // Neue Specs: Richtung ausdrücklich definiert
  if (displayedContent && typeof displayedContent === "object") {
    const side: GroupSide | null =
      displayedContent.direction === "+" ||
      displayedContent.direction === "-"
        ? displayedContent.direction
        : null;

    if (side) {
      const rawOffset = Number(displayedContent.offset);

      return {
        side,
        offset: Number.isFinite(rawOffset) ? rawOffset : 0,
      };
    }
  }

  // Legacy-Specs:
  // append-layout + Slotquelle "offset" bedeutet,
  // dass das Layout den vorhergehenden Inhalt darstellt.
  const composeRole = String(
    spec?.compose?.role ?? ""
  ).toLowerCase();

  const slots =
    spec?.slots ??
    spec?.layout?.slots ??
    [];

  const firstSlot =
    Array.isArray(slots) && slots.length > 0
      ? slots[0]
      : null;

  const sourceType = String(
    firstSlot?.source?.type ?? ""
  ).toLowerCase();

  const sourceOffset = Number(
    firstSlot?.source?.offset ?? 0
  );

  if (
    composeRole === "append-layout" &&
    sourceType === "offset"
  ) {
    return {
      side: "-",
      offset: Number.isFinite(sourceOffset)
        ? sourceOffset
        : 0,
    };
  }

  return null;
}

export function resolveLogicalCompositions(
  physicalMembers: PhysicalMember[],
): LogicalComposition[] {
  const ordered = [...physicalMembers].sort((a, b) => {
    const aOffset = Number(a.placement.offset ?? 0);
    const bOffset = Number(b.placement.offset ?? 0);
    return aOffset - bOffset;
  });

  const parents = ordered
    .map((member, index) => ({ member, index }))
    .filter(
      ({ member }) =>
        member.specId &&
        member.group &&
        member.group.childrenLevel,
    );

  return parents.map(({ member: parent, index: parentIndex }, parentPosition) => {
    const directive = parent.group!;
    const childrenLevel = directive.childrenLevel!;

    // Grenze bis zum nächsten Parent desselben Levels.
    const nextParentIndex =
      parents
        .slice(parentPosition + 1)
        .find(({ member }) => member.group?.level === directive.level)
        ?.index ?? ordered.length;

    const candidateRange =
      directive.side === "+"
        ? ordered.slice(parentIndex + 1, nextParentIndex)
        : ordered.slice(0, parentIndex);

    const children: LogicalComposition[] = [];

   for (const candidate of candidateRange) {
  if (
    !candidate.specId ||
    !candidate.relation ||
    !candidate.group ||
    candidate.group.level !== childrenLevel ||
    candidate.group.group === null
  ) {
    continue;
  }

  const childNumber = candidate.group.group;

  if (children.some((child) => child.group === childNumber)) {
    throw new Error(
      `Duplicate structural group ${childrenLevel}${childNumber}`
    );
  }

  const anchorIndex = ordered.indexOf(candidate);
      const relationDistance = candidate.relation.offset + 1;

      const contentIndex =
        candidate.relation.side === "-"
          ? anchorIndex - relationDistance
          : anchorIndex + relationDistance;

      const contentMember = ordered[contentIndex];

      if (!contentMember) {
        continue;
      }

      const members =
        candidate.relation.side === "-"
          ? [contentMember, candidate]
          : [candidate, contentMember];

           children.push({
        level: childrenLevel,
        group: childNumber,
        side: candidate.relation.side,
        specId: candidate.specId,
        anchorIndex,
        members,
        children: [],
        ids: members.map((entry) => entry.placement.id),
      });
    }

    // Structural numbers determine order.
    // Missing numbers remain gaps and are never compacted.
    children.sort((a, b) => a.group - b.group);

    return {
      level: directive.level,
      group: directive.group ?? parentPosition + 1,
      side: directive.side,
      specId: parent.specId!,
      anchorIndex: parentIndex,
      members: [parent],
      children,
      ids: [
        parent.placement.id,
        ...children.flatMap((child) => child.ids),
      ],
    };
  });
}