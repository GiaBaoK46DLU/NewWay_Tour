import { CalendarDays, MapPin, Search, Tags, Wallet } from "lucide-react";

export function SearchBox({ compact = false }: { compact?: boolean }) {
  return (
    <form
      action="/tours"
      className={`grid gap-3 rounded-3xl border border-forest/10 bg-white p-3 shadow-soft ${
        compact ? "lg:grid-cols-[1fr_1fr_1fr_1fr_auto]" : "lg:grid-cols-[1fr_1fr_1fr_1fr_auto]"
      }`}
    >
      <label className="flex min-h-16 items-center gap-3 rounded-2xl bg-paper px-4">
        <MapPin className="h-5 w-5 text-forest" />
        <span className="grid flex-1 gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-mist">
            Điểm đến
          </span>
          <input
            className="w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-mist"
            name="q"
            placeholder="Cầu Đất, Langbiang..."
          />
        </span>
      </label>
      <label className="flex min-h-16 items-center gap-3 rounded-2xl bg-paper px-4">
        <Tags className="h-5 w-5 text-forest" />
        <span className="grid flex-1 gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-mist">
            Loại tour
          </span>
          <select
            className="w-full bg-transparent text-sm font-semibold text-ink outline-none"
            name="type"
          >
            <option value="">Tất cả</option>
            <option value="Săn mây">Săn mây</option>
            <option value="Khám phá">Khám phá</option>
            <option value="Mạo hiểm">Mạo hiểm</option>
            <option value="Nghỉ dưỡng">Nghỉ dưỡng</option>
            <option value="Camping">Camping</option>
          </select>
        </span>
      </label>
      <label className="flex min-h-16 items-center gap-3 rounded-2xl bg-paper px-4">
        <Wallet className="h-5 w-5 text-forest" />
        <span className="grid flex-1 gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-mist">
            Khoảng giá
          </span>
          <select
            className="w-full bg-transparent text-sm font-semibold text-ink outline-none"
            name="price"
          >
            <option value="">Tất cả</option>
            <option value="700000">Dưới 700k</option>
            <option value="1000000">Dưới 1 triệu</option>
            <option value="1500000">Dưới 1.5 triệu</option>
          </select>
        </span>
      </label>
      <label className="flex min-h-16 items-center gap-3 rounded-2xl bg-paper px-4">
        <CalendarDays className="h-5 w-5 text-forest" />
        <span className="grid flex-1 gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-mist">
            Ngày đi
          </span>
          <input
            className="w-full bg-transparent text-sm font-semibold text-ink outline-none"
            name="date"
            type="date"
          />
        </span>
      </label>
      <button
        className="inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold to-earth px-6 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
        type="submit"
      >
        <Search className="h-5 w-5" />
        Tìm tour
      </button>
    </form>
  );
}
