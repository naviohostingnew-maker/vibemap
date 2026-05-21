import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";

// Display — Playfair Display (replaces Instrument Serif: it has no Cyrillic
// subset, which blocked Russian display headings). See tokens §2.
const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// Body — Manrope (max weight 600 per tokens §2; never 700).
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VibeMap — вечера, друзья, места",
  description:
    "VibeMap — Volly подсказывает вечера, людей и места, что попадают в точку.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${playfair.variable} ${manrope.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
