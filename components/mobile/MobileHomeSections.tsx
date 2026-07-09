"use client";

import { useEffect, useState } from "react";
import MobileNavbar from "@/components/mobile/MobileNavbar";
import MobileHero from "@/components/mobile/MobileHero";
import MobileStorySection from "@/components/mobile/MobileStorySection";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AskWidget from "@/components/AskWidget";
import { AgentChatProvider } from "@/components/AgentChatProvider";
import StatsBand from "@/components/StatsBand";
import ScrollProgress from "@/components/ScrollProgress";
import HiringStrip from "@/components/HiringStrip";
import { useVisitorMode } from "@/components/VisitorModeProvider";
import { scrollToSection, prefersReducedMotion } from "@/lib/scroll-to-section";
import type { VisitorMode } from "@/lib/visitor-mode";

type MobileHomeSectionsProps = {
  showIntro: boolean | null;
  initialMode: VisitorMode | null;
};

export default function MobileHomeSections({
  showIntro,
  initialMode,
}: MobileHomeSectionsProps) {
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
      <MobileNavbar />
      {isHiring && <HiringStrip />}
      <AgentChatProvider>
        <MobileHero ready={heroReady} />
        <div className="flex flex-col">
          <div style={{ order: isHiring ? 1 : 2 }}>
            <StatsBand />
          </div>
          <div style={{ order: isHiring ? 2 : 4 }}>
            <Projects compact />
          </div>
          <div style={{ order: 3 }}>
            <Skills compact />
          </div>
          <div style={{ order: isHiring ? 4 : 5 }}>
            <Contact compact />
          </div>
          <div style={{ order: isHiring ? 5 : 1 }}>
            <MobileStorySection
              collapsed={storyCollapsed}
              enabled={storyEnabled}
              onExpand={handleStoryExpand}
            />
          </div>
        </div>
        <Footer />
        <AskWidget />
      </AgentChatProvider>
    </>
  );
}
