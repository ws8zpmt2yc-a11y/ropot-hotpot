import type { Metadata, Viewport } from "next";
import "./globals.css";
import { OrderProvider } from "@/hooks/useOrder";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: "RoPot Hotpot — Hot pot with a helping hand.",
    template: "%s · RoPot Hotpot",
  },
  description:
    "Choose your broth and ingredients online, watch our two robotic arms pick them, and take your perfect hotpot home. Adelaide CBD and Norwood.",
  openGraph: {
    title: "RoPot Hotpot — Hot pot with a helping hand.",
    description:
      "Good food. Cuter robots. Build a takeaway hotpot online and watch the arms pick it.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#B51618",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <OrderProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-cream"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </OrderProvider>
      </body>
    </html>
  );
}
