import { AuthForm } from "@/components/forms/auth-form";
import { login } from "@/lib/actions/auth";

export default function LoginPage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-page grid place-items-center">
        <div className="w-full max-w-md rounded-3xl border border-forest/10 bg-white p-8 shadow-soft">
          <p className="section-kicker">Tài khoản</p>
          <h1 className="mb-7 text-3xl font-semibold tracking-tight text-ink">
            Đăng nhập quản trị
          </h1>
          <AuthForm action={login} mode="login" />
        </div>
      </div>
    </section>
  );
}
