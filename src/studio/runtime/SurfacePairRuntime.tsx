"use client";

import { useState, type ReactNode } from "react";

export default function SurfacePairRuntime({
  front,
  back,
  size,
}: {
  front: ReactNode;
  back: ReactNode;
  size: number;
}) {
  const [rotation, setRotation] = useState(0);
  const [drag, setDrag] = useState<{
    x: number;
    rotation: number;
  } | null>(null);

  const caseWidth = size * (1287 / 1726);
  const caseLeft = (size - caseWidth) / 2;
  const cropX = size * (219 / 1726);

  const depth = Math.max(14, Math.min(22, size * 0.025));
  const halfDepth = depth / 2;
  const rim = Math.max(6, Math.min(10, size * 0.009));
  const rimSource = rim * (1287 / caseWidth);
  const shellRadius = 46;

  const caseRadiusX = caseWidth * (47 / 1287);
  const caseRadiusY = size * (56 / 1726);
  const caseRadius = `${caseRadiusX}px / ${caseRadiusY}px`;

  const shellLayers = [
    { z: -1.00, s: 1.0000, a: 0.02 },
    { z: -0.80, s: 1.0025, a: 0.36 },
    { z: -0.60, s: 1.0050, a: 0.64 },
    { z: -0.40, s: 1.0080, a: 0.84 },
    { z: -0.20, s: 1.0105, a: 0.84 },
    { z:  0.00, s: 1.0120, a: 0.99 },
    { z:  0.20, s: 1.0105, a: 0.84 },
    { z:  0.40, s: 1.0080, a: 0.84 },
    { z:  0.60, s: 1.0050, a: 0.64 },
    { z:  0.80, s: 1.0025, a: 0.36 },
    { z:  1.00, s: 1.0000, a: 0.02 },
  ];

  const faceStyle = {
    position: "absolute" as const,
    inset: 0,
    overflow: "hidden",
    borderRadius: caseRadius,
    backfaceVisibility: "hidden" as const,
    WebkitBackfaceVisibility: "hidden" as const,
    pointerEvents: "none" as const,
  };

  return (
    <div style={{
      position: "relative",
      width: size,
      height: size,
      margin: "0 auto",
      perspective: Math.max(1200, size * 2),
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: caseLeft,
        width: caseWidth,
        height: size,
        transformStyle: "preserve-3d",
        transform: `rotateY(${rotation}deg)`,
        transition: drag ? "none" : "transform 220ms ease",
      }}>
        {shellLayers.map((layer, index) => (
          <svg
            key={`shell-${index}`}
            viewBox="0 0 1287 1726"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              overflow: "visible",
              transform: `translateZ(${layer.z * halfDepth}px) scale(${layer.s})`,
              pointerEvents: "none",
            }}
          >
            <rect
              x={rimSource / 2}
              y={rimSource / 2}
              width={1287 - rimSource}
              height={1726 - rimSource}
              rx={shellRadius}
              ry={shellRadius}
              fill="none"
              stroke={`rgba(60,60,60,${layer.a})`}
              strokeWidth={rimSource}
            />
          </svg>
        ))}

        <div style={{
          ...faceStyle,
          transform: `translateZ(${halfDepth + 0.5}px)`,
        }}>
          <div style={{
            position: "absolute",
            top: 0,
            left: -cropX,
            width: size,
            height: size,
          }}>
            {front}
          </div>
        </div>

        <div style={{
          ...faceStyle,
          transform: `rotateY(180deg) translateZ(${halfDepth + 0.5}px)`,
        }}>
          <div style={{
            position: "absolute",
            top: 0,
            left: -cropX,
            width: size,
            height: size,
          }}>
            {back}
          </div>
        </div>
      </div>

      <div
        title="Drag to rotate · Click to flip"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDrag({ x: e.clientX, rotation });
        }}
        onPointerMove={(e) => {
          if (!drag) return;
          setRotation(drag.rotation + (e.clientX - drag.x) * 0.8);
        }}
        onPointerUp={(e) => {
          if (!drag) return;

          const delta = e.clientX - drag.x;

          if (Math.abs(delta) < 5) {
            setRotation(drag.rotation + 180);
          } else {
            const end = drag.rotation + delta * 0.8;
            setRotation(Math.round(end / 180) * 180);
          }

          setDrag(null);
        }}
        onPointerCancel={() => setDrag(null)}
        style={{
          position: "absolute",
          top: 0,
          left: caseLeft,
          width: caseWidth,
          height: size,
          zIndex: 20,
          cursor: drag ? "grabbing" : "grab",
          touchAction: "none",
          background: "transparent",
          borderRadius: caseRadius,
        }}
      />
    </div>
  );
}
