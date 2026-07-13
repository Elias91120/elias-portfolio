"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Skills from "@/components/Skills";
import EducationTimeline from "@/components/EducationTimeline";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AskWidget from "@/components/AskWidget";
import { AgentChatProvider } from "@/components/AgentChatProvider";
import StatsBand from "@/components/StatsBand";
import ScrollProgress from "@/components/ScrollProgress";
import CinematicIntro, { shouldPlayIntro } from "@/components/CinematicIntro";
import DevTerminal from "@/components/DevTerminal";
import { DeveloperModeProvider } from "@/components/DeveloperModeProvider";
import { useIsMobile } from "@/lib/use-is-mobile";
import MobileHomeSections from "@/components/mobile/MobileHomeSections";

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

  const introComplete = showIntro === false;
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      document.body.setAttribute("data-mobile-layout", "");
    } else {
      document.body.removeAttribute("data-mobile-layout");
    }
    return () => document.body.removeAttribute("data-mobile-layout");
  }, [isMobile]);

  return (
    <DeveloperModeProvider introComplete={introComplete}>
      {showIntro === true && (
        <CinematicIntro onComplete={() => setShowIntro(false)} />
      )}
      {isMobile ? (
        <MobileHomeSections showIntro={showIntro} />
      ) : (
        <HomeSections showIntro={showIntro} />
      )}
      {isMobile === false && <DevTerminal />}
    </DeveloperModeProvider>
  );
}

function HomeSections({ showIntro }: { showIntro: boolean | null }) {
  const heroReady = showIntro === false;

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <AgentChatProvider>
        <Hero ready={heroReady} />
        <div className="flex flex-col">
          <div style={{ order: 1 }}>
            <Story />
          </div>
          <div style={{ order: 2 }}>
            <StatsBand />
          </div>
          <div style={{ order: 3 }}>
            <Skills />
          </div>
          <div style={{ order: 4 }}>
            <EducationTimeline />
          </div>
          <div style={{ order: 5 }}>
            <Projects />
          </div>
          <div style={{ order: 6 }}>
            <Testimonials />
          </div>
          <div style={{ order: 7 }}>
            <Contact />
          </div>
        </div>
        <Footer />
        <AskWidget />
      </AgentChatProvider>
    </>
  );
}
