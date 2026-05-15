import Image from "next/image";
import { MapPinned, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { SearchBox } from "@/components/sections/search-box";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          alt="Rừng thông và hồ cao nguyên tại Đà Lạt"
          className="h-full w-full object-cover"
          fill
          priority
          sizes="100vw"
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2200&q=90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#13251f]/85 via-[#1d3d34]/58 to-[#13251f]/20" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-paper to-transparent" />
      </div>

      <div className="container-page relative grid min-h-[760px] items-center pb-28 pt-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-3xl text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 text-sm font-semibold backdrop-blur">
            <MapPinned className="h-4 w-4 text-gold" />
            Tour thiên nhiên cao cấp tại Đà Lạt
          </div>
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Chạm vào mùa sương Đà Lạt theo cách thật riêng.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
            Đặt tour săn mây, trekking rừng thông, hồ Tuyền Lâm và city tour
            với lịch trình rõ ràng, hướng dẫn viên địa phương và trải nghiệm
            được tuyển chọn.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/tours">Khám phá tour</ButtonLink>
            <ButtonLink href="/tours/tour-san-may-cau-dat" variant="secondary">
              Đặt tour ngay
            </ButtonLink>
          </div>
        </div>

        <div className="mt-12 hidden justify-end lg:flex">
          <div className="w-full max-w-sm rounded-[2rem] border border-white/20 bg-white/14 p-4 text-white shadow-soft backdrop-blur-xl">
            <div className="relative h-64 w-full overflow-hidden rounded-[1.5rem]">
              <Image
              alt="Săn mây Cầu Đất"
              className="object-cover"
              fill
              sizes="384px"
              src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85"
              />
            </div>
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-white/70">
                  Tour bán chạy
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-bold text-forest">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  4.9
                </span>
              </div>
              <h2 className="text-2xl font-semibold">Săn mây Cầu Đất</h2>
              <p className="mt-2 text-sm leading-6 text-white/72">
                Khởi hành 04:30, bình minh biển mây, đồi chè và cà phê view
                thung lũng.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8">
          <div className="container-page px-0">
            <SearchBox />
          </div>
        </div>
      </div>
    </section>
  );
}
