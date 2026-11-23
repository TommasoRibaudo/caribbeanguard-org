import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const context={};
runInNewContext(readFileSync(new URL('../../web/geometry.js',import.meta.url),'utf8'),context);
const layout=entries=>Array.from(context.CGGeom.declutterMarkers(entries));
const rescue={id:'rescue',x:100,y:100,size:44,priority:100,required:true};
const access={id:'access',x:120,y:110,size:44,priority:50};
const groups=entries=>context.CGGeom.groupMarkers(entries);
const offset=(entry,obstacles)=>({...context.CGGeom.offsetFromMarkers(entry,obstacles)});

test('colliding stations group at an existing anchor without modifying coordinates',()=>{
  const entries=[rescue,{...rescue,id:'second',x:130},{...rescue,id:'third',x:220}];
  const before=JSON.stringify(entries),result=groups(entries);
  assert.equal(result.length,2);
  assert.equal(result[0].anchor,entries[0]);
  assert.deepEqual(Array.from(result[0].members,m=>m.id),['rescue','second']);
  assert.equal(JSON.stringify(entries),before);
});

test('zoom separates every station and no chain pulls distant stations into a group',()=>{
  assert.equal(groups([rescue,{...rescue,x:160},{...rescue,x:220}]).length,3);
  const result=groups([rescue,{...rescue,x:150},{...rescue,x:200}]);
  assert.equal(result.length,2);
  assert.equal(result[0].members.length,2);
  assert.equal(groups([]).length,0);
});

test('rescue wins over nearby access without changing either geographic anchor',()=>{
  const entries=[access,rescue],before=JSON.stringify(entries);
  assert.deepEqual(layout(entries),['rescue']);
  assert.equal(JSON.stringify(entries),before);
});
test('access returns when zoom separates it or its blocking layer is removed',()=>{
  assert.deepEqual(layout([rescue,{...access,x:160}]),['rescue','access']);
  assert.deepEqual(layout([access]),['access']);
});
test('access beats a place, access pairs thin consistently, all rescue markers remain',()=>{
  const other={...rescue,id:'rescue2',x:102};
  const a={...access,x:200,y:200};
  const b={...a,id:'access2',x:210};
  const place={...a,id:'place',priority:10};
  assert.deepEqual(layout([place,a,b,other,rescue]),['rescue2','rescue','access']);
});
test('touch areas retain six pixels of separation at the exact boundary',()=>{
  assert.deepEqual(layout([rescue,{...access,x:149,y:100}]),['rescue']);
  assert.deepEqual(layout([rescue,{...access,x:150,y:100}]),['rescue','access']);
});

test('a nearby medical pin clears a rescue pin with the shortest offset and preserves both anchors',()=>{
  const medical={x:123,y:100,size:44};
  const obstacles=[rescue];
  const before=JSON.stringify([medical,obstacles]);
  assert.deepEqual(offset(medical,obstacles),{x:25,y:0});
  assert.equal(JSON.stringify([medical,obstacles]),before);
  assert.deepEqual(offset({...medical,x:148},obstacles),{x:0,y:0});
});

test('a medical pin can shift sideways when a second rescue pin blocks the direct route',()=>{
  const medical={x:123,y:100,size:44};
  const obstacles=[rescue,{...rescue,x:151}];
  const shift=offset(medical,obstacles);
  assert.notEqual(shift.y,0);
  for(const obstacle of obstacles){
    assert.ok(Math.hypot(medical.x+shift.x-obstacle.x,medical.y+shift.y-obstacle.y)>=48);
  }
  assert.ok(Math.hypot(shift.x,shift.y)<=56);
});

test('a crowded medical pin stays anchored when its nearby offset is blocked',()=>{
  const medical={x:100,y:100,size:44};
  const obstacles=[rescue,...[[140,100],[100,140],[60,100],[100,60]].map(([x,y])=>({x,y,size:44}))];
  assert.deepEqual(offset(medical,obstacles),{x:0,y:0});
});
