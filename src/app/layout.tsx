import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TamboProvider } from "@/providers";
import "./globals.css";

/* ============================================
   FONTS
   ============================================ */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

/* ============================================
   METADATA
   ============================================ */

export const metadata: Metadata = {
  metadataBase: new URL("https://canvas-ai-nu.vercel.app"),
  title: {
    default: "Canvas AI - The AI-Native Workspace",
    template: "%s | Canvas AI",
  },
  description:
    "A generative workspace that builds itself based on what you need. Describe your intent, and watch the interface come to life.",
  keywords: [
    "AI",
    "Generative UI",
    "Workspace",
    "Productivity",
    "Tambo",
    "React",
    "Next.js",
  ],
  authors: [{ name: "Prakhar" }],
  creator: "Prakhar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://canvas-ai-nu.vercel.app",
    title: "Canvas AI - The AI-Native Workspace",
    description:
      "A generative workspace that builds itself based on what you need.",
    siteName: "Canvas AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Canvas AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Canvas AI - The AI-Native Workspace",
    description:
      "A generative workspace that builds itself based on what you need.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030303" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

/* ============================================
   ROOT LAYOUT
   ============================================ */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <TamboProvider>
          {children}
        </TamboProvider>
      </body>
    </html>
  );
}
