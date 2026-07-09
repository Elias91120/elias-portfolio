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
import { VisitorModeProvider, useVisitorMode } from "@/components/VisitorModeProvider";
import HiringStrip from "@/components/HiringStrip";
import StoryTeaser from "@/components/StoryTeaser";

export default function HomeExperience() {
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
    <VisitorModeProvider>
      {showIntro === true && (
        <CinematicIntro onComplete={() => setShowIntro(false)} />
      )}
      <HomeSections showIntro={showIntro} />
    </VisitorModeProvider>
  );
}

function HomeSections({ showIntro }: { showIntro: boolean | null }) {
  const { mode, hydrated } = useVisitorMode();
  const [storyExpanded, setStoryExpanded] = useState(false);
  const heroReady = showIntro === false;

  const isHiring = hydrated && mode === "hiring";
  const isBrowsing = !isHiring;

  useEffect(() => {
    if (mode !== "hiring") setStoryExpanded(false);
  }, [mode]);

  const storySection =
    isHiring && !storyExpanded ? (
      <StoryTeaser onExpand={() => setStoryExpanded(true)} />
    ) : (
      <Story enabled={isBrowsing || storyExpanded} />
    );

  const main = isHiring ? (
    <>
      <StatsBand />
      <Projects />
      <Skills />
      <Contact />
      {storySection}
    </>
  ) : (
    <>
      <Story enabled />
      <StatsBand />
      <Skills />
      <Projects />
      <Contact />
    </>
  );

  return (
    <>
      <ScrollProgress />
      <Navbar />
      {isHiring && <HiringStrip />}
      <Hero ready={heroReady} />
      {main}
      <Footer />
      <AskWidget />
    </>
  );
}
