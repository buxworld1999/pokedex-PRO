import type { Metadata } from "next";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#cc0000",
};

export const metadata: Metadata = {
  title: {
    default: "PokéDex Pro — Pokédex Completa de Todas las Generaciones",
    template: "%s | PokéDex Pro",
  },
  description:
    "Pokédex web profesional con información completa de todos los Pokémon: estadísticas, tipos, debilidades, evoluciones, ubicaciones por juego, información competitiva y más.",
  keywords: ["pokédex", "pokemon", "estadísticas", "ubicaciones", "generaciones", "pokémon español"],
  authors: [{ name: "PokéDex Pro" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    title: "PokéDex Pro — Pokédex Completa",
    description: "Información completa de todos los Pokémon de todas las generaciones.",
    siteName: "PokéDex Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "PokéDex Pro",
    description: "Pokédex completa con datos de todas las generaciones.",
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased gradient-pokedex min-h-screen">
        {children}
      </body>
    </html>
  );
}
