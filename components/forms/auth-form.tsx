"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

type AuthFormProps = {
  mode: "login" | "register";
  action: (state: unknown, formData: FormData) => Promise<{ error?: string } | void>;
};

function SubmitButton({ mode }: { mode: AuthFormProps["mode"] }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="h-12 rounded-full bg-forest text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending
        ? "Đang xử lý..."
        : mode === "login"
          ? "Đăng nhập"
          : "Tạo tài khoản"}
    </button>
  );
}

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="grid gap-4">
      {mode === "register" ? (
        <input
          className="h-12 rounded-2xl border border-forest/10 bg-paper px-4 text-sm outline-none focus:border-forest"
          maxLength={50}
          minLength={2}
          name="username"
          placeholder="Tên người dùng"
          required
          type="text"
        />
      ) : null}
      <input
        className="h-12 rounded-2xl border border-forest/10 bg-paper px-4 text-sm outline-none focus:border-forest"
        name="email"
        placeholder="Email"
        required
        type="email"
      />
      <input
        className="h-12 rounded-2xl border border-forest/10 bg-paper px-4 text-sm outline-none focus:border-forest"
        minLength={6}
        name="password"
        placeholder="Mật khẩu"
        required
        type="password"
      />
      {state?.error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <SubmitButton mode={mode} />
      <p className="text-center text-sm text-mist">
        {mode === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
        <Link
          className="font-semibold text-forest"
          href={mode === "login" ? "/register" : "/login"}
        >
          {mode === "login" ? "Đăng ký" : "Đăng nhập"}
        </Link>
      </p>
    </form>
  );
}
