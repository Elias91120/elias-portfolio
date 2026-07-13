"use client";

import MobileNavbar from "@/components/mobile/MobileNavbar";
import MobileBottomNav from "@/components/mobile/MobileBottomNav";
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

type MobileHomeSectionsProps = {
  showIntro: boolean | null;
};

export default function MobileHomeSections({
  showIntro,
}: MobileHomeSectionsProps) {
  const heroReady = showIntro === false;

  return (
    <>
      <ScrollProgress />
      <MobileNavbar />
      <AgentChatProvider>
        <div className="pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))]">
          <MobileHero ready={heroReady} />
          <div className="flex flex-col">
            <div style={{ order: 1 }}>
              <MobileStorySection />
            </div>
            <div style={{ order: 2 }}>
              <StatsBand />
            </div>
            <div style={{ order: 3 }}>
              <Skills compact />
            </div>
            <div style={{ order: 4 }}>
              <Projects compact />
            </div>
            <div style={{ order: 5 }}>
              <Contact compact />
            </div>
          </div>
          <Footer />
        </div>
        <AskWidget />
        <MobileBottomNav />
      </AgentChatProvider>
    </>
  );
}
