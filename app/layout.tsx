import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "MovieRecom",
  description: "A simple movie recommendation application",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} dark bg-background text-foreground min-h-full`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}