# Patch by NimboxSRE

Web de producto estática, Astro 7 + Tailwind 4. Español en `/`, traducción completa en `/en/`. Repositorio: `aitorroma/patchsre.com`. Publicación mediante GitHub Pages.

## Desarrollo

Node 24 recomendado (Astro 7.4.7 requiere Node >=22.23.4). Se incluye Node 24 como dependencia de desarrollo para que `npm run build` funcione también en este entorno; Actions usa Node 24.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

`dist/` contiene el sitio listo para cualquier alojamiento estático. No requiere servidor de aplicación, CDN, variables de entorno ni claves.

## Contenido y estructura

- `src/data/es.ts`, `src/data/en.ts`: todos los textos por idioma, legales y FAQ incluidos.
- `src/data/config.ts`: **único fichero de precios, límites, cifras de ejemplo y URLs**. Cambia aquí checkout, alta gratuita, precio por servidor, mínimo, clientes incluidos y cifras. El CTA principal usa signup; el plan Gratis usa solicitud por email hasta que exista el alta automática sin pago.
- `src/components/`: un componente Astro por sección; mockups en HTML/SVG/CSS, no capturas del producto.
- `src/layouts/Layout.astro`: cabecera/pie comunes, metadatos, canonical, idiomas y CSP.
- `src/styles/global.css`: diseño fiel a referencias, Inter local, oscuro automático, responsive y movimiento reducido.
- `src/scripts/main.ts`: menú, copiar y mejora progresiva del configurador. FAQ y verificación usan `details` nativo; animaciones CSS.
- `public/og.png`: mockup aprobado redimensionado a 1200×630; no se ha recreado.

### Decisiones

1. Retícula cálida, rojo de marca y tipografía Inter servida localmente (licencia OFL en `public/fonts/OFL.txt`), siguiendo los mockups por encima de preferencias estilísticas generales.
2. Dos idiomas estáticos, sin detección automática ni scripts de traducción. Precios/cifras compartidos para evitar divergencias.
3. Formulario POST nativo, válido sin JavaScript. JS sincroniza servidores, estima su coste y activa marca blanca al elegir dominio propio. El checkout debe aplicar también esa inclusión al recibir el POST sin JS.
4. **No se inventan precios de extras**: el total muestra el coste base y «extras desde presupuesto · consúltanos» cuando proceda. El pago confirma el importe. Clientes ilimitados: no se ha inventado recargo para clientes por encima de los incluidos.
5. CSP exactamente como se solicita, sin scripts ejecutables inline. El único bloque inline es JSON-LD de tipo `application/ld+json`: datos estructurados no ejecutables para SEO, no JavaScript. No hay scripts de pago, analítica ni cookies.
6. Conversación ilustrativa completa y progresiva: una hora por fila; firma con clave de agente aprobada. Los mensajes se leen incluso sin JS o con movimiento reducido. En móvil se muestra el resumen de dos filas del mockup y la actividad completa queda en un desplegable nativo.
7. Datos y métricas de mockups etiquetados como ejemplos; sin nombres de clientes reales. «Verificación» es desplegable con teclado.

## Revisar antes de publicar

- Confirmar vigencia comercial de 1,50 €/servidor MSP, 1 € MSP Pro, mínimos 50/1.000, 5 servidores/1 empresa gratis, cuota de IA, 10 primeros clientes y significado comercial de «clientes ilimitados».
- Aprobar importes y condiciones de extras, y textos «desde»; hoy no hay importes inventados.
- Validar cifras 359/545 y postura 96/100, tiempos «en minutos», escenario de 7/4/3 servidores, identificador CVE y kernel ilustrativos. No son telemetría en directo.
- Revisar las afirmaciones de firma, snapshots, deshacer, aislamiento y ubicación europea con el responsable de producto.
- Revisar CTA signup frente a solicitud de acceso gratis, URL y contrato POST de checkout (`hosts`, `clients`, `whitelabel`, `domain`, `company`, `email`). No se ha enviado una compra real durante las pruebas.
- **Todos los textos legales son provisionales y están marcados PENDIENTE DE REVISIÓN LEGAL**. Completar titular, NIF, domicilio, responsable, base jurídica, conservación, destinatarios, derechos y condiciones de contratación.
- Revisión editorial de la traducción inglesa y las mismas condiciones comerciales.

## Pruebas

```sh
npx playwright install chromium
npm run build
npm test
```

Playwright prueba ambos idiomas en 360, 390, 768, 1280, 1586 y 1920 px, ausencia de desbordamiento, errores de consola/CSP, accesibilidad AA con axe en claro/oscuro, menú y Escape, copiar, configurador y datos POST sin comprar, acordeón, enlaces locales y formulario sin JS. Capturas en `artifacts/`.

Lighthouse puede ejecutarse sobre `npm run preview`; los resultados de la verificación se documentan en `artifacts/verification.md`. Las puntuaciones locales no garantizan idénticos resultados en el dominio publicado.

## GitHub Pages

Workflow `.github/workflows/deploy.yml`: en push a `main`, la acción oficial `withastro/action` instala, construye y sube `dist/`; `actions/deploy-pages` publica. Sigue el [flujo oficial de Astro](https://github.com/withastro/action).

1. Repositorio → **Settings → Pages → Source: GitHub Actions**.
2. Dominio personalizado: **patchsre.com** y activar **Enforce HTTPS** cuando esté disponible.
3. En Cloudflare, dominio raíz (`@`):

| Tipo | Destino |
|---|---|
| A | 185.199.108.153 |
| A | 185.199.109.153 |
| A | 185.199.110.153 |
| A | 185.199.111.153 |
| AAAA | 2606:50c0:8000::153 |
| AAAA | 2606:50c0:8001::153 |
| AAAA | 2606:50c0:8002::153 |
| AAAA | 2606:50c0:8003::153 |

4. `www`: CNAME a `<usuario>.github.io` (sustituir por el usuario/organización real).
5. Mientras GitHub emite el certificado, mantener registros en **solo DNS (nube gris)**. Después se puede activar el proxy.

`astro.config.mjs` fija `site: 'https://patchsre.com'`, sin `base`, y `output: 'static'`. `public/CNAME` y `public/.nojekyll` se copian al resultado. Pages no admite cabeceras propias: CSP y referrer se declaran mediante meta. Nunca pongas claves en el sitio estático.
