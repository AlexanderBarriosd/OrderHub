import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrderHub | Gestión Inteligente de Pedidos SaaS",
  description: "Plataforma SaaS en la nube para control, seguimiento y analítica de pedidos empresariales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 font-bold text-slate-950">
                OH
              </span>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white">OrderHub</h1>
                <p className="text-xs text-slate-400">Cloud Order Management SaaS</p>
              </div>
            </div>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              AWS Cloud Ready
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}