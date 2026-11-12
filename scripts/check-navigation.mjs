import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {transformWithEsbuild} from 'vite';

const handlers = new Map();
const values = new Map();
let top = 500;
let bottom = 2500;
let keyboardFocus = false;
const brand = {contains:()=>false};
const header = {
  offsetHeight:80,
  querySelector:selector=>selector === '.brand' ? brand : keyboardFocus ? {} : null,
  querySelectorAll:()=>[],
  style:{setProperty:(key,value)=>values.set(key,Number(value))},
  classList:{toggle:()=>{}},
  addEventListener:()=>{},
};
const contact={getBoundingClientRect:()=>({top:4000})};
const journey={getBoundingClientRect:()=>({top,bottom})};
const desktop={matches:true,addEventListener:()=>{}};
const reduced={matches:false,addEventListener:()=>{}};
const {code}=await transformWithEsbuild(await readFile(new URL('../src/navigation.ts',import.meta.url),'utf8'),'navigation.ts',{loader:'ts',format:'cjs'});
const sandbox={module:{exports:{}},exports:{},document:{querySelector:()=>header,getElementById:id=>id==='journey'?journey:id==='contact'?contact:null,activeElement:{}},matchMedia:query=>query.includes('min-width')?desktop:reduced,addEventListener:(key,fn)=>handlers.set(key,fn),requestAnimationFrame:()=>1};
vm.runInNewContext(code,sandbox);
const update=()=>sandbox.module.exports.initNavigation();
update();
assert.equal(values.get('--nav-visibility'),1);
top=150; update(); assert.equal(values.get('--nav-visibility'),.5,'Entry fades continuously');
top=0; update(); assert.equal(values.get('--nav-visibility'),0,'Pointer focus must not pin the header open');
bottom=190; update(); assert.equal(values.get('--nav-visibility'),.5,'Exit recovers continuously');
bottom=80; update(); assert.equal(values.get('--nav-visibility'),1);
bottom=2500;keyboardFocus=true;update();assert.equal(values.get('--nav-visibility'),1,'Keyboard focus remains visible');
keyboardFocus=false;reduced.matches=true;update();assert.equal(values.get('--nav-visibility'),1);
reduced.matches=false;desktop.matches=false;update();assert.equal(values.get('--nav-visibility'),1,'Static mobile chapters retain navigation');
const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
assert.ok(html.includes('MIGU · MADE WITH CURIOSITY'));
assert.ok(!html.match(/id="copy-wechat"[^]*?<\/button>/)?.[0].includes('<svg'));
assert.ok(!html.match(/href="mailto:[^]*?<\/a>/)?.[0].includes('<svg'));
console.log('PASS: navigation entry/exit, pointer vs keyboard focus, reduced motion, mobile, footer and arrow regressions');
