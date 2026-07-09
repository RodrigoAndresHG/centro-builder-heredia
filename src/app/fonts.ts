import { Inter, JetBrains_Mono } from "next/font/google";

// Fuentes del tema "elevado" (landing pública + /bio). Se aplican SOLO a los
// wrappers .theme-elevated; el interior de la app sigue usando Geist.
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});
