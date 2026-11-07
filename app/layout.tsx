import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { config } from "@/lib/config";

const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: `${config.name} | ${config.role}`,
  description: `Portfólio de ${config.name}, ${config.role}.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={mono.className}>{children}</body>
    </html>
  );
}
