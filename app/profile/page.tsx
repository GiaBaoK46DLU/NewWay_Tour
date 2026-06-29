import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { getCurrentProfile } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login?next=/profile");
  }

  const displayName = profile.username || profile.email;
  const isAdmin = profile.role === USER_ROLES.ADMIN;
  const initial = displayName.charAt(0).toUpperCase();

  const details = [
    { label: "Tên người dùng", value: profile.username || "Chưa cập nhật", icon: UserRound },
    { label: "Email", value: profile.email, icon: Mail },
    {
      label: "Vai trò",
      value: isAdmin ? "Quản trị viên" : "Khách hàng",
      icon: ShieldCheck
    }
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container-page max-w-2xl">
        <p className="section-kicker">Tài khoản</p>
        <h1 className="mb-7 text-3xl font-semibold tracking-tight text-ink">
          Hồ sơ của tôi
        </h1>

        <div className="rounded-3xl border border-forest/10 bg-white p-8 shadow-soft">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest text-2xl font-bold text-white shadow-card">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xl font-semibold text-ink">{displayName}</p>
              <span className="mt-1 inline-flex rounded-full bg-cream px-3 py-1 text-xs font-semibold text-forest">
                {isAdmin ? "Quản trị viên" : "Khách hàng"}
              </span>
            </div>
          </div>

          <dl className="mt-8 grid gap-4">
            {details.map((item) => (
              <div
                className="flex items-center gap-4 rounded-2xl bg-paper px-4 py-3"
                key={item.label}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-forest shadow-card">
                  <item.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                    {item.label}
                  </dt>
                  <dd className="truncate text-sm font-semibold text-ink">
                    {item.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            {isAdmin ? (
              <Link
                className="inline-flex h-11 items-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
                href="/dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
                Vào trang quản trị
              </Link>
            ) : null}
            <Link
              className="inline-flex h-11 items-center justify-center rounded-full border border-forest/15 px-5 text-sm font-semibold text-forest transition hover:border-forest/30"
              href="/tours"
            >
              Khám phá tour
            </Link>
            <form action={logout}>
              <button
                className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-earth transition hover:bg-cream"
                type="submit"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
