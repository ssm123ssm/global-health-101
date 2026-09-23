import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Global Health 101 — Syllabi Dashboard",
  description:
    "How North American university global health syllabi address decolonization, equity, power, and epistemic justice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen">
        <Nav />
        <main className="mx-auto max-w-7xl px-5 pb-24 pt-8">{children}</main>
        <footer className="border-t border-line py-8 text-center text-sm text-muted">
          84 global health syllabi · USA & Canada · static site, no backend
        </footer>
      </body>
    </html>
  );
}
