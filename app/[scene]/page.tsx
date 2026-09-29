import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Stage from "@/components/home/Stage";
import JourneyNav from "@/components/home/JourneyNav";
import { SCENES } from "@/components/home/journey";

// Each home scene also stands alone at its own URL, for links, search and
// the menu when you are away from home. The full journey stays on `/`.

const PAGES = {
  about: {
    title: "About",
    description:
      "Who Mustafa Patharia is and how he works: a full-stack engineer who follows a problem from the interface people touch down to the systems running beneath it.",
  },
  work: {
    title: "Work",
    description:
      "Selected case studies by Mustafa Patharia, each a product or integration he built end to end.",
  },
  capabilities: {
    title: "Capabilities",
    description: "What Mustafa Patharia builds, each capability tied to the project that proves it.",
  },
  journey: {
    title: "Journey",
    description: "The roles and work that shaped how Mustafa Patharia builds software.",
  },
  contact: {
    title: "Contact",
    description:
      "Book a call, send a message or find Mustafa Patharia elsewhere. Open to freelance and contract work.",
  },
} as const;

type Solo = keyof typeof PAGES;
type Props = { params: Promise<{ scene: string }> };

const find = (id: string) => SCENES.find((s) => s.id === id && id in PAGES) as
  | (typeof SCENES)[number] & { id: Solo }
  | undefined;

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PAGES).map((scene) => ({ scene }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = find((await params).scene);
  if (!s) return {};
  const { title, description } = PAGES[s.id];
  const full = `${s.title === title ? title : `${s.title} · ${title}`} | Mustafa Patharia`;
  return {
    title: full,
    description,
    alternates: { canonical: `/${s.id}` },
    openGraph: { title: full, description, url: `/${s.id}` },
    twitter: { title: full, description },
  };
}

export default async function ScenePage({ params }: Props) {
  const s = find((await params).scene);
  if (!s) notFound();
  return (
    <main>
      <JourneyNav key={`nav-${s.id}`} scene={s.id} />
      <Stage key={`stage-${s.id}`} ready solo={s.id} />
    </main>
  );
}
