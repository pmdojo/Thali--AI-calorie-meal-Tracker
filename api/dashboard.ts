// Vercel serverless function — a tiny stats dashboard.
// Open https://thali-ai.vercel.app/api/dashboard , paste your STATS_TOKEN once
// (kept only in your browser's localStorage), and it renders the live counts
// from /api/stats. No secrets are embedded in this page.

export default function handler(_req: any, res: any) {
  res.setHeader('content-type', 'text/html; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.status(200).send(HTML);
}

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Thali · Usage</title>
<style>
  :root{ --bg1:#F8ECD6; --bg2:#EBC99C; --card:#FCF4E9; --ink:#3A2E1D; --muted:#8A7B66;
         --brand:#DD8A46; --brandDeep:#C26E2E; --berry:#BE4B63; --border:rgba(58,46,29,.10); }
  *{ box-sizing:border-box; }
  body{ margin:0; min-height:100vh; color:var(--ink); font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,system-ui,sans-serif;
        background:linear-gradient(168deg,var(--bg1),#F3DCBE 46%,var(--bg2)); background-attachment:fixed; padding:28px 20px 60px; }
  .wrap{ max-width:880px; margin:0 auto; }
  h1{ font-family:Georgia,'Times New Roman',serif; font-size:clamp(30px,5vw,46px); letter-spacing:-.5px; margin:8px 0 2px; }
  .sub{ color:var(--muted); margin:0 0 24px; font-size:15px; }
  .brandtag{ color:var(--brandDeep); font-weight:800; letter-spacing:2px; font-size:13px; }
  .bar{ display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom:26px; }
  input{ flex:1; min-width:200px; padding:13px 16px; border-radius:999px; border:1px solid var(--border);
         background:#fff; font-size:15px; color:var(--ink); }
  button{ padding:13px 22px; border-radius:999px; border:0; cursor:pointer; font-weight:700; font-size:15px; color:#fff;
          background:linear-gradient(120deg,#E39A57,#C26E2E); box-shadow:0 10px 22px -8px rgba(194,110,46,.55); }
  button.ghost{ background:#fff; color:var(--ink); border:1px solid var(--border); box-shadow:none; }
  .grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; }
  .card{ background:var(--card); border:1px solid var(--border); border-radius:22px; padding:22px 22px 20px;
         box-shadow:0 14px 34px -18px rgba(120,80,30,.28); }
  .card .label{ color:var(--muted); font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.4px; }
  .card .num{ font-family:Georgia,serif; font-size:44px; font-weight:800; letter-spacing:-1px; margin-top:6px; line-height:1; }
  .dot{ display:inline-block; width:9px; height:9px; border-radius:5px; margin-right:7px; vertical-align:middle; }
  .msg{ color:var(--berry); font-weight:600; margin:12px 0; }
  .foot{ color:var(--muted); font-size:13px; margin-top:22px; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="brandtag">🍛 THALI</div>
    <h1>Usage</h1>
    <p class="sub">Anonymous counts — how many people use Thali and how much they log.</p>

    <div class="bar">
      <input id="tok" type="password" placeholder="Paste your STATS_TOKEN" autocomplete="off" />
      <button onclick="save()">Load</button>
      <button class="ghost" onclick="load()">Refresh</button>
    </div>
    <div id="msg" class="msg"></div>
    <div id="grid" class="grid"></div>
    <p class="foot" id="foot"></p>
  </div>

<script>
  const CARDS = [
    { k:'total_users',     label:'Users',           c:'#DD8A46' },
    { k:'meals_logged',    label:'Meals logged',    c:'#BE4B63' },
    { k:'sessions',        label:'Sessions',        c:'#C26E2E' },
    { k:'onboarded_users', label:'Onboarded',       c:'#DD8A46' },
    { k:'scans',           label:'Scans',           c:'#BE4B63' },
    { k:'active_24h',      label:'Active · 24h',     c:'#C26E2E' },
    { k:'active_7d',       label:'Active · 7 days',  c:'#DD8A46' },
  ];
  const el = id => document.getElementById(id);
  function save(){ localStorage.setItem('thali_stats_token', el('tok').value.trim()); load(); }
  async function load(){
    const t = (el('tok').value.trim() || localStorage.getItem('thali_stats_token') || '');
    if(!t){ el('msg').textContent = 'Enter your STATS_TOKEN to view the numbers.'; return; }
    el('msg').textContent = 'Loading…'; el('grid').innerHTML = '';
    try{
      const r = await fetch('/api/stats?key=' + encodeURIComponent(t), { cache:'no-store' });
      const d = await r.json();
      if(!r.ok){ el('msg').textContent = d.error === 'unauthorized' ? 'Wrong token.' : ('Error: ' + (d.error||r.status)); return; }
      el('msg').textContent = '';
      el('grid').innerHTML = CARDS.map(c =>
        '<div class="card"><div class="label"><span class="dot" style="background:'+c.c+'"></span>'+c.label+'</div>'+
        '<div class="num">'+(Number(d[c.k]||0)).toLocaleString()+'</div></div>').join('');
      el('foot').textContent = 'Updated ' + new Date().toLocaleTimeString();
    }catch(e){ el('msg').textContent = 'Network error.'; }
  }
  const saved = localStorage.getItem('thali_stats_token');
  if(saved){ el('tok').value = saved; load(); }
</script>
</body>
</html>`;
