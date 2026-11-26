"use client";

import { useState, type FormEvent } from "react";
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

const ALL_STATUSES: OrderStatus[] = [
  "Pendiente",
  "En proceso",
  "Entregado",
  "Cancelado",
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pendiente: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "En proceso": "bg-sky-500/15 text-sky-300 border-sky-500/30",
  Entregado: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Cancelado: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export default function HomePage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [statusFilter, setStatusFilter] = useState<"Todos" | OrderStatus>("Todos");

  const [customerName, setCustomerName] = useState("");
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("100");
  const [status, setStatus] = useState<OrderStatus>("Pendiente");

  const totalOrders = orders.length;
  const activeOrders = orders.filter(
    (o) => o.status === "Pendiente" || o.status === "En proceso"
  ).length;
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelado")
    .reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

  const filteredOrders =
    statusFilter === "Todos"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  function handleCreateOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsedQty = Math.max(1, Number(quantity) || 1);
    const parsedPrice = Math.max(0, Number(unitPrice) || 0);

    if (!customerName.trim() || !company.trim() || !product.trim()) return;

    const newOrder: Order = {
      id: `ORD-${1000 + orders.length + 1}`,
      customerName: customerName.trim(),
      company: company.trim(),
      product: product.trim(),
      quantity: parsedQty,
      unitPrice: parsedPrice,
      status,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCustomerName("");
    setCompany("");
    setProduct("");
    setQuantity("1");
    setUnitPrice("100");
    setStatus("Pendiente");
  }

  function handleStatusChange(orderId: string, nextStatus: OrderStatus) {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === orderId ? { ...item, status: nextStatus } : item
      )
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Panel de Control de Pedidos
        </h2>
        <p className="text-sm text-slate-400">
          Crea órdenes, filtra por estado operativo y actualiza el flujo de tu SaaS.
        </p>
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
            Ingresos Activos
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">
            ${totalRevenue.toLocaleString("en-US")}
          </p>
        </div>
      </section>

      <form
        onSubmit={handleCreateOrder}
        className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:grid-cols-2 lg:grid-cols-6"
      >
        <input
          type="text"
          placeholder="Cliente"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Empresa"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Producto o plan"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          required
        />
        <input
          type="number"
          min={1}
          placeholder="Cant."
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
          required
        />
        <input
          type="number"
          min={0}
          step="0.01"
          placeholder="Precio USD"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
          required
        />
        <button
          type="submit"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
        >
          + Agregar Pedido
        </button>
      </form>

      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-6 py-4">
          <h3 className="text-base font-semibold text-white">
            Órdenes ({filteredOrders.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {(["Todos", ...ALL_STATUSES] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  statusFilter === tab
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
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
              {filteredOrders.map((order) => (
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
                    <select
                      aria-label={`Estado de ${order.id}`}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium focus:outline-none ${STATUS_STYLES[order.status]}`}
                    >
                      {ALL_STATUSES.map((st) => (
                        <option
                          key={st}
                          value={st}
                          className="bg-slate-900 text-white"
                        >
                          {st}
                        </option>
                      ))}
                    </select>
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