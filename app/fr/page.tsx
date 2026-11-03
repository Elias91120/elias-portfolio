import type { Metadata } from "next";
import HomeExperience from "@/components/HomeExperience";
import { LocaleProvider } from "@/lib/i18n";

const title = "Elias Elloumi, ingénieur Data & IA";
const description =
  "Ingénieur Data & IA : pipelines de données et dashboards chez Nokia, IA chez Cleva Solutions, co-fondateur du studio 3geeks (sites, applications et IA pour les entreprises). Mastère Data Engineering & IA à l'EFREI Paris.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: "/fr",
    languages: { en: "/", fr: "/fr", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    url: "https://elias-elloumi.com/fr",
    siteName: "Elias Elloumi",
    locale: "fr_FR",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function HomeFr() {
  return (
    <LocaleProvider initial="fr">
      <main>
        <HomeExperience />
      </main>
    </LocaleProvider>
  );
}
