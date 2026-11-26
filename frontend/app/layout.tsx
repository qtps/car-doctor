import type { Metadata } from "next";
import { ReactNode, Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { StoreProvider } from "@/components/store-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Car Doctor | Expert auto care, made simple",
    template: "%s | Car Doctor",
  },
  description: "Book trusted car repairs, find quality auto parts and get expert support from the Car Doctor team.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white font-sans text-[15px] text-ink">
        <StoreProvider>
          <Suspense fallback={<main>{children}</main>}>
            <SiteShell>{children}</SiteShell>
          </Suspense>
        </StoreProvider>
      </body>
    </html>
  );
}
