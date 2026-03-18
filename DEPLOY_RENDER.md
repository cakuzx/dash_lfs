# Guía de Despliegue en Render.com 🚀

Sigue estos pasos para subir tu dashboard a la nube de forma gratuita.

## Paso 1: Subir cambios a GitHub

Como el archivo `render.yaml` ya está configurado y guardado en tu carpeta local, primero asegúrate de que esté en GitHub:

1. Abre tu terminal en la carpeta `LFS`.
2. Ejecuta este comando:
   ```bash
   git push -u origin main
   ```
3. Completa el inicio de sesión en la ventana que aparezca (asegúrate de usar tu cuenta `cakuzx`).

---

## Paso 2: Crear el servicio en Render.com

1. Inicia sesión en [Render.com](https://dashboard.render.com/).
2. Haz clic en el botón azul **"New +"** y selecciona **"Blueprint"**.
3. Conecta tu cuenta de GitHub (si no lo has hecho ya).
4. Busca y selecciona el repositorio `dash_lfs`.
5. Dale un nombre a tu grupo de servicios (ej. `lfs-production`).
6. Render leerá automáticamente el archivo `render.yaml` que creamos.
7. Haz clic en **"Apply"**.

---

## Paso 3: ¡Listo!

Render comenzará a construir la aplicación automáticamente:
- **Root Directory:** `dashboard-app`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Plan:** Free (Gratis)

En unos minutos, Render te dará una URL (ej. `dash-lfs.onrender.com`) donde podrás ver tu dashboard desde cualquier lugar.

---

### Notas de interés
- **Filtros:** Todos los filtros (Vendedor, Cliente, Tipo de Pago) funcionarán perfectamente en la versión web.
- **Actualizaciones:** Cada vez que hagas un `git push` en el futuro, Render actualizará la web automáticamente.
