import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXA — Tecnología que conecta personas",
  description: "Pulsera inteligente para personas mayores",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
