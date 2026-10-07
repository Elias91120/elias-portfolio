"use client";

import dynamic from "next/dynamic";
import { AgentChatProvider } from "@/components/AgentChatProvider";
import ScrollProgress from "@/components/ScrollProgress";
import Nav from "@/components/v2/Nav";
import Hero from "@/components/v2/Hero";
import Marquee from "@/components/v2/Marquee";
import Proof from "@/components/v2/Proof";
import Capabilities from "@/components/v2/Capabilities";
import WorkStack from "@/components/v2/WorkStack";
import OtherWork from "@/components/v2/OtherWork";
import Posts from "@/components/v2/Posts";
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

export default function HomeExperience() {
  return (
    <AgentChatProvider>
      <ScrollProgress />
      <Nav />
      <Hero />
      <Proof />
      <Capabilities />
      <Marquee />
      <WorkStack />
      <OtherWork />
      <Posts />
      <Path />
      <Skills />
      <GlobalReach />
      <Recommendations />
      <Contact />
      <AskWidget />
    </AgentChatProvider>
  );
}
