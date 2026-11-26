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

## Despliegue en Amazon S3

1. Se compila la aplicación estática con `npm run build`, generando el directorio `out/`.
2. El workflow en `.github/workflows/deploy.yml` ejecuta `aws s3 sync ./out s3://$AWS_S3_BUCKET --delete` al hacer push en `main`.
3. Se requieren los secretos `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` y `AWS_S3_BUCKET` configurados en GitHub Actions.