import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {runInNewContext} from 'node:vm';

const out=resolve(process.argv[2]||'out/internal-review');
const data=name=>JSON.parse(readFileSync(`web/data/${name}`,'utf8'));
const html=readFileSync('web/index.html','utf8');
const section=(start,end)=>html.slice(html.indexOf(start),html.indexOf(end,html.indexOf(start)));
const context={};
runInNewContext(readFileSync('web/danger.js','utf8'),context);
const beaches=runInNewContext(section('const ZONES = [','/* Rescue stations:')+
  '\n[...ZONES,...UNASSESSED_BEACHES]',context);
const labels=runInNewContext(section('const PLACES = [','// Zone names')+'\n[...PLACES,SEA]',context);
const rows=[];
const map='http://localhost:5174/';
function add({id,type,label,point,source,status,visibility='Mapped',notes='',review='',link='',mark=false,partner=false,baseline=''}) {
  const [lon,lat]=point??[];
  const mapLink=link ? `${map}?${link}` : Number.isFinite(lat)
    ? `${map}?review=${lat},${lon}${mark?`&mark=${encodeURIComponent(id)}`:''}` : '';
  rows.push([id,type,label??'',visibility,status,review,lat??'',lon??'',baseline,source??'',mapLink,notes,'Pending','',
    partner?'Candidate for review':'','','']);
}
function position({type,coordinates}){
  if(type==='Point') return coordinates;
  const line=type==='Polygon'?coordinates[0]:coordinates;
  return line[Math.floor(line.length/2)];
}
const kinds={location:'Location',rip_current:'Rip current',strong_current_area:'Strong-current area',
  rescue_station:'Rescue station',proposed_rescue_station:'Proposed rescue station',
  proposed_cg_station:'Proposed CG station',unclassified_facility:'Unclassified symbol',medical_station:'Medical station'};
const projected=new Map(data('full-map-geographic.geojson').features.map(f=>[f.id,f]));
for(const f of data('review-features.geojson').features){
  const previous=projected.get(f.id);
  projected.set(f.id,{...f,properties:{...previous?.properties,...f.properties}});
}
for(const f of projected.values()){
  const p=f.properties,kind=p.kind;
  const hidden=f.id==='pdf:location/408'||kind.startsWith('proposed')||kind==='unclassified_facility';
  const notes=p.review_item===2?'Moved existing record 3.1; confirm installation and availability.':
    kind==='medical_station'?'Reported AED and trauma kit; confirm access, availability, and location.':
    p.position_approximate?'Approximate supplied pin; confirm installation and location.':
    kind==='rescue_station'?'Confirm access and availability.':(p.category||'');
  add({id:f.id,type:kinds[kind],label:kind==='medical_station'?`Medical station ${p.number} · ${p.name}`:
    p.display_name||p.osm_name||p.name||[kinds[kind],p.number].filter(Boolean).join(' '),
    point:position(f.geometry),source:p.source_url??(p.review_item?'Annotated map review screenshot':p.registration),
    status:p.needs_confirmation?'Needs field check':'Source located',
    visibility:hidden?'Hidden source mark':'Mapped',notes,review:p.review_item||'',mark:!hidden,
    partner:kind==='location'&&['eat','stay','shop'].includes(p.category)});
}
for(const b of beaches)
  add({id:b.id,type:'Beach',label:b.name.es||b.name,point:[b.at[1],b.at[0]],
    source:'Caribbean Guard map review',status:'Baseline supplied',
    review:'9',link:`${b.character?'z':'b'}=${b.id.split('/')[1]}`,baseline:context.CGDanger.beaches[b.id],
    notes:b.character?'Existing local guidance applies.':'Confirm local assessment and mapped extent.'});
