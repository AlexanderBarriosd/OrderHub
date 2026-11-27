# OrderHub — Cloud Order Management SaaS

**OrderHub** es una aplicación SaaS liviana para la gestión centralizada de catálogo y pedidos comerciales en tiempo real, construida con **Next.js (React + TypeScript + Tailwind CSS)** y desplegada de forma estática sobre **Amazon Web Services (AWS S3)** mediante integración y entrega continua con **GitHub Actions**.

---

## Características Principales

* **Control de Acceso Privado (`Access Gate`):** Vista inicial protegida mediante código de acceso personal antes de habilitar el panel operativo, gestionando la sesión activa a través de `sessionStorage`.
* **Catálogo Rápido de Productos y Servicios:** Selección directa de ítems del catálogo con autocompletado de producto y precio unitario, además de creación de nuevos ítems personalizados.
* **Gestión Completa de Pedidos:**
  * Creación de pedidos con validación de campos y cálculo automático de totales.
  * Actualización dinámica de estados (`Pendiente`, `En proceso`, `Entregado`, `Cancelado`).
  * Búsqueda instantánea por ID, cliente o producto y filtrado por estado.
* **Métricas Operativas en Tiempo Real:** Cálculo automático de **Total Pedidos**, **Pedidos Activos** e **Ingresos Activos**.
* **Persistencia en Cliente:** Almacenamiento sincronizado en `localStorage` tanto para los pedidos como para los productos del catálogo.
* **Interfaz Editorial Monocromática:** Diseño minimalista en blanco y negro de alto contraste enfocado en legibilidad y velocidad operativa.

---

## Stack Tecnológico y Arquitectura

* **Frontend:** Next.js (App Router con exportación estática `output: "export"`), React, TypeScript y Tailwind CSS.
* **Persistencia y Sesión:** `localStorage` para datos de negocio (catálogo y pedidos) y `sessionStorage` para control de acceso.
* **Cloud Hosting:** AWS S3 Static Website Hosting con configuración de dominio personalizado y DNS.
* **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`) con compilación automatizada y sincronización al bucket S3 en cada integración a `main`.

---

## Ejecución Local

1. Clonar el repositorio e instalar dependencias:
   ```bash
   git clone [https://github.com/](https://github.com/)<tu-usuario>/orderhub.git
   cd orderhub
   npm install