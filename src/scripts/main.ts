const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const nav = document.querySelector<HTMLElement>('#navigation');
const closeMenu = () => {nav?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');};
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav?.classList.toggle('open',open);});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
document.querySelector<HTMLButtonElement>('[data-copy]')?.addEventListener('click',async e=>{
 const button=e.currentTarget as HTMLButtonElement;
 const status=document.querySelector('.copy-status');
 try{await navigator.clipboard.writeText(document.querySelector('#mcp-command')?.textContent||'');button.textContent=button.dataset.success!;if(status)status.textContent=button.dataset.success!;setTimeout(()=>button.textContent=button.dataset.label!,2200);}
 catch{if(status)status.textContent=button.dataset.error!;const range=document.createRange();range.selectNodeContents(document.querySelector('#mcp-command')!);getSelection()?.removeAllRanges();getSelection()?.addRange(range);}
});
const form=document.querySelector<HTMLFormElement>('[data-configurator]');
if(form){
 const hosts=form.querySelector<HTMLInputElement>('#hosts')!;
 const range=form.querySelector<HTMLInputElement>('#hosts-range')!;
 const white=form.querySelector<HTMLInputElement>('#whitelabel')!;
 const domain=form.querySelector<HTMLInputElement>('#domain')!;
 const total=form.querySelector<HTMLOutputElement>('#total')!;
 let previousWhite=white.checked;
 const update=()=>{
  const n=Number(hosts.value);
  total.value=Number.isFinite(n)&&hosts.validity.valid?new Intl.NumberFormat(form.dataset.lang==='es'?'es-ES':'en-IE',{style:'currency',currency:'EUR'}).format(n*Number(form.dataset.rate)):'—';
  form.querySelector<HTMLElement>('[data-extras]')!.hidden=!(white.checked||domain.checked);
 };
 const initialMax=Number(range.max);
 hosts.addEventListener('input',()=>{range.max=String(Math.max(initialMax,Number(hosts.value)||initialMax));range.value=hosts.value;update();});
 range.addEventListener('input',()=>{hosts.value=range.value;update();});
 domain.addEventListener('change',()=>{if(domain.checked){previousWhite=white.checked;white.checked=true;}else{white.checked=previousWhite;}update();});
 white.addEventListener('change',()=>{if(domain.checked&&!white.checked){white.checked=true;}update();});
 update();
}
