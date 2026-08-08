import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono, Geist } from "next/font/google";
import "./globals.css";

import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Tiri — Digital Invitations",
  description:
    "Build your guest list, send digital cards, track RSVPs live. The modern way to manage event invitations.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        fraunces.variable,
        inter.variable,
        plexMono.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
