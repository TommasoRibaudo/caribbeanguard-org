import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Footer from "@/components/layout/SiteFooter";
import Header from "@/components/layout/SiteHeader";
import "./globals.css";

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
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
  return (
    <html lang="es" className={bodyFont.variable}>
      <body className="flex min-h-screen flex-col">
        <a href="#main-content" className="skip-link">Saltar al contenido</a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
