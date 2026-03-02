import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PaparazziByBiz CRM — Fashion Intelligence",
  description: "AI-powered CRM for Paparazzi by Biz clothing brand. Manage leads, customers, deals, inventory, and communications.",
  keywords: ["fashion CRM", "clothing retail", "AI CRM", "PaparazziByBiz", "lead management"],
};

export const viewport: Viewport = {
  themeColor: "#C8658E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
