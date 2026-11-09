import type { APIRoute } from 'astro';
export const GET: APIRoute = () => {
 const routes=['/','/aviso-legal/','/privacidad/','/cookies/','/en/','/en/aviso-legal/','/en/privacidad/','/en/cookies/'];
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(path=>`<url><loc>https://patchsre.com${path}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});
};
