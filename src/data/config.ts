// Single source of truth for prices, limits, example figures and destinations.
// Extras have no approved numeric price: quote them rather than inventing fees.
export const config = {
 login:'https://manager.patchsre.com/ui/',
 signup:'https://patch.nimboxsre.com/ui/signup?plan=free',
 freeAccess:'mailto:hola@patchsre.com?subject=Acceso%20gratis%20a%20Patch',
 demo:'mailto:hola@patchsre.com?subject=Demo%20de%20Patch',
 contact:'mailto:hola@patchsre.com', checkout:'https://api.patchsre.com/checkout',
 mcp:'https://patch.nimboxsre.com/mcp',
 prices:{msp:1.5,pro:1}, limits:{freeHosts:5,freeClients:1,minHosts:50,defaultHosts:100,includedClients:10,proHosts:1000,sliderMax:5000},
 figures:{discarded:359,total:545,ports:0,posture:96,affected:7,notExposed:4,patched:3,exampleClients:30,exampleHosts:800,cve:'CVE-2026-31431',kernel:'6.8.0-149'},
 distributions:['Debian','Ubuntu','RHEL','AlmaLinux','Rocky','Oracle Linux','CentOS','Fedora','Arch','Alpine','openSUSE'],
};
export const command = `mcp add patch ${config.mcp} --header "Authorization: Bearer pmk_…"`;
