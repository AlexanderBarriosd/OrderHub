"use client";

import React, { useState, useEffect, useMemo } from "react";

type OrderStatus = "Pendiente" | "En proceso" | "Entregado" | "Cancelado";

interface Order {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  unitPrice: number;
  status: OrderStatus;
  createdAt: string;
}

interface CatalogItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

const ACCESS_CODE = "ORDER2026";
const STORAGE_KEY_AUTH = "orderhub_authenticated";
const STORAGE_KEY_ORDERS = "orderhub_orders_v2";
const STORAGE_KEY_CATALOG = "orderhub_catalog_v1";

const INITIAL_CATALOG: CatalogItem[] = [
  {
    id: "CAT-01",
    name: "Plan Empresarial Mensual",
    price: 120,
    category: "Suscripción",
  },
  {
    id: "CAT-02",
    name: "Módulo de Inventario Pro",
    price: 250,
    category: "Complemento",
  },
  {
    id: "CAT-03",
    name: "Soporte Prioritario 24/7",
    price: 95,
    category: "Servicio",
  },
  {
    id: "CAT-04",
    name: "Paquete 500 Órdenes Extra",
    price: 75,
    category: "Capacidad",
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-1041",
    customer: "Logística del Caribe S.A.S.",
    product: "Plan Empresarial Mensual",
    quantity: 3,
    unitPrice: 120,
    status: "En proceso",
    createdAt: "2026-11-25",
  },
  {
    id: "ORD-1042",
    customer: "Ferretería Industrial Norte",
    product: "Módulo de Inventario Pro",
    quantity: 1,
    unitPrice: 250,
    status: "Pendiente",
    createdAt: "2026-11-26",
  },
  {
    id: "ORD-1043",
    customer: "Distribuidora Atlántico",
    product: "Soporte Prioritario 24/7",
    quantity: 2,
    unitPrice: 95,
    status: "Entregado",
    createdAt: "2026-11-27",
  },
];

