import Image from "next/image";
import type { Destination } from "@/types";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <article className="group relative min-h-[360px] overflow-hidden rounded-3xl shadow-card">
      <Image
        alt={destination.name}
        className="object-cover transition duration-500 group-hover:scale-105"
        fill
        sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
        src={destination.image_url}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/18 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <span className="mb-3 inline-flex rounded-full bg-white/16 px-3 py-1 text-xs font-bold backdrop-blur">
          {destination.highlights}
        </span>
        <h3 className="text-2xl font-semibold">{destination.name}</h3>
        <p className="mt-2 text-sm leading-6 text-white/78">
          {destination.description}
        </p>
      </div>
    </article>
  );
}
