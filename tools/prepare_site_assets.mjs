// Package the existing static map under the website without changing source data.
import {cpSync,existsSync,lstatSync,mkdirSync,readFileSync,realpathSync,rmSync,writeFileSync} from 'node:fs';
import {resolve,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const web=resolve(root,'web');
const target=resolve(root,'site/public/mapa/app');
const worker=readFileSync(resolve(web,'sw.js'),'utf8');
const boundary=worker.indexOf('async function put(');
if(boundary<0) throw new Error('Cannot find offline map declarations.');
const assets=runInNewContext(worker.slice(0,boundary)+'\n[...CRITICAL,...OPTIONAL]',{},{timeout:1000});
const assetPaths=assets.map(asset=>asset.split('?')[0].replace(/^\.\//,''));
const missing=assetPaths.filter(asset=>!existsSync(resolve(web,asset)));
if(missing.length) throw new Error(`Missing ${missing.length} map assets. Generate web/tiles with python tools/build_tiles.py before starting or building the website.`);
for(const part of ['site','site/public','site/public/mapa','site/public/mapa/app']){
 const path=resolve(root,part);
 if(existsSync(path)&&lstatSync(path).isSymbolicLink()) throw new Error(`Refusing a linked output path: ${part}`);
}
if(existsSync(target)){
 if(relative(realpathSync(root),realpathSync(target)).replaceAll('\\','/')!=='site/public/mapa/app') throw new Error('Generated target is outside this checkout.');
 rmSync(target,{recursive:true});
}
mkdirSync(target,{recursive:true});
// Derive package roots from the offline manifest, including forecast modules,
// panel styles and reference images. Version queries are request keys, not files.
const packageRoots=new Set(['index.html','sw.js',...assetPaths.filter(Boolean).map(asset=>asset.split('/')[0])]);
for(const asset of packageRoots) cpSync(resolve(web,asset),resolve(target,asset),{recursive:true});
// Embedded navigation belongs to the website. Avoid iframe pushState entries:
// their popstate also reaches Next, which can reload the original beach query.
const historyBridge=`<script>
if(window.parent!==window){
 const replace=history.replaceState.bind(history);
 const update=(state,title,url)=>{
  replace(state,title,url);
  parent.postMessage({type:'cg-map-location',search:location.search},location.origin);
 };
 history.pushState=update;
 history.replaceState=update;
}
</script>`;
// In the embedded copy, branding returns to the enclosing website.
const index=readFileSync(resolve(target,'index.html'),'utf8')
 // cleanUrls serves the document at /mapa/app, so pin relative asset resolution.
 .replace('<head>', '<head>\n<base href="/mapa/app/">')
 .replace('</head>',historyBridge+'\n</head>')
 .replace('else if(history.state && history.state.cgSheet)', 'else if(window.parent === window && history.state && history.state.cgSheet)')
 .replace(/href="https:\/\/(?:www\.)?caribbeanguard\.org\/?"/g,'href="/" target="_top"')
 .replace('const CG_HOME = "https://caribbeanguard.org";', 'const CG_HOME = "/";')
 .replace('href="${CG_HOME}"', 'href="${CG_HOME}" target="_top"')
 // Shared poster/access links should re-enter through the enclosing map page.
 .replace('qr=new URL(location.pathname,location.origin)', 'qr=new URL("/mapa",location.origin)');
writeFileSync(resolve(target,'index.html'),index);
// Use the reviewed Back control and gesture system without an extra mobile X.
const embeddedCss=readFileSync(resolve(target,'coastal.css'),'utf8');
// Cache Storage is origin-wide even when a service worker has a narrow scope.
// The embedded map must only retire its own caches, not other website caches.
const revision=createHash('sha256').update(index).update(embeddedCss).digest('hex').slice(0,12);
const embeddedWorker=worker
 .replace(/const CACHE = "([^"]+)";/, `const CACHE = "cg-website-map-${revision}-$1";`)
 .replaceAll('caches.match(', '(await caches.open(CACHE)).match(')
 .replace('keys.filter(k => k !== CACHE)', 'keys.filter(k => k.startsWith("cg-website-map-") && k !== CACHE)');
writeFileSync(resolve(target,'sw.js'),embeddedWorker);
// The homepage overview shares the existing beach locations, without safety tiers.
const zonesStart=index.indexOf('const ZONES = [');
const placesEnd=index.indexOf('/* Rescue stations:',zonesStart);
if(zonesStart<0||placesEnd<0) throw new Error('Cannot locate the source beach declarations.');
const overviewPlaces=runInNewContext(index.slice(zonesStart,placesEnd)+`\n[
 ...ZONES.map(z=>({name:z.name.es,at:z.at,href:'/mapa?z='+encodeURIComponent(z.id.split('/').pop())})),
 ...UNASSESSED_BEACHES.map(b=>({name:b.name,at:b.at,href:'/mapa?b='+encodeURIComponent(b.id.split('/').pop())}))
]`,{},{timeout:1000});
if(overviewPlaces.length!==7||overviewPlaces.some(p=>!p.at?.every(Number.isFinite))) throw new Error('Invalid overview beach locations.');
writeFileSync(resolve(target,'overview-places.json'),JSON.stringify(overviewPlaces));
mkdirSync(resolve(root,'site/public/brand'),{recursive:true});
cpSync(resolve(web,'icons/caribbean-guard-logo.png'),resolve(root,'site/public/brand/caribbean-guard.png'));
console.log(`Website assets prepared; ${assets.length} offline map references verified.`);
