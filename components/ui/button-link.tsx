import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition",
        variant === "primary" &&
          "bg-gradient-to-r from-forest to-[#407B68] text-white shadow-card hover:-translate-y-0.5 hover:shadow-soft",
        variant === "secondary" &&
          "bg-white text-forest shadow-card hover:-translate-y-0.5 hover:shadow-soft",
        variant === "ghost" && "bg-transparent text-forest hover:bg-cream",
        className
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
