# KoBot Web — Verificación (Vercel)

Esta carpeta reemplaza al antiguo `src/web/server.js` (Express corriendo en la VPS
con un puerto abierto). Ahora la web de verificación corre como funciones
serverless en Vercel, y la VPS **ya no necesita exponer ningún puerto** para esto.

## Cómo funciona ahora

- El bot (en la VPS) sigue generando el token único y guardándolo en MongoDB
  cuando alguien pulsa "Verificarme" (eso ya pasa dentro de `verify_button.js`,
  no requiere red entrante, solo escribe en la base de datos).
- El link que recibe el usuario apunta a `https://kobot.vercel.app/verify/<token>`.
- Vercel resuelve las rutas `/verify/:token` y `/verify/callback` (ver `vercel.json`)
  hacia `api/verify/[token].js` y `api/verify/callback.js`.
- Para dar el rol en Discord, estas funciones ya NO usan el cliente de discord.js
  en memoria (porque en serverless no hay proceso persistente); en su lugar
  llaman directamente a la API REST de Discord con el **Bot Token** (`BOT_TOKEN`).

## Pasos para desplegar

1. Sube esta carpeta (`vercel-web/`) como un proyecto nuevo en Vercel
   (puede ser un repo aparte o un subdirectorio — en Vercel eliges
   "Root Directory: vercel-web" si usas el mismo repo del bot).
2. En el dashboard de Vercel, define las variables de entorno de `.env.example`:
   - `CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI`
   - `BOT_TOKEN` (el mismo token del bot)
   - `MONGO_URI` (la misma base de datos que usa el bot)
   - `RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`
3. Asigna el dominio `kobot.vercel.app` al proyecto (o el que prefieras).
4. En el **Discord Developer Portal** → tu aplicación → OAuth2 → Redirects,
   agrega: `https://kobot.vercel.app/verify/callback`
   (y puedes quitar la URL vieja de la VPS).
5. En el `.env` del bot (VPS), cambia:
   ```
   WEB_URL=https://kobot.vercel.app
   ```
6. En la VPS ya no hace falta abrir/mapear el puerto que usaba Express para esto
   (el archivo `src/web/server.js` del bot quedó desconectado, ver más abajo).

## Cambios en el repo del bot

En `src/index.js` se quitó la llamada que levantaba el servidor Express
(`startWeb(client)`), así que el proceso del bot ya no escucha en ningún
puerto TCP público. Los archivos `src/web/server.js` y `src/web/pages.js`
se dejaron en el repo (por si quieres consultarlos o volver atrás), pero
ya no se ejecutan.

## Seguridad

- El `BOT_TOKEN` que pones en Vercel solo se usa para 2 llamadas REST
  (leer miembro/rol y asignar rol), no para conectarse al Gateway.
- Verifica que el rol del bot en Discord esté **por encima** del rol de
  verificación en la jerarquía, o la asignación de rol fallará (403).
- Considera rotar el `BOT_TOKEN` y el `DISCORD_CLIENT_SECRET` después de esta
  migración, ya que antes viajaban por la VPS con el puerto expuesto.
