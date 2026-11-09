import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const lang of ['es','en']){
 const url=lang==='es'?'/':'/en/';
 for(const width of [360,390,768,1280,1586,1920]){
  test(`${lang} responsive ${width}`,async({page})=>{
   await page.setViewportSize({width,height:1000});
   const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
   await page.goto(url);await page.emulateMedia({reducedMotion:'reduce'});
   await expect(page.locator('h1')).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
   expect(errors).toEqual([]);
   expect(await page.locator('script:not([src]):not([type="application/ld+json"])').count()).toBe(0);
   if(width===390||width===1586){await page.screenshot({path:`artifacts/${lang}-${width}.png`,fullPage:true});}
  });
 }
 test(`${lang} accessible in light and dark`,async({page})=>{
  await page.goto(url);await page.emulateMedia({reducedMotion:'reduce'});
  for(const colorScheme of ['light','dark'] as const){
   await page.emulateMedia({colorScheme});
   const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   expect(result.violations).toEqual([]);
  }
 });
 test(`${lang} configurator and form`,async({page})=>{
  await page.goto(url);await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('#hosts').fill('10000');await expect(page.locator('#hosts-range')).toHaveValue('10000');
  await page.locator('#hosts').fill('200');await expect(page.locator('#hosts-range')).toHaveValue('200');
  await expect(page.locator('#total')).toContainText('300');
  await page.locator('#domain').check();await expect(page.locator('#whitelabel')).toBeChecked();await expect(page.locator('[data-extras]')).toBeVisible();
  await page.locator('#hosts').fill('49');expect(await page.locator('#hosts').evaluate((el:HTMLInputElement)=>el.checkValidity())).toBe(false);
  await page.locator('#hosts').fill('200');
  // Inspect submission without contacting checkout or creating a purchase.
  const submitted=await page.locator('form').evaluate((f:HTMLFormElement)=>({action:f.action,method:f.method,data:Object.fromEntries(new FormData(f))}));
  expect(submitted.method).toBe('post');expect(submitted.action).toBe('https://api.patchsre.com/checkout');expect(submitted.data).toMatchObject({hosts:'200',clients:'10',domain:'1',whitelabel:'1'});
  await page.locator('.faq-list summary').first().click();await expect(page.locator('.faq-list details').first()).toHaveAttribute('open','');
 });
}
test('mobile menu keyboard and copy',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.emulateMedia({reducedMotion:'reduce'});
 await page.locator('.menu-toggle').click();await expect(page.locator('#navigation')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('.menu-toggle')).toBeFocused();await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded','false');
 await page.locator('[data-copy]').click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('Authorization: Bearer pmk_…');
});
test('static links, legal pages and schema',async({page})=>{
 await page.goto('/');const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());expect(schema['@type']).toBe('SoftwareApplication');expect(schema.offers[1].price).toBe(1.5);
 const links=await page.locator('a').evaluateAll(els=>els.map(el=>el.getAttribute('href')).filter(Boolean));
 for(const path of new Set(links.filter(s=>s!.startsWith('/')&&!s!.includes('#')))){const response=await page.request.get(path!);expect(response.status()).toBe(200);}
 for(const path of ['/aviso-legal/','/privacidad/','/cookies/']){await page.goto(path);await expect(page.locator('main')).toContainText('PENDIENTE DE REVISIÓN LEGAL');}
 for(const path of ['/sitemap.xml','/sitemap-index.xml','/sitemap-0.xml','/robots.txt','/og.png','/CNAME','/404.html']){const response=await page.request.get(path);expect(response.status()).toBe(200);}
});
test('no JavaScript form remains usable',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('http://127.0.0.1:4321/');await page.locator('#hosts').fill('75');await expect(page.locator('form button')).toBeEnabled();expect(await page.locator('form').evaluate((f:HTMLFormElement)=>new FormData(f).get('hosts'))).toBe('75');await context.close();
});

test('security policy, metadata, no external runtime requests or cookies',async({page,context})=>{
 const external:string[]=[];page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4321'))external.push(r.url());});
 await page.goto('/');
 await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute('content',"default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; base-uri 'self'; form-action 'self' https://api.patchsre.com mailto:");
 expect(await context.cookies()).toEqual([]);expect(external).toEqual([]);
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://patchsre.com/');
 await expect(page.locator('a.primary').first()).toHaveAttribute('href','https://patch.nimboxsre.com/ui/signup?plan=free');
 const {width,height}=await page.evaluate(async()=>{const image=new Image();image.src='/og.png';await image.decode();return {width:image.naturalWidth,height:image.naturalHeight};});expect([width,height]).toEqual([1200,630]);
});
