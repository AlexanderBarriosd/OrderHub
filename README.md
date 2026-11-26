# OrderHub

Plataforma SaaS web desarrollada con **Next.js (App Router, TypeScript y Tailwind CSS)**, configurada para exportación estática (`output: "export"`) y despliegue automatizado en **Amazon S3** mediante **GitHub Actions**.

## Características principales

- Panel de métricas en tiempo real (total de pedidos, pedidos activos e ingresos).
- Formulario para registrar nuevas órdenes.
- Filtrado por estado (`Todos`, `Pendiente`, `En proceso`, `Entregado`, `Cancelado`) y actualización directa del estado de cada pedido.
- Pipeline CI/CD en `.github/workflows/deploy.yml` para compilar y sincronizar la carpeta `out/` hacia un bucket S3.

## Desarrollo local

```bash
npm install
npm run dev