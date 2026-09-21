"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";

type Placement = {
  id: string;
  number: number;
  serial?: string;
  storageBadge?: string;
  logicalComposition: any;
};

type RuntimeProps = {
  rootId: string;
  spec: any;
  logicalComposition?: any;
  size: number;
  interactive?: boolean;

  renderChild?: (logicalComposition: any, size: number) => ReactNode;
};

const BASE = 2048;

function assetUrl(id?: string) {
  /*
   * Studio Runtime never resolves assets
   * through a network API.
   *
   * The Studio adapter replaces asset IDs
   * with local blob: URLs before this
   * runtime receives the spec.
   */
  return id ?? "";
}

function directChildren(logicalComposition: any): Placement[] {
  const children = Array.isArray(logicalComposition?.children)
    ? logicalComposition.children
    : [];

  return children
    .map((child: any) => {
      const number = Number(child?.group);
      if (!Number.isFinite(number) || number < 1) return null;

      const specId = child?.specId || null;
      const ids = Array.isArray(child?.ids) ? child.ids.filter(Boolean) : [];
      const id = specId || ids[0] || null;
      if (!id) return null;

      const caseMember = Array.isArray(child?.members)
        ? child.members.find((member: any) => member?.placement?.id === specId)
        : null;

      return {
        id,
        number,
        serial:
          typeof caseMember?.spec?.serial === "string"
            ? caseMember.spec.serial
            : undefined,
        storageBadge:
          typeof child?.storageBadge === "string"
            ? child.storageBadge
            : undefined,
        logicalComposition: child,
      } as Placement;
    })
    .filter(Boolean)
    .sort((a: Placement, b: Placement) => a.number - b.number);
}


function SuitcaseRuntime({
  spec,
  logicalComposition,
  size,
  renderChild,
  interactive = true,
}: RuntimeProps) {

  const runtime = spec?.runtime ?? spec?.render?.runtime ?? {};
  const storage = spec?.render?.storage ?? {};
  const geometry = storage?.geometry ?? {};
  const assets = spec?.assets ?? {};

  const children = useMemo(
    () => directChildren(logicalComposition),
    [logicalComposition],
  );

  const [open, setOpen] = useState(false);
  const [angle, setAngle] = useState(
    Number(runtime?.lid?.closedAngle ?? -180),
  );
  const angleRef = useRef(
    Number(runtime?.lid?.closedAngle ?? -180),
  );
  const [scrollLeft, setScrollLeft] = useState(0);
  const shelfRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ id: number; y: number } | null>(null);

  const closedAngle = Number(runtime?.lid?.closedAngle ?? -180);
  const openAngle = Number(runtime?.lid?.openAngle ?? 0);
  const hingeY = Number(runtime?.lid?.hingeY ?? 1025);
  const shelfHideAngle = Number(
  runtime?.shelf?.hideBelowAngle ?? -80,
  );

  const shelfVisible = angle >= shelfHideAngle;
  const shelfWindow = Math.max(
    1,
    Number(runtime?.shelf?.virtualWindow ?? 10),
  );

  const shelfStep = 736;

  function moveShelf(direction: -1 | 1) {
    shelfRef.current?.scrollBy({
      left: direction * shelfStep,
      behavior: "smooth",
    });
  }

  const shelfStart = Math.max(
    0,
    Math.min(
      Math.max(0, children.length - shelfWindow),
      Math.floor(Math.max(0, scrollLeft - 42) / shelfStep) - 1,
    ),
  );
  const visibleShelf = open
    ? children.slice(shelfStart, shelfStart + shelfWindow)
    : [];

  function applyAngle(next: number) {
    const clamped = Math.max(closedAngle, Math.min(openAngle, next));

    angleRef.current = clamped;
    setAngle(clamped);

    if (clamped >= openAngle) setOpen(true);
    if (clamped <= closedAngle) setOpen(false);
  }


  function pointerDown(event: React.PointerEvent<HTMLDivElement>) {

  if (!event.isPrimary) return;
  drag.current = { id: event.pointerId, y: event.clientY };
  event.currentTarget.setPointerCapture(event.pointerId);
}


  function pointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current || drag.current.id !== event.pointerId) return;
    const deltaY = event.clientY - drag.current.y;
    drag.current.y = event.clientY;
   applyAngle(angleRef.current - deltaY);
  }

  function pointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current || drag.current.id !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const midpoint = (closedAngle + openAngle) / 2;
    applyAngle(
      angleRef.current >= midpoint ? openAngle : closedAngle,
    );
  }

  const scale = size / BASE;

  const xCols: number[] = Array.isArray(geometry?.xCols)
    ? geometry.xCols.map(Number)
    : [203, 613, 1033, 1448];
  const rows = Number(geometry?.rows ?? 12);
  const topY = Number(geometry?.topY ?? 1010);
  const itemWidth = Number(geometry?.itemWidth ?? 400);
  const itemHeight = Number(geometry?.itemHeight ?? 70);
  const stepY = Number(geometry?.stepY ?? 55.6363636364);

  function slotRect(number: number) {
    const zero = number - 1;
    const col = Math.floor(zero / rows);
    const rowFromBottom = zero % rows;
    const rowTop = (rows - 1) - rowFromBottom;

    if (col < 0 || col >= xCols.length) return null;
    return {
      x: xCols[col],
      y: topY + rowTop * stepY,
      w: itemWidth,
      h: itemHeight,
      z: 200 + ((rows - 1) - rowTop),
    };
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        margin: "0 auto",
        position: "relative",
        overflow: "visible",
        background: "transparent",
      }}
    >
