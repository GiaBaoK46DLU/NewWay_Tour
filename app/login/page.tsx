import { AuthForm } from "@/components/forms/auth-form";
import { login } from "@/lib/actions/auth";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    registered?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;

  return (
    <section className="py-16 lg:py-24">
      <div className="container-page grid place-items-center">
        <div className="w-full max-w-md rounded-3xl border border-forest/10 bg-white p-8 shadow-soft">
          <p className="section-kicker">Tài khoản</p>
          <h1 className="mb-7 text-3xl font-semibold tracking-tight text-ink">
            Đăng nhập quản trị
          </h1>
          {query.registered ? (
            <p className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Đăng ký thành công. Hãy đăng nhập để tiếp tục.
            </p>
          ) : null}
          {query.error === "admin-required" ? (
            <p className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Tài khoản này không có quyền quản trị. Chỉ admin mới vào dashboard.
            </p>
          ) : null}
          <AuthForm action={login} mode="login" />
        </div>
      </div>
    </section>
  );
}
