export type OrderStatus = "Pendiente" | "En proceso" | "Entregado" | "Cancelado";

export interface Order {
  id: string;
  customerName: string;
  company: string;
  product: string;
  quantity: number;
  unitPrice: number;
  status: OrderStatus;
  createdAt: string;
}