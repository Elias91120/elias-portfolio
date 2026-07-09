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

  const heroReady = showIntro === false;

  return (
    <>
      {showIntro === true && (
        <CinematicIntro onComplete={() => setShowIntro(false)} />
      )}
      <ScrollProgress />
      <Navbar />
      <Hero ready={heroReady} />
      <Story />
      <StatsBand />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
      <AskWidget />
    </>
  );
}
