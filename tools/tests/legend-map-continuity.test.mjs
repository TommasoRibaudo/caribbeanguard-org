import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../../web/index.html',import.meta.url),'utf8').replace(/\r\n/g,'\n');
function fn(name){const start=source.indexOf('function '+name+'(');return source.slice(start,source.indexOf('\n}\n',start)+3);}
const classes=()=>({contains:()=>false,add(){},remove(){},toggle(){}});

test('the rescue layer owns original stations as well as imported equipment',()=>{
 const stations=[{id:'est1'},{id:'est3'},{id:'est4'}];
 const groups=[];
 const ctx={sourceLayerDefs:[['rescue'],['hazards']],map:{},postMarkers:Object.fromEntries(stations.map(s=>[s.id,s])),
  L:{layerGroup:()=>{const members=new Set();const group={addTo(){return this;},addLayer(marker){members.add(marker);},members};groups.push(group);return group;}}};
 const start=source.indexOf('const sourceLayers =');
 vm.runInNewContext(source.slice(start,source.indexOf('const ripReferenceMarkers',start)),ctx);
 assert.deepEqual([...groups[0].members],stations);
});

test('fallback rip arrows obey the same hazard switch when projected data is unavailable',()=>{
 const parents=[],hazards={id:'hazards'};
 const ctx={map:{on(){}},sourceLayers:{hazards},ANNOT:{rips:[]},L:{layerGroup:()=>({addTo(parent){parents.push(parent);return this;}})}};
 vm.runInNewContext(fn('drawAnnotations')+';drawAnnotations({features:[]});',ctx);
 assert.equal(parents[1],hazards);
});

test('all mapped danger bands appear before selection and update together without replacing geometry',()=>{
 const data=JSON.parse(fs.readFileSync(new URL('../../web/data/coast-bands.geojson',import.meta.url),'utf8'));
 const paths=[], dangerBands={};
 let shorelines;
 let status='baseline';
 const ctx={data,bandZone:null,bandLayers:new Map(),BAND_PANE:'cgBandPane',
  sourceLayers:{danger_bands:dangerBands},ratingDays:()=>[{status}],installBandShoreGap:lines=>{shorelines=lines;},
  L:{geoJSON(feature,{style,interactive}){
   const path={feature,style,interactive,setStyle(next){this.style=next;},addTo(group){
    this.group=group;paths.push(this);return this;
   }};
   return path;
  }}};
 const danger=fs.readFileSync(new URL('../../web/danger.js',import.meta.url),'utf8');
 const geometry=fs.readFileSync(new URL('../../web/geometry.js',import.meta.url),'utf8');
 const functions=['bandStyle','restyleBands','drawBands','showBand','clearBand'].map(fn).join('\n');
 vm.runInNewContext(danger+'\n'+geometry+'\n'+functions+'\ndrawBands(data);',ctx);
 const expected=data.features.filter(feature=>feature.properties.kind==='band');
 assert.deepEqual(paths.map(path=>path.feature),expected);
 assert.equal(shorelines.length,expected.length);
 for(const [index,band] of expected.entries()){
  const id=band.properties.id;
  const shore=Array.from(shorelines[index],point=>Array.from(point).reverse());
  const offshore=data.features.find(feature=>feature.properties.id===id&&feature.properties.kind==='offshore');
  assert.ok(shore.length>2);
  assert.ok(shore.every(point=>band.geometry.coordinates[0].some(v=>String(v)===String(point))));
  assert.ok(!shore.some(point=>offshore.geometry.coordinates.some(v=>String(v)===String(point))));
 }
 assert.ok(paths.every(path=>path.group===dangerBands && path.interactive===false && path.style.fillOpacity>0));
 const ambientOpacity=paths[0].style.fillOpacity;
 const puertoViejo=paths.find(path=>path.feature.properties.id==='cg:zone/salsa-brava');
 vm.runInNewContext('showBand({id:"cg:zone/salsa-brava"});',ctx);
 assert.ok(puertoViejo.style.fillOpacity>ambientOpacity);
 assert.ok(paths.filter(path=>path!==puertoViejo).every(path=>path.style.fillOpacity===ambientOpacity));
 status='storm';
 vm.runInNewContext('restyleBands(); clearBand();',ctx);
 assert.equal(puertoViejo.style.fillColor,ctx.CGDanger.colors[2]);
 assert.ok(paths.every(path=>path.style.fillOpacity===ambientOpacity));
 assert.deepEqual(paths.map(path=>path.feature),expected);
});

