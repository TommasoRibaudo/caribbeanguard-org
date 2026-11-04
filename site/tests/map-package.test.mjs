import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const root=new URL('../../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8').replace(/\r\n/g,'\n');
const worker=read('site/public/mapa/app/sw.js');
const index=read('site/public/mapa/app/index.html');

test('embedded package contains every exact offline request and pins clean-URL assets',()=>{
  const assets=runInNewContext(worker.slice(0,worker.indexOf('async function put('))+'; [...CRITICAL,...OPTIONAL]');
  assert.match(index,/<base href="\/mapa\/app\/">/);
  for(const asset of assets){
    const resolved=new URL(asset,'https://map.test/mapa/app/');
    assert.ok(existsSync(new URL('site/public'+resolved.pathname,root)),asset);
  }
  for(const asset of ['coastal-panels.css','forecast.js','advisory.js','lifeguard.js','panel-gesture.js','signposts.js']){
    assert.ok(existsSync(new URL('site/public/mapa/app/'+asset,root)),asset);
  }
  assert.equal(read('site/public/mapa/app/coastal.css'),read('web/coastal.css'));
  assert.match(index,/qr=new URL\("\/mapa",location.origin\)/);
});

test('embedded worker only retires website map caches',async()=>{
  const events={},deleted=[];
  const context={self:{addEventListener:(type,handler)=>events[type]=handler,clients:{claim:async()=>{},matchAll:async()=>[]}},
    caches:{keys:async()=>['unrelated-site','cg-map-standalone','cg-website-map-old'],delete:async key=>deleted.push(key),
      open:async()=>({match:async()=>undefined})},URL};
  runInNewContext(worker,context);
  let settled;events.activate({waitUntil:promise=>settled=promise});await settled;
  assert.deepEqual(deleted,['cg-website-map-old']);
  assert.ok(!worker.includes('caches.match('),'cache lookups must use this embedded cache');
});

const frameSource=read('site/src/app/mapa/MapFrame.tsx');
const start=frameSource.indexOf('    function onLocation(');
const end=frameSource.indexOf('    window.addEventListener',start);
const handler=frameSource.slice(start,end).replace('event: MessageEvent','event');
function receive(overrides={}){
  const frameWindow={},calls=[];
  const event={origin:'https://map.test',source:frameWindow,data:{type:'cg-map-location',search:'?sign=merlin-entrance&a=osm-1122791652&z=cocles&p=est1&b=grande&ignored=1'},...overrides};
  runInNewContext(handler+';onLocation(event);',{event,URLSearchParams,frame:{current:{contentWindow:frameWindow}},
    window:{location:{origin:'https://map.test'},history:{state:{},replaceState:(_state,_title,url)=>calls.push(url)}}});
  return calls;
}
test('website address retains beach, station, access and poster links only',()=>{
  assert.deepEqual(receive(),['/mapa?z=cocles&b=grande&p=est1&a=osm-1122791652&sign=merlin-entrance']);
  assert.deepEqual(receive({data:{type:'cg-map-location',search:'?sign=../bad&a=%3Cscript%3E&z=cocles'}}),['/mapa?z=cocles']);
  assert.deepEqual(receive({data:{type:'cg-map-location',search:''}}),['/mapa']);
});
test('website ignores map messages from other origins, windows and payloads',()=>{
  assert.deepEqual(receive({origin:'https://other.test'}),[]);
  assert.deepEqual(receive({source:{}}),[]);
  assert.deepEqual(receive({data:{type:'other',search:'?z=cocles'}}),[]);
  assert.deepEqual(receive({data:{type:'cg-map-location',search:{}}}),[]);
});
