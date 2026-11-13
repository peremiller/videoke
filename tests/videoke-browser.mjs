import assert from "node:assert/strict";
import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import {join,resolve,sep} from "node:path";
import {chromium} from "playwright";

const root=resolve("dist");
const mime={".html":"text/html",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml",".webmanifest":"application/manifest+json"};
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,"http://localhost");
    const file=resolve(root,"."+decodeURIComponent(url.pathname==="/" ? "/index.html" : url.pathname));
    if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403).end();return}
    const ext=file.slice(file.lastIndexOf("."));
    res.writeHead(200,{"content-type":mime[ext]||"application/octet-stream"});
    res.end(await readFile(file));
  }catch{res.writeHead(404).end()}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const address="http://127.0.0.1:"+server.address().port;
const browser=await chromium.launch({headless:true});
try{
  for(const width of [320,390,1280])for(const colorScheme of ["light","dark"]){
    const context=await browser.newContext({viewport:{width,height:800},colorScheme});
    const page=await context.newPage();
    await page.goto(address+"/#book");
    await page.waitForSelector(".song");
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    assert.ok(overflow<=2,"horizontal overflow "+width+" "+colorScheme+": "+overflow);
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(()=>document.activeElement.classList.contains("skip-link")),true,"skip link keyboard");
    await page.locator('[data-tab="queue"]').click();
    assert.equal(new URL(page.url()).hash,"#queue");
    await page.reload();
    assert.equal(await page.locator(".sectionbar h3").textContent(),"Singing queue");
    await page.locator('[data-tab="codes"]').click();
    assert.equal(new URL(page.url()).hash,"#codes");
    await page.goBack();
    assert.equal(new URL(page.url()).hash,"#queue");
    await context.close();
    console.log("Chromium viewport and theme PASS",width,colorScheme);
  }
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto(address+"/#book");
  await page.locator("[data-res]").first().click();
  await page.locator("#singer").fill("Sample singer");
  await page.locator("#qAdd").click();
  assert.match(await page.evaluate(()=>localStorage.getItem("videokeph.unified.v1")),/Sample singer/);
  await page.reload();
  await page.locator('[data-tab="queue"]').click();
  await page.locator(".qitem").first().waitFor({state:"visible"});
  assert.ok(await page.locator(".qitem").count()>0,"queue persisted");
  await page.locator('[data-tab="book"]').click();
  await page.locator('[data-edit="12001"]').waitFor({state:"visible"});
  await page.evaluate(()=>{
    const key="videokeph.unified.v1";
    const saved=JSON.parse(localStorage.getItem(key));
    saved.codes["12001"]={magic:{code:"56789",model:"User legacy model"}};
    localStorage.setItem(key,JSON.stringify(saved));
  });
  await page.reload();
  const mergedCodes=await page.evaluate(()=>state.codes["12001"]);
  assert.equal(mergedCodes.magic.code,"56789","user-added machine code preserved");
  assert.equal(mergedCodes.platinum.code,"1426","published reference survives old single-brand saved data");
  await page.evaluate(()=>localStorage.setItem("videokeph.unified.v1","{corrupt-original"));
  await page.reload();
  assert.equal(await page.locator("#storageNotice").isVisible(),true);
  await page.locator("#coinBtn").click();
  assert.equal(await page.evaluate(()=>localStorage.getItem("videokeph.unified.v1")),"{corrupt-original","invalid stored data never overwritten");
  await context.close();
  console.log("Chromium local data preservation PASS");
}finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
