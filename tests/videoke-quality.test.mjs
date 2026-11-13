import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const css=readFileSync(new URL("../redesign.css",import.meta.url),"utf8");
test("inline application script parses",()=>{
  const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
  assert.equal(scripts.length,1);
  assert.doesNotThrow(()=>new vm.Script(scripts[0]));
});
test("malformed workspace is never silently overwritten",()=>{
  assert.match(html,/storageStatus="read_or_parse_failed"/);
  assert.match(html,/if\(storageStatus!=="ready"\)/);
  assert.match(html,/state=JSON\.parse\(persistedSnapshot\)/);
  assert.match(html,/if\(!save\(\)\)/);
  assert.match(html,/id="storageNotice" role="status"/);
});
test("direct section links and keyboard navigation are supported",()=>{
  assert.match(html,/location\.hash\.slice\(1\)/);
  assert.match(html,/addEventListener\("hashchange"/);
  for(const section of ["book","queue","codes"])assert.match(html,new RegExp('data-tab="'+section+'"'));
  assert.match(html,/class="skip-link" href="#main"/);
  assert.match(html,/aria-pressed/);
  assert.match(css,/:focus-visible/);
});
test("forms are programmatically labelled and queue data escaped",()=>{
  for(const id of ["singer","cBrand","cCode","cModel"])assert.match(html,new RegExp('for="'+id+'"'));
  assert.match(html,/aria-label="Search songs/);
  assert.match(html,/aria-label="Sort song results"/);
  assert.match(html,/esc\(x\.ukc\)/);
});
test("existing data, references, songs and offline links retained",()=>{
  for(const key of ["videokeph.unified.v1","const RAW=","const VERIFIED=",'src="/queue-fix.js','src="/redesign.js','src="/sorting-priority.js']) assert.ok(html.includes(key),key);
});
