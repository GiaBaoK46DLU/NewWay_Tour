"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDownUp, Clock3 } from "lucide-react";

export type SortOption = "popular" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Phổ biến nhất" },
  { value: "price-asc", label: "Giá thấp → cao" },
  { value: "price-desc", label: "Giá cao → thấp" },
  { value: "rating", label: "Đánh giá cao nhất" }
];

/**
 * Client toolbar for the tours listing. Updates the URL query string (sort,
 * duration) via the router while preserving the existing search filters
 * (q/type/price/date) that the SearchBox writes. The server component re-reads
 * searchParams and re-renders the filtered + sorted grid, so this stays a thin
 * URL-driver with no local state.
 */
export function TourToolbar({
  durations,
  sort,
  duration
}: {
  durations: string[];
  sort: SortOption;
  duration: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="inline-flex items-center gap-2 rounded-2xl border border-forest/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-card">
        <Clock3 className="h-4 w-4 text-forest" />
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-mist">
          Thời lượng
        </span>
        <select
          aria-label="Lọc theo thời lượng"
          className="bg-transparent text-sm font-semibold text-ink outline-none"
          name="duration"
          onChange={(event) => updateParam("duration", event.target.value)}
          value={duration}
        >
          <option value="">Tất cả</option>
          {durations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="inline-flex items-center gap-2 rounded-2xl border border-forest/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-card">
        <ArrowDownUp className="h-4 w-4 text-forest" />
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-mist">
          Sắp xếp
        </span>
        <select
          aria-label="Sắp xếp tour"
          className="bg-transparent text-sm font-semibold text-ink outline-none"
          name="sort"
          onChange={(event) => updateParam("sort", event.target.value)}
          value={sort}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
