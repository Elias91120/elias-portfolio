"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AskWidget from "@/components/AskWidget";
import StatsBand from "@/components/StatsBand";
import ScrollProgress from "@/components/ScrollProgress";
import CinematicIntro, { shouldPlayIntro } from "@/components/CinematicIntro";
import {
  VisitorModeProvider,
  useVisitorMode,
} from "@/components/VisitorModeProvider";
import HiringStrip from "@/components/HiringStrip";
import { scrollToSection, prefersReducedMotion } from "@/lib/scroll-to-section";
import type { VisitorMode } from "@/lib/visitor-mode";

type HomeExperienceProps = {
  initialMode?: VisitorMode | null;
};

export default function HomeExperience({
  initialMode = null,
}: HomeExperienceProps) {
  const [showIntro, setShowIntro] = useState<boolean | null>(null);

  useEffect(() => {
    setShowIntro(shouldPlayIntro());
  }, []);

  useEffect(() => {
    if (showIntro !== false) {
      document.body.setAttribute("data-intro", "");
      if (showIntro === true) {
        document.body.style.overflow = "hidden";
      }
    } else {
      document.body.removeAttribute("data-intro");
      document.body.style.overflow = "";
    }

    return () => {
      document.body.removeAttribute("data-intro");
      document.body.style.overflow = "";
    };
  }, [showIntro]);

  return (
    <VisitorModeProvider initialMode={initialMode}>
      {showIntro === true && (
        <CinematicIntro onComplete={() => setShowIntro(false)} />
      )}
      <HomeSections showIntro={showIntro} initialMode={initialMode} />
    </VisitorModeProvider>
  );
}

function HomeSections({
  showIntro,
  initialMode,
}: {
  showIntro: boolean | null;
  initialMode: VisitorMode | null;
}) {
  const { mode, hydrated } = useVisitorMode();
  const [storyExpanded, setStoryExpanded] = useState(false);
  const heroReady = showIntro === false;

  const effectiveMode = hydrated ? mode : initialMode;
  const isHiring = effectiveMode === "hiring";
  const storyCollapsed = isHiring && !storyExpanded;
  const storyEnabled = !storyCollapsed;

  useEffect(() => {
    if (mode !== "hiring") setStoryExpanded(false);
  }, [mode]);

  const handleStoryExpand = () => {
    setStoryExpanded(true);
    requestAnimationFrame(() =>
      scrollToSection("#story", prefersReducedMotion() ? "auto" : "smooth")
    );
  };

  return (
    <>
      <ScrollProgress />
      <Navbar />
      {isHiring && <HiringStrip />}
      <Hero ready={heroReady} />
      <div className="flex flex-col">
        <div style={{ order: isHiring ? 1 : 2 }}>
          <StatsBand />
        </div>
        <div style={{ order: isHiring ? 2 : 4 }}>
          <Projects />
        </div>
        <div style={{ order: 3 }}>
          <Skills />
        </div>
        <div style={{ order: isHiring ? 4 : 5 }}>
          <Contact />
        </div>
        <div style={{ order: isHiring ? 5 : 1 }}>
          <Story
            collapsed={storyCollapsed}
            enabled={storyEnabled}
            onExpand={handleStoryExpand}
          />
        </div>
      </div>
      <Footer />
      <AskWidget />
    </>
  );
}
