import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

await import('../../web/danger.js');
await import('../../web/forecast.js');
const {beaches,score,outlook}=globalThis.CGDanger;
const html=readFileSync(new URL('../../web/index.html',import.meta.url),'utf8').replace(/\r\n/g,'\n');
const mapFunction=name=>{
  const start=html.indexOf(`function ${name}(`);
  assert.notEqual(start,-1,`${name} is defined in the map`);
  return html.slice(start,html.indexOf('\n}\n',start)+3);
};
const now=Date.parse('2026-11-23T21:30:00Z')/1000;
const hour=Math.floor(now/3600)*3600;
const time=Array.from({length:33},(_,i)=>hour+i*3600);
const weather=()=>({time,weather_code:time.map(()=>2)});

test('seven baseline ratings, one step for storms, and maximum of five',()=>{
  assert.deepEqual(Object.values(beaches),[3,2,4,5,2,4,3]);
  assert.deepEqual(Object.keys(beaches).map(id=>score(id,'storm')),[4,3,5,5,3,5,4]);
  for(const id of Object.keys(beaches)) assert.equal(score(id,'unknown'),beaches[id]);
});
test('regional elevation follows the local calendar and fresh named storm codes',()=>{
  const model=weather();
  model.weather_code[10]=95;
  assert.deepEqual(outlook(model,now,now).map(x=>x.status),['baseline','storm']);
  model.weather_code[1]=96;
  assert.deepEqual(outlook(model,now,now).map(x=>x.status),['storm','storm']);
  assert.deepEqual(outlook(model,now-11000,now).map(x=>x.status),['unknown','unknown']);
  model.weather_code.fill(4);
  assert.deepEqual(outlook(model,now,now).map(x=>x.status),['unknown','unknown']);
});
test('the map overview groups wind and gusts and only flags a forecast rating increase',()=>{
  const source=['forecastReading','renderSea'].map(mapFunction).join('\n');
  const seaEl={};
  let status='baseline';
  const context={
    lang:'es',seaEl,seaData:{swell_wave_height:0.8},weatherData:{wind_speed_10m:10,wind_gusts_10m:14},forecastBusy:false,
    CGForecast:{...globalThis.CGForecast,current:value=>value},CGSymbols:{svg:()=>''},
    ratingDays:()=>[{status}],forecastIsReading:Number.isFinite,loadingValue:value=>value
  };
  const render=()=>runInNewContext(source+'\nrenderSea();',context);
  render();
  assert.match(seaEl.innerHTML, /0\.8 <small>m<\/small>/);
  assert.match(seaEl.innerHTML, /Viento[\s\S]+Ráfagas hasta 14 km\/h/);
  assert.doesNotMatch(seaEl.innerHTML, /rating-days|summary-storm/);
  context.lang='en';
  render();
  assert.match(seaEl.innerHTML, /2\.6 <small>ft<\/small>/);
  assert.match(seaEl.innerHTML, /Wind[\s\S]+Gusts up to 9 mph/);
  assert.doesNotMatch(seaEl.innerHTML, /km\/h/);
  context.lang='es';
  status='storm';
  render();
  assert.match(seaEl.innerHTML, /summary-storm[^>]*>Tormentas previstas/);
  status='unknown';
  context.weatherData={};
  render();
  assert.doesNotMatch(seaEl.innerHTML, /summary-gust|summary-storm/);
});
test('the language switches the ruler and beach distances without leaving a second scale',()=>{
  const modes=new Set();
  const context={
    lang:'es',map:{},distOrigin:{you:false},
    L:{control:{scale(options){
      const mode=options.metric?'metric':'imperial';
      assert.notEqual(options.metric,options.imperial);
      return {options,addTo(){modes.add(mode);return this;},remove(){modes.delete(mode);}};
    }}}
  };
  const distanceConstant=html.match(/^const METRES_PER_MILE = .+;$/m)?.[0];
  const setup=[distanceConstant,'let scaleControl;',...['fmtDist','updateScale'].map(mapFunction)].join('\n');
  runInNewContext(setup,context);
  const readDistances=()=>Array.from(runInNewContext('updateScale(); [fmtDist(350), fmtDist(3300)];',context));
  assert.deepEqual(readDistances(),['350 m','3,3 km']);
  assert.deepEqual([...modes],['metric']);
  context.lang='en';
  assert.deepEqual(readDistances(),['1,100 ft','2.1 mi']);
  assert.deepEqual([...modes],['imperial']);
  context.lang='es';
  assert.deepEqual(readDistances(),['350 m','3,3 km']);
  assert.deepEqual([...modes],['metric']);
});
test('review dataset preserves the moved ID and distinguishes new fixture types',()=>{
  const load=name=>JSON.parse(readFileSync(new URL(`../../web/data/${name}`,import.meta.url),'utf8'));
  const orig=load('full-map-geographic.geojson').features;
  const review=load('review-features.geojson').features;
  assert.equal(review.filter(f=>f.properties.kind==='rescue_station').length,7);
  assert.equal(review.filter(f=>f.properties.kind==='medical_station').length,4);
  const updates=review.filter(f=>orig.some(record=>record.id===f.id));
  assert.deepEqual(updates.map(f=>f.id),['pdf:rescue_station/290']);
  assert.deepEqual(updates[0].geometry.coordinates,[-82.724614,9.643213]);
  assert.equal(review.find(f=>f.properties.review_item===1).geometry.type,'LineString');
});

test('analytics only sends configured, allowlisted events without personal or map details',()=>{
  const source=readFileSync(new URL('../../web/analytics.js',import.meta.url),'utf8');
  const sent=[];
  const window={};
  window.parent=window;
  const ctx={window,document:{currentScript:{dataset:{surface:'coastal_map',region:'eu',projectToken:'phc_testtoken00000'}}},
    crypto:{randomUUID:()=> 'anonymous-test'},navigator:{},location:{protocol:'https:',origin:'https://map.invalid',pathname:'/mapa',search:'?gps=private'},
    fetch:async(url,options)=>sent.push([url,options])};
  runInNewContext(source,ctx);
  window.CGAnalytics.track('medical');
  window.CGAnalytics.track('private');
  assert.equal(sent.length,2);
  assert.equal(sent[0][0],'https://eu.i.posthog.com/i/v0/e/');
  assert.equal(sent[0][1].credentials,'omit');
  const view=JSON.parse(sent[0][1].body);
  const action=JSON.parse(sent[1][1].body);
  assert.equal(view.properties.$current_url,'https://map.invalid/mapa');
  assert.equal(action.properties.action,'medical');
  assert.equal(action.properties.$geoip_disable,true);
  assert.doesNotMatch(JSON.stringify(sent),/gps|private/);
  ctx.navigator.globalPrivacyControl=true;
  runInNewContext(source,ctx);
  assert.equal(sent.length,2);
});
