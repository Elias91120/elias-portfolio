import type { Metadata } from "next";
import HomeExperience from "@/components/HomeExperience";
import { LocaleProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { en: "/", fr: "/fr", "x-default": "/" },
  },
};

export default function Home() {
  return (
    <LocaleProvider>
      <main>
        <HomeExperience />
      </main>
    </LocaleProvider>
  );
}
