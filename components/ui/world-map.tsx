"use client";

import { useMemo, useState } from "react";
import DottedMap from "dotted-map";
import { motion } from "motion/react";
import {
  collaborationMarkers,
  MAP_REGION,
  type LabelSide,
} from "@/lib/collaboration-map";

const labelSideClass: Record<LabelSide, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

export default function WorldMap({ compact = false }: { compact?: boolean }) {
  const [activeCity, setActiveCity] = useState<string | null>(null);

  const mapImage = useMemo(() => {
    const map = new DottedMap({
      height: 140,
      grid: "diagonal",
      region: MAP_REGION,
    });

    const svg = map.getSVG({
      radius: 0.2,
      color: "#FFFFFF35",
      shape: "circle",
      backgroundColor: "transparent",
    });

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }, []);

  return (
    <div
      className={`relative w-full select-none ${
        compact ? "aspect-[2.4/1]" : "aspect-[2.95/1] sm:min-h-[300px] lg:min-h-[360px]"
      }`}
      onMouseLeave={() => setActiveCity(null)}
    >
      {/* Map bitmap — fills the entire frame */}
      <img
        src={mapImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        draggable={false}
      />

      {/* Soft edge vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(8,6,15,0.55)_100%)]"
        aria-hidden
      />

      {/* City markers */}
      {collaborationMarkers.map((marker, index) => {
        const isActive = activeCity === marker.city;

        return (
          <button
            key={marker.city}
            type="button"
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            onMouseEnter={() => setActiveCity(marker.city)}
            onFocus={() => setActiveCity(marker.city)}
            onBlur={() => setActiveCity(null)}
            aria-label={marker.city}
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              <motion.span
                className="absolute inset-0 rounded-full bg-accent/30"
                animate={{ scale: [1, 1.8, 1], opacity: [0.45, 0, 0.45] }}
                transition={{
                  duration: 2.2,
                  delay: index * 0.1,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <span className="relative h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_14px_rgba(167,139,250,0.85)] ring-2 ring-accent/25" />
            </span>

            {!compact ? (
              <span
                className={`pointer-events-none absolute whitespace-nowrap rounded-md bg-[#1a1528]/90 px-2 py-0.5 text-[0.65rem] font-medium text-white/90 opacity-0 shadow-lg ring-1 ring-white/10 backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-[0.7rem] ${
                  labelSideClass[marker.labelSide]
                } ${isActive ? "opacity-100" : ""}`}
              >
                {marker.city}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
