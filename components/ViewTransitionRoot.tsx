"use client";

import { ViewTransition } from "react";
import { useSyncExternalStore } from "react";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

type ViewTransitionRootProps = {
  children: React.ReactNode;
};

export default function ViewTransitionRoot({ children }: ViewTransitionRootProps) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ViewTransition
      enter={{
        "nav-forward": "page-enter",
        "nav-back": "page-enter-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "page-exit",
        "nav-back": "page-exit-back",
        default: "none",
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
