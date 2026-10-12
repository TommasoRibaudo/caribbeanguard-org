import {test} from 'node:test';
import assert from 'node:assert/strict';
import {searchEntries} from '../src/lib/search.ts';
const entries=[
 {title:'Natación · Swim Club',href:'/swim-club',category:'Programa',summary:'Clases para la comunidad',keywords:'natacion piscina niños',body:'Entrenamiento en Punta Uva'},
 {title:'Punta Uva',href:'/mapa?z=punta-uva',category:'Playa',summary:'Guía general',keywords:'playa'},
 {title:'Contacto y voluntariado',href:'/involcrate',category:'Contacto',summary:'Escribe a la organización',keywords:'contacto colaborar'},
];
test('accents and English aliases return the same relevant destination',()=>{for(const q of ['natación','NATACION','swimming','natac'])assert.equal(searchEntries(entries,q)[0]?.href,'/swim-club');});
test('exact beach title beats an incidental mention in program text',()=>{assert.equal(searchEntries(entries,'Punta Uva')[0]?.href,'/mapa?z=punta-uva');});
test('all meaningful terms must match, rather than returning unrelated pages',()=>{assert.deepEqual(searchEntries(entries,'natación volcan'),[]);assert.equal(searchEntries(entries,'natacion para niños')[0]?.href,'/swim-club');});
test('empty, punctuation and unmatched queries do not suggest irrelevant content',()=>{for(const q of ['', '   ', '!!!', 'de la', '<script>alert(1)</script>', 'zzzzzz'])assert.deepEqual(searchEntries(entries,q),[]);});
test('English contact queries locate the contact page',()=>{assert.equal(searchEntries(entries,'email')[0]?.href,'/involcrate');});
