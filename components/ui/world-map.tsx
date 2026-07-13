"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import DottedMap from "dotted-map";

export type MapPoint = {
  lat: number;
  lng: number;
  label?: string;
  labelOffset?: { x: number; y: number };
};

interface MapProps {
  dots?: Array<{
    start: MapPoint;
    end: MapPoint;
  }>;
  points?: MapPoint[];
  lineColor?: string;
  showLabels?: boolean;
  compact?: boolean;
}

export default function WorldMap({
  dots = [],
  points = [],
  lineColor = "#a78bfa",
  showLabels = true,
  compact = false,
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const map = new DottedMap({ height: 100, grid: "diagonal" });

  const svgMap = map.getSVG({
    radius: compact ? 0.2 : 0.22,
    color: "#FFFFFF40",
    shape: "circle",
    backgroundColor: "transparent",
  });

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number },
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  const uniquePoints = [
    ...points,
    ...dots.flatMap((dot) => [dot.start, dot.end]),
  ].filter(
    (point, index, list) =>
      list.findIndex(
        (item) => item.lat === point.lat && item.lng === point.lng,
      ) === index,
  );

  const dotRadius = compact ? 2.5 : 2;
  const pulseRadius = compact ? 10 : 8;

  return (
    <div
      className={`relative w-full rounded-lg font-sans ${
        compact ? "aspect-[5/3] min-h-[11rem]" : "aspect-[16/10] sm:aspect-[2/1]"
      }`}
    >
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="pointer-events-none h-full w-full select-none object-contain [mask-image:linear-gradient(to_bottom,transparent,white_8%,white_92%,transparent)]"
        alt=""
        height="495"
        width="1056"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid meet"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        aria-hidden
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1,
                  delay: 0.5 * i,
                  ease: "easeOut",
                }}
              />
            </g>
          );
        })}

        {uniquePoints.map((point, i) => {
          const { x, y } = projectPoint(point.lat, point.lng);
          const labelX = x + (point.labelOffset?.x ?? 0);
          const labelY = y - 10 + (point.labelOffset?.y ?? 0);

          return (
            <g key={`point-${point.lat}-${point.lng}-${i}`}>
              <circle cx={x} cy={y} r={dotRadius} fill={lineColor} />
              <circle cx={x} cy={y} r={dotRadius} fill={lineColor} opacity="0.5">
                <animate
                  attributeName="r"
                  from={String(dotRadius)}
                  to={String(pulseRadius)}
                  dur="1.5s"
                  begin={`${i * 0.15}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin={`${i * 0.15}s`}
                  repeatCount="indefinite"
                />
              </circle>
              {showLabels && point.label ? (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.82)"
                  fontSize={compact ? 8 : 10}
                  fontWeight={500}
                  style={{ fontFamily: "var(--font-display), system-ui" }}
                >
                  {point.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