test('reference-image pins yield to rescue and medical stations and return when zoom separates them',()=>{
 const node=(kind,x)=>{const names=new Set([kind]),attributes=new Map();return {x,
  classList:{contains:key=>names.has(key),remove:key=>names.delete(key),toggle(key,on){on?names.add(key):names.delete(key);}},
  style:{setProperty(){}},
  getBoundingClientRect(){return {x:this.x+(this.cgMedicalOffset?.x||0),y:100+(this.cgMedicalOffset?.y||0),width:44,height:44};},querySelector:()=>null,
  setAttribute:(key,value)=>attributes.set(key,value),getAttribute:key=>attributes.get(key)??null,removeAttribute:key=>attributes.delete(key)};};
 const rescue=node('projected-rescue',100),medical=node('projected-medical',120),reference=node('rip-reference-marker',110);
 medical.setAttribute('aria-label','Medical station 1');
 const ctx={markerLayoutFrame:0,requestAnimationFrame:callback=>{callback();return 0;},map:{eachLayer(){}},L:{Marker:class{}},
  document:{querySelectorAll:()=>[rescue,medical,reference]},lang:'en',placeBeachLabels(){}};
 vm.runInNewContext(fs.readFileSync(new URL('../../web/geometry.js',import.meta.url),'utf8')+'\n'+fn('scheduleMarkerLayout')+';scheduleMarkerLayout();',ctx);
 assert.equal(reference.getAttribute('aria-hidden'),'true');assert.equal(reference.x,110);
 assert.equal(medical.getAttribute('aria-hidden'),null);
 assert.equal(medical.getAttribute('aria-label'),'Medical station 1');
 assert.equal(medical.classList.contains('medical-offset'),true);assert.equal(medical.x,120);
 assert.equal(rescue.getAttribute('aria-label'),'Rescue station');
 reference.x=220;
 medical.x=230;
 vm.runInNewContext('scheduleMarkerLayout();',ctx);
 assert.equal(reference.getAttribute('aria-hidden'),'true');
 assert.equal(medical.classList.contains('medical-offset'),false);
 medical.x=310;
 vm.runInNewContext('scheduleMarkerLayout();',ctx);
 assert.equal(reference.getAttribute('aria-hidden'),null);assert.equal(reference.x,220);
});

test('the Playa Negra hatch reaches the reviewed location at its northwest cap',()=>{
 const {features}=JSON.parse(fs.readFileSync(new URL('../../web/data/coast-bands.geojson',import.meta.url),'utf8'));
 const playaNegra=features.filter(feature=>feature.properties.id==='cg:zone/playa-negra');
 const cap=playaNegra.find(feature=>feature.properties.side==='west').geometry.coordinates;
 const band=playaNegra.find(feature=>feature.properties.kind==='band').geometry.coordinates[0];
 const offshore=playaNegra.find(feature=>feature.properties.kind==='offshore').geometry.coordinates;
 const reviewed=[-82.77498,9.66099];
 const [shore,sea]=cap;
 const at=(reviewed[0]-shore[0])/(sea[0]-shore[0]);
 assert.ok(at>0 && at<1);
 assert.ok(Math.abs(shore[1]+at*(sea[1]-shore[1])-reviewed[1])<0.00003);
 assert.deepEqual(offshore[0],sea);
 const capStart=band.findIndex(point=>point[0]===shore[0] && point[1]===shore[1]);
 assert.ok(capStart>=0);
 assert.deepEqual(band[capStart+1],sea);
});

