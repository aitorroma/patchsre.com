import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({site:'https://patchsre.com',output:'static', integrations:[sitemap()],vite:{build:{assetsInlineLimit:0},plugins:[tailwindcss()]},build:{inlineStylesheets:'never'},devToolbar:{enabled:false}});