export default function OrderHubPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [codeInput, setCodeInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [catalog, setCatalog] = useState<CatalogItem[]>(INITIAL_CATALOG);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");

  const [filterStatus, setFilterStatus] = useState<OrderStatus | "Todos">("Todos");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Formulario de nuevo pedido
  const [customer, setCustomer] = useState<string>("");
  const [product, setProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(50);
  const [formError, setFormError] = useState<string>("");

  // Mini formulario para agregar ítem al catálogo
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemCategory, setNewItemCategory] = useState<string>("Suscripción");
  const [newItemPrice, setNewItemPrice] = useState<number>(100);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem(STORAGE_KEY_AUTH);
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }

    const savedOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) setOrders(parsed);
      } catch {
        setOrders(INITIAL_ORDERS);
      }
    }

    const savedCatalog = localStorage.getItem(STORAGE_KEY_CATALOG);
    if (savedCatalog) {
      try {
        const parsedCatalog = JSON.parse(savedCatalog);
        if (Array.isArray(parsedCatalog) && parsedCatalog.length > 0) {
          setCatalog(parsedCatalog);
        }
      } catch {
        setCatalog(INITIAL_CATALOG);
      }
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    }
  }, [orders, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY_CATALOG, JSON.stringify(catalog));
    }
  }, [catalog, isHydrated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (codeInput.trim() === ACCESS_CODE) {
      setIsAuthenticated(true);
      setAuthError("");
      sessionStorage.setItem(STORAGE_KEY_AUTH, "true");
    } else {
      setAuthError("Código de acceso incorrecto.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCodeInput("");
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
  };

  const handleSelectCatalogItem = (item: CatalogItem) => {
    setSelectedCatalogId(item.id);
    setProduct(item.name);
    setUnitPrice(item.price);
    setFormError("");
  };

  const handleAddCatalogItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || newItemPrice <= 0) return;

    const created: CatalogItem = {
      id: `CAT-0${catalog.length + 1}`,
      name: newItemName.trim(),
      category: newItemCategory.trim() || "General",
      price: newItemPrice,
    };

    setCatalog((prev) => [...prev, created]);
    handleSelectCatalogItem(created);
    setNewItemName("");
    setNewItemPrice(100);
    setShowCatalogModal(false);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim() || !product.trim()) {
      setFormError("Completa el cliente y el producto.");
      return;
    }
    if (quantity <= 0 || unitPrice <= 0) {
      setFormError("La cantidad y el precio deben ser mayores a 0.");
      return;
    }

    const nextNumber = 1041 + orders.length;
    const newOrder: Order = {
      id: `ORD-${nextNumber}`,
      customer: customer.trim(),
      product: product.trim(),
      quantity,
      unitPrice,
      status: "Pendiente",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setOrders([newOrder, ...orders]);
    setCustomer("");
    setProduct("");
    setSelectedCatalogId("");
    setQuantity(1);
    setUnitPrice(50);
    setFormError("");
  };

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
    );
  };

  const handleDeleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        filterStatus === "Todos" ? true : order.status === filterStatus;
      const matchesQuery =
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [orders, filterStatus, searchTerm]);

  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const activeOrders = orders.filter(
      (o) => o.status === "Pendiente" || o.status === "En proceso"
    ).length;
    const activeRevenue = orders
      .filter((o) => o.status !== "Cancelado")
      .reduce((acc, o) => acc + o.quantity * o.unitPrice, 0);

    return { totalOrders, activeOrders, activeRevenue };
  }, [orders]);

  if (!isHydrated) {
    return <main className="min-h-screen bg-[#FAFAFA]" />;
  }

  // VISTA 1: CONTROL DE ACCESO PRIVADO
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] text-[#111111] flex items-center justify-center px-4">
        <div className="w-full max-w-xs text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 mb-2">
            OrderHub
          </p>
          <h1 className="text-2xl font-bold tracking-[0.14em] text-[#111111] mb-6">
            ACCESO
          </h1>

          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={codeInput}
              onChange={(e) => {
                setCodeInput(e.target.value);
                if (authError) setAuthError("");
              }}
              placeholder="Ingrese su código de acceso"
              aria-label="Código de acceso"
              autoFocus
              className="w-full h-11 px-3.5 text-sm text-center bg-white border border-neutral-200 rounded-md text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-[#111111] transition-colors"
            />

            {authError && (
              <p className="text-xs text-neutral-800 font-medium">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full h-11 bg-[#141414] hover:bg-black text-white text-xs font-semibold tracking-[0.16em] uppercase rounded-md transition-colors cursor-pointer"
            >
              ACCEDER
            </button>
          </form>
        </div>
      </main>
    );
  }

  // VISTA 2: DASHBOARD OPERATIVO
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111]">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-7 w-7 items-center justify-center bg-[#111111] text-white text-xs font-bold tracking-tighter">
              OH
            </span>
            <span className="font-semibold tracking-tight text-base">OrderHub</span>
            <span className="hidden sm:inline-block text-xs text-neutral-400 border-l border-neutral-200 pl-3">
              Gestión de Pedidos y Catálogo
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs font-medium text-neutral-600 hover:text-[#111111] border border-neutral-200 hover:border-[#111111] px-3 py-1.5 rounded transition-colors cursor-pointer"
          >
            Bloquear sesión
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Métricas principales */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-neutral-200 p-5 rounded-md">
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              Total Pedidos
            </p>
            <p className="text-3xl font-semibold mt-2 tabular-nums">
              {metrics.totalOrders}
            </p>
          </div>

          <div className="bg-white border border-neutral-200 p-5 rounded-md">
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              Pedidos Activos
            </p>
            <p className="text-3xl font-semibold mt-2 tabular-nums">
              {metrics.activeOrders}
            </p>
          </div>

          <div className="bg-white border border-neutral-200 p-5 rounded-md">
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              Ingresos Activos
            </p>
            <p className="text-3xl font-semibold mt-2 tabular-nums">
              ${metrics.activeRevenue.toLocaleString("en-US")}
            </p>
          </div>
        </section>

        {/* Catálogo rápido + Formulario de nuevo pedido */}
        <section className="bg-white border border-neutral-200 p-6 rounded-md space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#111111]">
                Registrar Nuevo Pedido
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Selecciona un producto del catálogo o escribe uno personalizado.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCatalogModal((prev) => !prev)}
              className="text-xs font-medium border border-neutral-300 hover:border-[#111111] px-3 py-1.5 rounded transition-colors cursor-pointer"
            >
              {showCatalogModal ? "Cerrar catálogo" : "+ Nuevo ítem al catálogo"}
            </button>
          </div>

          {/* Selector rápido del catálogo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {catalog.map((item) => {
              const isSelected = selectedCatalogId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectCatalogItem(item)}
                  className={`text-left p-3 rounded border transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#111111] text-white border-[#111111]"
                      : "bg-[#FAFAFA] hover:bg-neutral-100 text-[#111111] border-neutral-200"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] opacity-70">
                    <span>{item.category}</span>
                    <span className="font-mono">{item.id}</span>
                  </div>
                  <p className="text-xs font-semibold mt-1 truncate">{item.name}</p>
                  <p className="text-sm font-semibold mt-1 tabular-nums">
                    ${item.price}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Mini panel para añadir un producto nuevo al catálogo */}
          {showCatalogModal && (
            <form
              onSubmit={handleAddCatalogItem}
              className="p-4 bg-[#FAFAFA] border border-neutral-200 rounded grid grid-cols-1 sm:grid-cols-4 gap-3"
            >
              <input
                type="text"
                placeholder="Nombre del producto/plan"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="h-9 px-3 text-xs bg-white border border-neutral-300 rounded focus:outline-none focus:border-[#111111]"
              />
              <input
                type="text"
                placeholder="Categoría"
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="h-9 px-3 text-xs bg-white border border-neutral-300 rounded focus:outline-none focus:border-[#111111]"
              />
              <input
                type="number"
                min={1}
                placeholder="Precio ($)"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(Number(e.target.value))}
                className="h-9 px-3 text-xs bg-white border border-neutral-300 rounded focus:outline-none focus:border-[#111111]"
              />
              <button
                type="submit"
                className="h-9 px-3 bg-[#111111] text-white text-xs font-medium rounded hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Guardar en catálogo
              </button>
            </form>
          )}

          {/* Campos principales del pedido */}
          <form
            onSubmit={handleCreateOrder}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
          >
            <input
              type="text"
              placeholder="Cliente / Empresa"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="h-10 px-3 text-sm bg-white border border-neutral-300 rounded focus:outline-none focus:border-[#111111]"
            />

            <input
              type="text"
              placeholder="Producto o Servicio"
              value={product}
              onChange={(e) => {
                setProduct(e.target.value);
                setSelectedCatalogId("");
              }}
              className="h-10 px-3 text-sm bg-white border border-neutral-300 rounded focus:outline-none focus:border-[#111111]"
            />

            <input
              type="number"
              min={1}
              placeholder="Cantidad"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="h-10 px-3 text-sm bg-white border border-neutral-300 rounded focus:outline-none focus:border-[#111111]"
            />

            <input
              type="number"
              min={1}
              placeholder="Precio unitario ($)"
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              className="h-10 px-3 text-sm bg-white border border-neutral-300 rounded focus:outline-none focus:border-[#111111]"
            />

            <button
              type="submit"
              className="h-10 px-4 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
            >
              + Crear Pedido
            </button>
          </form>

          {formError && (
            <p className="text-xs text-neutral-800 font-medium">{formError}</p>
          )}
        </section>

        {/* Controles y Tabla */}
        <section className="bg-white border border-neutral-200 rounded-md overflow-hidden">
          <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {(["Todos", "Pendiente", "En proceso", "Entregado", "Cancelado"] as const).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                      filterStatus === status
                        ? "bg-[#111111] text-white"
                        : "bg-neutral-100 text-neutral-600 hover:text-[#111111]"
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>

            <input
              type="text"
              placeholder="Buscar por ID, cliente o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 px-3 text-xs bg-white border border-neutral-300 rounded w-full sm:w-64 focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-[11px] uppercase tracking-wider text-neutral-500">
                  <th className="py-3 px-4 font-medium">ID</th>
                  <th className="py-3 px-4 font-medium">Cliente</th>
                  <th className="py-3 px-4 font-medium">Producto</th>
                  <th className="py-3 px-4 font-medium">Cant.</th>
                  <th className="py-3 px-4 font-medium">Total</th>
                  <th className="py-3 px-4 font-medium">Estado</th>
                  <th className="py-3 px-4 font-medium text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-sm">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-neutral-400">
                      No hay pedidos que coincidan con el filtro actual.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-neutral-600">
                        {order.id}
                      </td>
                      <td className="py-3 px-4 font-medium">{order.customer}</td>
                      <td className="py-3 px-4 text-neutral-600">{order.product}</td>
                      <td className="py-3 px-4 tabular-nums">{order.quantity}</td>
                      <td className="py-3 px-4 font-medium tabular-nums">
                        ${(order.quantity * order.unitPrice).toLocaleString("en-US")}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className={`text-xs font-medium px-2.5 py-1 rounded border cursor-pointer focus:outline-none ${
                            order.status === "Entregado"
                              ? "bg-[#111111] text-white border-[#111111]"
                              : order.status === "En proceso"
                              ? "bg-neutral-200 text-[#111111] border-neutral-300"
                              : order.status === "Cancelado"
                              ? "bg-white text-neutral-400 border-neutral-200 line-through"
                              : "bg-white text-[#111111] border-neutral-400"
                          }`}
                        >
                          <option value="Pendiente" className="bg-white text-[#111111]">
                            Pendiente
                          </option>
                          <option value="En proceso" className="bg-white text-[#111111]">
                            En proceso
                          </option>
                          <option value="Entregado" className="bg-white text-[#111111]">
                            Entregado
                          </option>
                          <option value="Cancelado" className="bg-white text-[#111111]">
                            Cancelado
                          </option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-xs text-neutral-400 hover:text-[#111111] transition-colors cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}