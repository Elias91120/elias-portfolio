import HomeExperience from "@/components/HomeExperience";
import { parseVisitorMode } from "@/lib/visitor-mode";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;

  return (
    <main>
      <HomeExperience initialMode={parseVisitorMode(mode ?? null)} />
    </main>
  );
}
