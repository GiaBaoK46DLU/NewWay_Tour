import { redirect } from "next/navigation";
import { WishlistGrid } from "@/components/sections/wishlist-grid";
import { getCurrentUser } from "@/lib/auth";
import { getWishlistTours } from "@/lib/wishlist";

export default async function WishlistPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/wishlist");
  }

  const tours = await getWishlistTours();

  return (
    <div>
      <section className="bg-cream py-16 lg:py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="section-kicker">Đã lưu</p>
            <h1 className="section-title">Tour yêu thích của bạn.</h1>
            <p className="mt-5 text-base leading-7 text-mist">
              Danh sách tour bạn đã lưu, đồng bộ theo tài khoản trên mọi thiết bị.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-page">
          <WishlistGrid initialTours={tours} />
        </div>
      </section>
    </div>
  );
}
