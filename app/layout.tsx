import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shopping Mart — Considered Style, Everyday",
  description: "Discover considered essentials, modern silhouettes and everyday pieces at Shopping Mart.",
  applicationName: "Shopping Mart",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
