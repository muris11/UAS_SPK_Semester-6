import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPK UAS Mastery | SAW SMART TOPSIS AHP",
  description: "Ringkasan mendalam dan latihan CBT 60 soal UAS SPK: SAW, SMART, TOPSIS, dan AHP.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
