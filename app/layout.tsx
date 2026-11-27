import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OrderHub",
  description: "Cloud Order Management SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#FAFAFA] text-[#111111]`}
      >
        <header className="w-full bg-white border-b border-neutral-200">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#111111] text-white text-xs font-bold tracking-tight">
                OH
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold tracking-tight text-[#111111]">
                  OrderHub
                </p>
                <p className="text-xs text-neutral-500">
                  Cloud Order Management SaaS
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700">
              <span className="h-1.5 w-1.5 rounded-full bg-[#111111]" />
              AWS Cloud Ready
            </span>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}