<div
        style={{
          position: "absolute",
          width: BASE,
          height: BASE,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          transformStyle: "preserve-3d",
          overflow: "visible",
        }}
      >
        <img
          src={assetUrl(assets.storage)}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: BASE,
            height: BASE,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />

        {/* Stable structural slots: missing number stays empty. */}
      {children.map((child) => {
        const rect = slotRect(child.number);
        if (!rect) return null;

        return (
          <div
            key={`storage-${child.number}-${child.id}`}
            title={child.serial || child.id}
            data-structural-number={child.number}
            style={{
              position: "absolute",
              left: rect.x,
              top: rect.y,
              width: rect.w,
              height: rect.h,
              zIndex: rect.z,
              overflow: "visible",
            }}
          >
            <img
              src={assetUrl(assets.caseTemplate)}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                pointerEvents: "none",
              }}
            />
            {child.storageBadge ? (
              <div
                style={{
                  position: "absolute",
                  top: 1,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 20,
                  padding: "1px 8px",
                  background: "#9b111e",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.75)",
                  fontSize: 24,
                  fontWeight: 800,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {child.storageBadge}
              </div>
            ) : null}
          </div>
        );
      })}

                  <div
            style={{
              position: "absolute",
              inset: 0,
              width: BASE,
              height: BASE,
              transformOrigin: `50% ${hingeY}px`,
              transformStyle: "preserve-3d",
              transform: `rotateX(${angle}deg)`,
              overflow: "visible",
              zIndex: 700,
              pointerEvents: "none",
            }}
          >
            <img
              src={assetUrl(assets.lidClosed)}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: BASE,
                height: BASE,
                transform: "rotateX(180deg)",
                backfaceVisibility: "hidden",
                pointerEvents: "none",
                userSelect: "none",
              }}
            />

            <img
              src={assetUrl(assets.lidOpen)}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: BASE,
                height: BASE,
                transform: "rotateX(0deg)",
                backfaceVisibility: "hidden",
                pointerEvents: "none",
                userSelect: "none",
              }}
            />

           {shelfVisible ? (
              <div
                ref={shelfRef}
                style={{
                  position: "absolute",
                  left: 312,
                  top: 296,
                  width: 1449,
                  height: 618,
                  overflowX: "auto",
                  overflowY: "hidden",
                  zIndex: 900,
                  scrollbarWidth: "none",
                  WebkitOverflowScrolling: "touch",
                  pointerEvents: "auto",
                }}
                onScroll={(event) =>
                  setScrollLeft(event.currentTarget.scrollLeft)
                }
              >
                <div
                  style={{
                    position: "relative",
                    height: "100%",
                    width:
                      84 +
                      children.length * 700 +
                      Math.max(0, children.length - 1) * 36,
                  }}
                >
                  {visibleShelf.map((child, localIndex) => {
                    const index = shelfStart + localIndex;

                    return (
                      <div
                        key={`shelf-${child.number}-${child.id}`}
                        data-structural-number={child.number}
                        style={{
                          position: "absolute",
                          left: 42 + index * shelfStep,
                          top: 9,
                          width: 700,
                          height: 600,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          title={child.serial || `Case ${child.number}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "grid",
                            placeItems: "center",
                            overflow: "hidden",
                            pointerEvents: "none",
                          }}
                        >
                          {renderChild
                            ? renderChild(child.logicalComposition, 600)
                            : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {open && children.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous suitcase case"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    moveShelf(-1);
                  }}
                  style={{
                    position: "absolute",
                    left: 225,
                    top: 500,
                    width: 72,
                    height: 190,
                    zIndex: 980,
                    border: "none",
                    background: "rgba(0,0,0,0.04)",
                    color: "rgba(255,255,255,0.78)",
                    fontSize: 64,
                    fontWeight: 300,
                    lineHeight: 1,
                    cursor: "pointer",
                    pointerEvents: "auto",
                    display: "grid",
                    placeItems: "center",
                    padding: 0,
                  }}
                >
                  ‹
                </button>

                <button
                  type="button"
                  aria-label="Next suitcase case"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    moveShelf(1);
                  }}
                  style={{
                    position: "absolute",
                    right: 220,
                    top: 500,
                    width: 72,
                    height: 190,
                    zIndex: 980,
                    border: "none",
                    background: "rgba(0,0,0,0.04)",
                    color: "rgba(255,255,255,0.78)",
                    fontSize: 64,
                    fontWeight: 300,
                    lineHeight: 1,
                    cursor: "pointer",
                    pointerEvents: "auto",
                    display: "grid",
                    placeItems: "center",
                    padding: 0,
                  }}
                >
                  ›
                </button>
              </>
            ) : null}
          </div>

     <div
  aria-label="Open or close suitcase"
  onPointerDown={interactive ? pointerDown : undefined}
  onPointerMove={interactive ? pointerMove : undefined}
  onPointerUp={interactive ? pointerUp : undefined}
  onPointerCancel={interactive ? pointerUp : undefined}
  style={{
    position: "absolute",
    inset: 0,
    width: BASE,
    height: BASE,
    zIndex: 600,
    cursor: interactive ? "grab" : "default",
    touchAction: "none",
    background: "transparent",
    pointerEvents: interactive ? "auto" : "none",
  }}
/>
      </div>
    </div>
  );
}

function AlbumRuntime({ spec, logicalComposition, size, renderChild }: RuntimeProps) {
  const runtime = spec?.runtime ?? {};
  const assets = spec?.assets ?? {};
  const children = useMemo(
    () => directChildren(logicalComposition),
    [logicalComposition],
  );

  const [open, setOpen] = useState(false);
  const [activeNumber, setActiveNumber] = useState<number | null>(null);

  const existingNumbers = children.map((child) => child.number);
  const firstNumber = existingNumbers[0] ?? 1;
  const currentNumber = activeNumber ?? firstNumber;

  const pageWindowBefore = Number(runtime?.pages?.window?.before ?? 1);
  const pageWindowAfter = Number(runtime?.pages?.window?.after ?? 1);

  const activeIndex = Math.max(
    0,
    children.findIndex((child) => child.number === currentNumber),
  );

  const mounted = open
    ? children.slice(
        Math.max(0, activeIndex - pageWindowBefore),
        Math.min(children.length, activeIndex + pageWindowAfter + 1),
      )
    : [];

  const turnAngle = Number(runtime?.pages?.turnAngle ?? -108);
  const scale = size / BASE;

  function move(delta: number) {
    if (!open) {
      setOpen(true);
      setActiveNumber(firstNumber);
      return;
    }

    const nextIndex = activeIndex + delta;
    if (nextIndex < 0) {
      setOpen(false);
      setActiveNumber(null);
      return;
    }

    if (nextIndex >= children.length) return;
    setActiveNumber(children[nextIndex].number);
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        margin: "0 auto",
        position: "relative",
        overflow: "visible",
        background: "transparent",
      }}
      onWheel={(event) => {
        event.preventDefault();
        move(event.deltaY > 0 ? 1 : -1);
      }}
    >
      <div
        style={{
          position: "absolute",
          width: BASE,
          height: BASE,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          perspective: Number(runtime?.pages?.perspective ?? 1900),
          transformStyle: "preserve-3d",
          overflow: "visible",
        }}
      >
        {open ? (
          <img
            src={assetUrl(assets.pageBackplate)}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: BASE,
              height: BASE,
              objectFit: "contain",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        ) : null}

        {mounted.map((page) => {
          const index = children.findIndex((child) => child.number === page.number);
          const relative = index - activeIndex;

          let transform = "translate3d(0,0,0) rotateY(0deg)";
          let opacity = 1;
          let zIndex = 140;

          if (relative < 0) {
            transform = `translate3d(-12px,-7px,3px) rotateY(${turnAngle}deg)`;
            opacity = 0.88;
            zIndex = 150;
          } else if (relative > 0) {
            transform = `translate3d(12px,-7px,-34px) rotateY(6deg) scale(.975)`;
            opacity = 0.9;
            zIndex = 120;
          }

          return (
            <div
              key={`page-${page.number}-${page.id}`}
              data-structural-number={page.number}
              style={{
                position: "absolute",
                left: 30,
                top: 30,
                width: 1988,
                height: 1988,
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                transform,
                opacity,
                zIndex,
                transition: "transform 620ms cubic-bezier(.22,.72,.18,1), opacity 480ms ease",
                overflow: "visible",
              }}
            >
              <div
                title={`Album page ${page.number}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                  overflow: "hidden",
                  pointerEvents: "none",
                }}
              >
                {renderChild
                  ? renderChild(page.logicalComposition, 1988)
                  : null}
              </div>
            </div>
          );
        })}

        <div
          role="button"
          tabIndex={0}
          aria-label="Open or close album"
          onClick={() => {
            if (open) {
              setOpen(false);
              setActiveNumber(null);
            } else {
              setOpen(true);
              setActiveNumber(firstNumber);
            }
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: BASE,
            height: BASE,
            zIndex: 500,
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            transform: open ? `rotateY(${turnAngle}deg)` : "rotateY(0deg)",
            transition: "transform 620ms cubic-bezier(.22,.72,.18,1)",
            cursor: "pointer",
            pointerEvents: open ? "none" : "auto",
            overflow: "visible",
          }}
        >
          <img
            src={assetUrl(assets.cover)}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: BASE,
              height: BASE,
              objectFit: "contain",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </div>

        {open ? (
          <div
            style={{
              position: "absolute",
              left: 1024,
              bottom: 35,
              transform: "translateX(-50%)",
              zIndex: 600,
              display: "flex",
              gap: 160,
            }}
          >
            <button type="button" onClick={() => move(-1)}>‹</button>
            <button type="button" onClick={() => move(1)}>›</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function OrdiFiRuntime(props: RuntimeProps) {
  const component = String(
    props.spec?.runtime?.component ??
    props.spec?.render?.component ??
    props.spec?.kind ??
    "",
  ).toLowerCase();

  if (component.includes("suitcase")) {
    return <SuitcaseRuntime {...props} />;
  }

  if (component.includes("album")) {
    return <AlbumRuntime {...props} />;
  }

  return null;
}
