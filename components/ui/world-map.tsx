"use client";

import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import DottedMap from "dotted-map";
import proj4 from "proj4";

export type MapPoint = {
  lat: number;
  lng: number;
  label?: string;
  labelOffset?: { x: number; y: number };
  labelAnchor?: "start" | "middle" | "end";
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

/** Cropped region — Americas through India, no East Asia / Pacific. */
const MAP_REGION = {
  lat: { min: 4, max: 64 },
  lng: { min: -132, max: 80 },
};

const LABEL_PADDING = { top: 34, right: 52, bottom: 34, left: 52 };

type DottedMapProjection = {
  width: number;
  height: number;
  X_MIN: number;
  X_RANGE: number;
  Y_MAX: number;
  Y_RANGE: number;
  proj4String: string;
};

function projectOnMap(map: DottedMapProjection, lat: number, lng: number) {
  const [projX, projY] = proj4(map.proj4String, [lng, lat]) as [
    number,
    number,
  ];

  return {
    x: map.width * ((projX - map.X_MIN) / map.X_RANGE),
    y: map.height * ((map.Y_MAX - projY) / map.Y_RANGE),
  };
}

export default function WorldMap({
  dots = [],
  points = [],
  lineColor = "#a78bfa",
  showLabels = true,
  compact = false,
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const { mapProjection, svgMap } = useMemo(() => {
    const map = new DottedMap({
      height: compact ? 100 : 130,
      grid: "diagonal",
      region: MAP_REGION,
    });

    return {
      mapProjection: map as unknown as DottedMapProjection,
      svgMap: map.getSVG({
        radius: compact ? 0.2 : 0.24,
        color: "#FFFFFF40",
        shape: "circle",
        backgroundColor: "transparent",
      }),
    };
  }, [compact]);

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

  const dotRadius = compact ? 2.5 : 2.25;
  const pulseRadius = compact ? 10 : 9;
  const labelSize = compact ? 8 : 11;

  const viewBox = [
    -LABEL_PADDING.left,
    -LABEL_PADDING.top,
    mapProjection.width + LABEL_PADDING.left + LABEL_PADDING.right,
    mapProjection.height + LABEL_PADDING.top + LABEL_PADDING.bottom,
  ].join(" ");

  const aspectRatio =
    (mapProjection.width + LABEL_PADDING.left + LABEL_PADDING.right) /
    (mapProjection.height + LABEL_PADDING.top + LABEL_PADDING.bottom);

  return (
    <div
      className="relative w-full rounded-lg font-sans"
      style={{ aspectRatio: compact ? "5 / 3" : `${aspectRatio}` }}
    >
      <svg
        ref={svgRef}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        className="pointer-events-none h-full w-full select-none"
        aria-hidden
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="map-fade-mask">
            <rect
              x="0"
              y="0"
              width={mapProjection.width}
              height={mapProjection.height}
              fill="url(#map-fade-gradient)"
            />
          </mask>
          <linearGradient id="map-fade-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="10%" stopColor="white" stopOpacity="1" />
            <stop offset="90%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <image
          href={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          x="0"
          y="0"
          width={mapProjection.width}
          height={mapProjection.height}
          mask="url(#map-fade-mask)"
        />

        {dots.map((dot, i) => {
          const startPoint = projectOnMap(
            mapProjection,
            dot.start.lat,
            dot.start.lng,
          );
          const endPoint = projectOnMap(mapProjection, dot.end.lat, dot.end.lng);
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
          const { x, y } = projectOnMap(mapProjection, point.lat, point.lng);
          const labelX = x + (point.labelOffset?.x ?? 0);
          const labelY = y + (point.labelOffset?.y ?? -12);
          const anchor = point.labelAnchor ?? "middle";
          const showLeader =
            showLabels && point.label && Boolean(point.labelOffset);

          return (
            <g key={`point-${point.lat}-${point.lng}-${i}`}>
              {showLeader ? (
                <line
                  x1={x}
                  y1={y}
                  x2={labelX}
                  y2={labelY + 4}
                  stroke={lineColor}
                  strokeOpacity="0.35"
                  strokeWidth="0.75"
                />
              ) : null}
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
                  textAnchor={anchor}
                  fill="rgba(255,255,255,0.9)"
                  fontSize={labelSize}
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