for(const f of data('cg-hazards.geojson').features){
  const p=f.properties,station=p.kind==='rescue_station';
  add({id:f.id,type:p.proposed?'Proposed rescue station':kinds[p.kind],
    label:[kinds[p.kind],p.source_number].filter(Boolean).join(' '),point:position(f.geometry),
    source:p.source,status:'Needs field check',visibility:p.proposed?'Hidden source mark':p.kind==='rip_current'?'Fallback only':'Mapped',
    link:station&&!p.proposed?`p=${f.id.split('/')[1]}`:'',
    notes:p.kind==='rip_current'?'Shown when projected current data fails.':''});
}
for(const f of data('osm-roads.geojson').features){
  const p=f.properties;
  add({id:f.id,type:p.road_class==='path'?'Path':'Road',label:p.name||p.highway,point:position(f.geometry),
    source:`https://www.openstreetmap.org/way/${p.osm_way_id}`,status:'Access unverified',notes:'Map link opens a representative vertex.'});
}
for(const f of data('coast-bands.geojson').features){
  const {id,kind}=f.properties,key=`${id}/${kind}`;
  const n=rows.filter(r=>r[0].startsWith(key+'/')).length+1;
  add({id:`${key}/${n}`,type:'Coastal geometry',label:`${id.split('/')[1]} · ${kind}`,point:position(f.geometry),
    status:'Display geometry',source:'coast-bands.geojson',visibility:kind==='band'?'Mapped':'Source geometry'});
}
for(const [group,lines] of Object.entries(data('zones-geometry.json'))) {
  if(!['zones','provisional'].includes(group)) continue;
  for(const [id,line] of Object.entries(lines)){
    const [lat,lon]=line[Math.floor(line.length/2)];
    add({id:`${id}/shoreline`,type:'Shoreline',label:id.split('/')[1],point:[lon,lat],
      status:group==='provisional'?'Approximate extent':'Display geometry',source:'zones-geometry.json',visibility:'Beach selection target'});
  }
}
for(const a of data('access-points.json').entries)
  add({id:`access:${a.id}`,type:'Access point',label:a.name?.es||a.name||a.label?.es||a.label||'Access to '+(beaches.find(b=>b.id===a.beach)?.name?.es||a.beach.split('/').at(-1)),point:a.point,
    source:a.source_url||a.source||'access-points.json',status:'Access unverified',link:`a=${a.id}`,notes:'Includes the mapped approach path.'});
for(const ref of data('rip-reference-images.json').features)
  add({id:`reference:${ref.id}`,type:'Reference image',label:ref.name.es,point:ref.point,
    source:ref.original_file,status:ref.alignment==='imagery_matched'?'Image matched':'Approximate reference'});
for(const sign of data('signposts.json').entries)
  add({id:`sign:${sign.id}`,type:'Sign candidate',label:sign.name.es,point:sign.point,status:'Draft installation',
    source:'signposts.json',link:`sign=${sign.id}`,notes:sign.placement,review:'18'});
for(const {ll,t} of labels)
  add({id:`label:${t}`,type:'Map label',label:t,point:[ll[1],ll[0]],source:'Map label anchor',status:'Display label'});

rows.sort((a,b)=>Boolean(b[5])-Boolean(a[5])||(Number(a[5])-Number(b[5]))||a[1].localeCompare(b[1])||String(a[2]).localeCompare(String(b[2])));
if(new Set(rows.map(row=>row[0])).size!==rows.length) throw Error('Duplicate review IDs');
const headers=['Feature ID','Type','Name','Map visibility','Evidence status','Feedback item','Latitude','Longitude','Baseline / 5',
  'Source','Local map link','Location notes','Review decision','Reviewer notes','Partner eligibility','Sponsorship status','Public listing approval'];
const csv=value=>`"${String(value).replaceAll('"','""').replace(/^[=+@\t\r]|^-(?!\d+$|\d+[.]\d+$)/,m=>"'"+m)}"`;
const esc=value=>String(value).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
mkdirSync(out,{recursive:true});
writeFileSync(resolve(out,'map-inventory.csv'),'\ufeff'+[headers,...rows].map(r=>r.map(csv).join(',')).join('\r\n')+'\r\n');
const cells=rows.map(([id,type,name,visibility,status,review,lat,lon,base,source,link,notes,,,partner])=>
   `<tr data-type="${esc(type)}" ${review?'data-feedback':''} data-review="${esc(review)}">
   <td>${review?`<span class="item">#${esc(review)}</span> `:''}${esc(name)}<small>${esc(id)}</small></td>
   <td>${esc(type)}</td><td>${esc(visibility)}<small>${esc(status)}</small></td>
   <td>${lat!==''?`${Number(lat).toFixed(6)}, ${Number(lon).toFixed(6)}`:'—'}${base?`<small>Baseline ${base}/5</small>`:''}</td>
   <td>${esc(notes)}<small>${esc(source)}</small>${partner?'<small>Partner candidate for review</small>':''}</td>
   <td>${link?`<a href="${esc(link)}" target="_blank" rel="noopener">View map</a>`:''}</td></tr>`).join('');
const typesList=[...new Set(rows.map(r=>r[1]))].sort().map(t=>`<option>${esc(t)}</option>`).join('');
const page=readFileSync('tools/map-inventory-template.html','utf8')
  .replace('%%TOTAL%%',String(rows.length)).replace('%%TYPES%%',typesList).replace('%%ROWS%%',cells);
writeFileSync(resolve(out,'index.html'),page);
console.log(`${rows.length} feature records across ${new Set(rows.map(r=>r[1])).size} types.`);