test('the projected marker has its label when Leaflet fires add synchronously',()=>{
 const added=[];
 const ctx={sourceLayers:{medical:{}},map:{on(){},fire(){}},projectedDetail:[],lang:'en',
  projectedNames:{medical_station:['Estación médica','Medical station']},sourceEsc:String,CGSymbols:{badge:()=>''},
  L:{divIcon:options=>options,marker(coordinates,options){
   const handlers={};
   return {options,on(type,callback){handlers[type]=callback;return this;},
    addTo(){handlers.add({target:this});return this;},
    getElement(){return {setAttribute:(name,value)=>added.push({name,value,coordinates})};}};
  }}};
 const data={features:[{id:'test:medical',properties:{kind:'medical_station',number:1},geometry:{coordinates:[-82.7,9.6]}}]};
 vm.runInNewContext(fn('medicalStationLabel')+'\n'+fn('drawProjectedAnnotations')+'\n'+'drawProjectedAnnotations(data);',{...ctx,data});
 assert.equal(added[0].value,'Medical station 1');
 assert.deepEqual(Array.from(added[0].coordinates),[9.6,-82.7]);
});
test('the visible Legend launcher opens the shared sheet rather than a capped separate tray',()=>{
 const toggle={},el={classList:classes(),setAttribute(){},querySelector:()=>toggle,querySelectorAll:()=>[],contains:()=>false};
 const dock={setAttribute(){},removeAttribute(){}};
 const calls=[];
 const ctx={document:{activeElement:null,body:{classList:classes()},getElementById:id=>id==='legend-perm'?el:id==='dock'?dock:{classList:classes()}},
  lang:'en',legendExpanded:false,legendClosingTimer:null,legendParked:false,clearTimeout(){},desktop:()=>true,
  LEGEND_SECTIONS:[],sourceLayerDefs:[],sourceLayerState:{},CGSymbols:{svg:()=>''},
  navigateFromOverview:open=>{calls.push('route');open();},openLegend:()=>calls.push('legend')};
 vm.runInNewContext(fn('renderLegendPerm')+';renderLegendPerm();',ctx);
 toggle.onclick();
 assert.deepEqual(calls,['route','legend']);
});
test('closing a beach sheet retains its geographic highlight for the map view',()=>{
 let clears=0;const sheet={classList:{...classes(),contains:()=>true}};
 const ctx={clearAccessPath(){},clearBand(){clears++;},sheet,sheetClosing:false,lastFocus:null,
 document:{contains:()=>false,querySelector:()=>null,body:{classList:classes()}},
 lastRender:null,sheetTimer:null,clearTimeout(){},panelRoute:null,desktop:()=>false,
 dockEl:{removeAttribute(){}},placeControls(){},sheetPanel:{visible:()=>400,animateTo(){}},
 setDockStop(){},dockPanel:{animateTo(){}},markCurrent(){}};
 vm.runInNewContext(fn('closeSheet')+';closeSheet({fromHistory:true});',ctx);
 assert.equal(clears,0);
});

test('assessed and unassessed map labels use the same connected route as the beach list',()=>{
 const calls=[],labels=[{},{}],beaches=[{id:'known',character:{}},{id:'unknown'}];
 const ctx={zoneLabels:[labels[0]],unassessedLabels:[labels[1]],ZONES:[beaches[0]],UNASSESSED_BEACHES:[beaches[1]],
  track(){},tappableLabel:(label,callback)=>label.open=callback,
  navigateFromOverview:open=>{calls.push('route');open();},
  openZone:z=>calls.push(z.id),openUnassessedBeach:z=>calls.push(z.id)};
 const entry=source.includes('function openBeach(')?fn('openBeach'):source.match(/const openBeach=.*;/)[0];
 const wiring=source.split('\n').filter(line=>/^(zoneLabels|unassessedLabels)\.forEach.*tappableLabel/.test(line)).join('\n');
 vm.runInNewContext(entry+'\n'+wiring,ctx);
 labels.forEach(label=>label.open());
 assert.deepEqual(calls,['route','known','route','unknown']);
});
