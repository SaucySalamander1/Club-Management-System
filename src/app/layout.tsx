import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/providers";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Savar CF — Official Football Club",
    template: "%s | Savar CF",
  },
  description:
    "Official platform of Savar CF — a football club based in Savar, Bangladesh. Join us, shop official kits, and stay connected.",
  keywords: [
    "Savar CF",
    "football club",
    "Bangladesh football",
    "Savar football",
    "club membership",
    "football kits",
  ],
  openGraph: {
    title: "Savar CF — Official Football Club",
    description:
      "Join Savar CF — training sessions, tournaments, official kits and more.",
    type: "website",
    locale: "en_BD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}