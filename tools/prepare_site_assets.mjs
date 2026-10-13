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
const missing=assets.filter(asset=>!existsSync(resolve(web,asset)));
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
for(const asset of ['index.html','coastal.css','symbols.js','geometry.js','sw.js','manifest.json','card.jpg','data','icons','fonts','vendor','tiles']) cpSync(resolve(web,asset),resolve(target,asset),{recursive:true});
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
 // Vercel cleanUrls serves index.html at /mapa/app (without a slash).
 // Pin the asset directory before any relative styles, scripts or fetches.
 .replace('<head>', '<head>\n<base href="/mapa/app/">')
 .replace('</head>',historyBridge+'\n</head>')
 .replace('else if(history.state && history.state.cgSheet)', 'else if(window.parent === window && history.state && history.state.cgSheet)')
 .replace(/href="https:\/\/(?:www\.)?caribbeanguard\.org\/?"/g,'href="/" target="_top"')
 .replace('const CG_HOME = "https://caribbeanguard.org";', 'const CG_HOME = "/";')
 .replace('href="${CG_HOME}"', 'href="${CG_HOME}" target="_top"');
writeFileSync(resolve(target,'index.html'),index);
// The embedded page has website Back behavior, so keep an explicit touch-sized
// close control instead of relying on the standalone map's browser Back entry.
const embeddedCss=readFileSync(resolve(target,'coastal.css'),'utf8')+`
@media(max-width:819px){
 .sheet .close,.sheet.no-close .close{position:absolute;top:6px;right:14px;z-index:5;width:44px;height:44px;overflow:visible;clip:auto;clip-path:none;white-space:normal;border:1px solid var(--line);padding:0}
}
`;
writeFileSync(resolve(target,'coastal.css'),embeddedCss);
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
