import { chromium } from 'playwright';
const DIR='/private/tmp/claude-501/-Users-rajashri-Documents-SubsTracker/045f4e12-e613-47f1-bf13-57cc84d0b9d5/scratchpad';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 402, height: 874 }, deviceScaleFactor: 2 });
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
const log=(...a)=>console.log(...a);
async function url(){ return p.url().replace('http://localhost:4599',''); }
async function clickText(re){ const el=await p.$(`text=${re}`); if(el){await el.click().catch(()=>{}); return true;} return false; }

await p.goto('http://localhost:4599/onboarding/welcome',{waitUntil:'networkidle'});
await p.evaluate(()=>localStorage.clear());
await p.goto('http://localhost:4599/onboarding/welcome',{waitUntil:'networkidle'});
await p.waitForTimeout(1000);

log('at', await url());
await clickText(/Let.s build it/i); await p.waitForTimeout(1000); log('->', await url());       // goal
await clickText(/Lose fat/i); await p.waitForTimeout(500);
await clickText(/Continue|Next/i); await p.waitForTimeout(1000); log('->', await url());          // basics
// basics: click Female, then Continue
await clickText(/Female/i); await p.waitForTimeout(300);
await clickText(/Continue|Next/i); await p.waitForTimeout(1000); log('->', await url());          // activity
await clickText(/Light|Sedentary|Moderate/i); await p.waitForTimeout(300);
await clickText(/Continue|Next/i); await p.waitForTimeout(1000); log('->', await url());          // plate
await clickText(/Dal/i); await clickText(/Rice/i); await clickText(/Sabzi/i); await p.waitForTimeout(300);
await clickText(/Continue/i); await p.waitForTimeout(1000); log('->', await url());                // conditions
await clickText(/Continue|Skip|None/i); await p.waitForTimeout(1000); log('->', await url());      // review
const rtext=await p.evaluate(()=>document.body.innerText.slice(0,60).replace(/\n/g,' '));
log('review text:', JSON.stringify(rtext));
await clickText(/Start|Let.s go|Finish|Looks good|Continue|Build/i); await p.waitForTimeout(1500); log('final ->', await url());
const ftext=await p.evaluate(()=>document.body.innerText.slice(0,70).replace(/\n/g,' '));
log('final text:', JSON.stringify(ftext));
log('ERRORS:', errs.slice(0,5).join(' | ')||'none');
await b.close();
