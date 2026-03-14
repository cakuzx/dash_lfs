# LFS Sales Dashboard

Dashboard interactivo y profesional para el análisis de historial de compras, desarrollado con React, Vite, Tailwind CSS y Recharts.

## Características

- **KPIs en Tiempo Real:** Ventas Totales (S/ 18.7M), Base Imponible, Ticket Promedio y conteo de Clientes.
- **Filtros Avanzados:** 
  - Año Fiscal
  - Vendedor
  - Tipo de Pago (CONTADO / CREDITO)
  - Cliente (Buscador dinámico)
- **Gráficos Dinámicos:**
  - **Evolución de Ventas:** Tendencia histórica comparando Total vs Base Imponible.
  - **Top Vendedores:** Ranking por volumen de ventas.
  - **Historial de Cliente:** Gráfico detallado del comportamiento de compra por cliente seleccionado.
- **Soporte para Millones:** Formateo automático de cifras grandes (ej. 14.32M).

## Estructura del Proyecto

- `data_processor.py`: Script de Python para extraer y limpiar datos desde el Excel `Historial de compras.xlsx`.
- `dashboard-app/`: Aplicación frontend en React.
- `data.json`: Datos procesados listos para el dashboard.

## Requisitos

- Python 3.x (pandas, openpyxl)
- Node.js (v18+)
- npm o yarn

## Instalación y Uso

1. **Procesar Datos:**
   ```bash
   python data_processor.py
   ```
2. **Iniciar Dashboard:**
   ```bash
   cd dashboard-app
   npm install
   npm run dev
   ```

## Desarrollo

El proyecto utiliza un diseño premium con modo claro, sombras suaves y transiciones fluidas para una experiencia de usuario superior.

## Despliegue en Render.com

Este proyecto incluye un archivo `render.yaml` (Blueprint) para un despliegue automático:

1. Conecta tu repositorio de GitHub a Render.
2. Render detectará automáticamente el archivo `render.yaml`.
3. El dashboard se desplegará como un **Static Site**.

La ruta de construcción es `./dashboard-app/dist` y el comando de construcción es automático según el archivo de configuración.
