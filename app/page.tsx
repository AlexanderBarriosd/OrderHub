"use client";

import { useState } from "react";
import type { Order, OrderStatus } from "../types/order";

const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-1001",
    customerName: "Valeria Mendoza",
    company: "Logística del Caribe SAS",
    product: "Plan Enterprise + Sensores",
    quantity: 4,
    unitPrice: 450,
    status: "En proceso",
    createdAt: "2026-11-24",
  },
  {
    id: "ORD-1002",
    customerName: "Carlos Restrepo",
    company: "Constructora Norte",
    product: "Licencia Operativa Anual",
    quantity: 10,
    unitPrice: 120,
    status: "Entregado",
    createdAt: "2026-11-22",
  },
  {
    id: "ORD-1003",
    customerName: "María Fernanda López",
    company: "Comercializadora Costa",
    product: "Módulo Reportes Avanzados",
    quantity: 2,
    unitPrice: 280,
    status: "Pendiente",
    createdAt: "2026-11-26",
  },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pendiente: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "En proceso": "bg-sky-500/15 text-sky-300 border-sky-500/30",
  Entregado: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Cancelado: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export default function HomePage() {
  const [orders] = useState<Order[]>(INITIAL_ORDERS);

  const totalOrders = orders.length;
  const activeOrders = orders.filter(
    (o) => o.status === "Pendiente" || o.status === "En proceso"
  ).length;
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelado")
    .reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Panel de Control de Pedidos
          </h2>
          <p className="text-sm text-slate-400">
            Monitorea órdenes activas, ingresos estimados y estados operativos en tiempo real.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Total Pedidos
          </p>
          <p className="mt-2 text-3xl font-bold text-white">{totalOrders}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Pedidos Activos
          </p>
          <p className="mt-2 text-3xl font-bold text-amber-400">{activeOrders}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Ingresos Acumulados
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">
            ${totalRevenue.toLocaleString("en-US")}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="border-b border-slate-800 px-6 py-4">
          <h3 className="text-base font-semibold text-white">Órdenes Recientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-800 bg-slate-900 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Cliente / Empresa</th>
                <th className="px-6 py-3">Producto / Plan</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/40">
                  <td className="px-6 py-4 font-mono text-xs text-slate-300">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{order.customerName}</div>
                    <div className="text-xs text-slate-400">{order.company}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-200">
                    {order.product}{" "}
                    <span className="text-xs text-slate-400">x{order.quantity}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">
                    ${(order.quantity * order.unitPrice).toLocaleString("en-US")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}