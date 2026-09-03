"use client";

import dynamic from "next/dynamic";
import { AgentChatProvider } from "@/components/AgentChatProvider";
import { DeveloperModeProvider } from "@/components/DeveloperModeProvider";
import ScrollProgress from "@/components/ScrollProgress";
import Nav from "@/components/v2/Nav";
import Hero from "@/components/v2/Hero";
import Marquee from "@/components/v2/Marquee";
import About from "@/components/v2/About";
import Expertise from "@/components/v2/Expertise";
import WorkStack from "@/components/v2/WorkStack";
import OtherWork from "@/components/v2/OtherWork";
import Path from "@/components/v2/Path";
import Skills from "@/components/v2/Skills";
import Recommendations from "@/components/v2/Recommendations";
import Contact from "@/components/v2/Contact";

// Below-the-fold and interaction-only surfaces: kept out of the first bundle
// so the hero is interactive as early as possible.
const GlobalReach = dynamic(() => import("@/components/GlobalReach"), {
  ssr: false,
});
const AskWidget = dynamic(() => import("@/components/AskWidget"), {
  ssr: false,
});
const DevTerminal = dynamic(() => import("@/components/DevTerminal"), {
  ssr: false,
});

export default function HomeExperience() {
  return (
    <DeveloperModeProvider>
      <AgentChatProvider>
        <ScrollProgress />
        <Nav />
        <Hero />
        <Marquee />
        <About />
        <Expertise />
        <WorkStack />
        <OtherWork />
        <Path />
        <Skills />
        <GlobalReach />
        <Recommendations />
        <Contact />
        <AskWidget />
      </AgentChatProvider>
      <DevTerminal />
    </DeveloperModeProvider>
  );
}
