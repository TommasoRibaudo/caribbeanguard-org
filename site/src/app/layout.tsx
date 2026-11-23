import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import Footer from "@/components/layout/SiteFooter";
import Header from "@/components/layout/SiteHeader";
import "./globals.css";

const bodyFont = localFont({
  src: "./fonts/source-sans-3-latin.woff2",
  weight: "400 700",
  variable: "--font-body",
  display: "swap",
});

const displayFont = localFont({
  src: [
    { path: "./fonts/zilla-slab-latin-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/zilla-slab-latin-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Caribbean Guard",
    template: "%s — Caribbean Guard",
  },
  description:
    "Caribbean Guard es una organización sin fines de lucro que salva vidas en el Caribe Sur de Costa Rica a través de guardavidas, natación, freediving y educación en seguridad acuática.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projectToken = process.env.NEXT_PUBLIC_CG_POSTHOG_PROJECT_TOKEN ?? "";
  const region = process.env.NEXT_PUBLIC_CG_POSTHOG_REGION ?? "";
  const analyticsEnabled = /^phc_[a-zA-Z0-9]{12,}$/.test(projectToken) && ["us", "eu"].includes(region);
  return (
    <html lang="es" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a href="#main-content" className="skip-link">Saltar al contenido</a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        {analyticsEnabled && (
          <Script src="/cg-analytics.js" strategy="afterInteractive"
            data-surface="website" data-project-token={projectToken} data-region={region} />
        )}
      </body>
    </html>
  );
}
