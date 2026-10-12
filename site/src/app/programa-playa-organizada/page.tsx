import type { Metadata } from "next";
import ListSection from "@/components/sections/ListSection";
import Image from "next/image";
import { programaPlayaOrganizadaContent } from "@/content/programa-playa-organizada";

export const metadata: Metadata = {
  title: "Programa Playa Organizada",
  description:
    "El Programa Playa Organizada (PPO) de Caribbean Guard organiza zonas seguras de bañado, líneas de supervivencia y estaciones de salvamento en las playas del Caribe Sur.",
};

export default function ProgramaPlayaOrganizadaPage() {
  return (
    <>
      <ListSection
        theme="white"
        title="Programa Playa Organizada"
        headingLevel={1}
        layout={programaPlayaOrganizadaContent.list.layout}
        items={programaPlayaOrganizadaContent.list.items}
      />
      <section className="theme-light bg-background">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <Image
            src={programaPlayaOrganizadaContent.mapImage.url}
            alt={programaPlayaOrganizadaContent.mapImage.alt}
            width={1600}
            height={1000}
            unoptimized
            referrerPolicy="no-referrer"
            className="h-auto w-full"
          />
        </div>
      </section>
    </>
  );
}
