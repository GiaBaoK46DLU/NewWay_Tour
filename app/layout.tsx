import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Dalat Trails | Tour du lịch Đà Lạt",
  description:
    "Website đặt tour Đà Lạt hiện đại với tour săn mây, Langbiang, thác Datanla, hồ Tuyền Lâm và city tour."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
