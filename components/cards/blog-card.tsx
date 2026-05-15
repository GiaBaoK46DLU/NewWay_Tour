import Image from "next/image";
import { CalendarDays } from "lucide-react";
import type { BlogPost } from "@/types";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative h-56 overflow-hidden">
        <Image
          alt={post.title}
          className="object-cover transition duration-500 group-hover:scale-105"
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          src={post.image_url}
        />
      </div>
      <div className="p-6">
        <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-mist">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-4 w-4 text-gold" />
            {post.published_at}
          </span>
          <span>{post.read_time}</span>
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-ink">
          {post.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-mist">{post.excerpt}</p>
      </div>
    </article>
  );
}
