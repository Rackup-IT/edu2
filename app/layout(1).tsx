import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./components/ThemeRegistry";

export const dynamic = 'force-dynamic';

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Forteharbor Study",
  description: "Leading Education Consultancy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeRegistry />
        {children}
      </body>
    </html>
  );
}
