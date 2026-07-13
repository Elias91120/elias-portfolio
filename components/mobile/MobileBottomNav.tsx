"use client";

import { useEffect, useState, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgentChat } from "@/components/AgentChatProvider";
import { scrollToSection, prefersReducedMotion } from "@/lib/scroll-to-section";

type TabId = "story" | "projects" | "skills" | "contact" | "ask";

const sectionTabs: { id: TabId; href: string; label: string }[] = [
  { id: "story", href: "#story", label: "Story" },
  { id: "projects", href: "#projects", label: "Projets" },
  { id: "skills", href: "#skills", label: "Skills" },
  { id: "contact", href: "#contact", label: "Contact" },
];

function StoryIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function SkillsIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m12 3 1.9 5.8H20l-4.8 3.5 1.8 5.7L12 14.8 7 18l1.8-5.7L4 8.8h6.1z" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function AskIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

const icons: Record<TabId, () => ReactElement> = {
  story: StoryIcon,
  projects: ProjectsIcon,
  skills: SkillsIcon,
  contact: ContactIcon,
  ask: AskIcon,
};

export default function MobileBottomNav() {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("story");
  const { setPanelOpen, hasUnread, panelOpen } = useAgentChat();
  const behavior = prefersReducedMotion() ? "auto" : "smooth";

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ["story", "proof", "projects", "skills", "contact"];
    const observers: IntersectionObserver[] = [];

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          if (id === "proof") {
            setActiveTab("story");
          } else {
            setActiveTab(id as TabId);
          }
        },
        { rootMargin: "-40% 0px -45% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const navigate = (href: string, tab: TabId) => {
    setActiveTab(tab);
    scrollToSection(href, behavior);
  };

  const openAsk = () => {
    setActiveTab("ask");
    setPanelOpen(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25 }}
          aria-label="Mobile navigation"
          className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-[60] border-t border-white/8 bg-[#08060f]/90 backdrop-blur-xl"
        >
          <div className="mx-auto flex h-14 max-w-lg items-stretch justify-around px-1">
            {sectionTabs.map((tab) => {
              const Icon = icons[tab.id];
              const isActive = activeTab === tab.id && !panelOpen;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigate(tab.href, tab.id)}
                  className={`touch-press flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 transition-colors ${
                    isActive ? "text-accent" : "text-muted"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon />
                  <span className="text-[0.6rem] font-medium tracking-wide">
                    {tab.label}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={openAsk}
              className={`touch-press relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 transition-colors ${
                panelOpen || activeTab === "ask" ? "text-accent" : "text-muted"
              }`}
              aria-label="Ask AI assistant"
            >
              <AskIcon />
              <span className="text-[0.6rem] font-medium tracking-wide">Ask</span>
              {hasUnread && !panelOpen && (
                <span
                  className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent"
                  aria-hidden
                />
              )}
            </button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
