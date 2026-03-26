"use client";

import React, { useState, useEffect } from 'react';

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --background: #fafafa; /* Zinc 50 */
  --paper: #ffffff; /* White */
  --ink: #09090b; /* Zinc 950 */
  --ink2: #27272a; /* Zinc 800 */
  --mid: #71717a; /* Zinc 500 */
  --faint: #e4e4e7; /* Zinc 200 */
  --ghost: #f4f4f5; /* Zinc 100 */
  --ghost-border: #e4e4e7; /* Zinc 200 */
  --gem: #8b5cf6; /* Violet 500 - Electric Accent */
  --gem-dark: #7c3aed; /* Violet 600 */
  --gem-light: #f5f3ff; /* Violet 50 */
  --ok: #10b981;
  --err: #ef4444;
  --fire: #f59e0b;
  --gold: #eab308;
  --mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --sans: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --serif: var(--sans);
  --spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --out: cubic-bezier(0.16, 1, 0.3, 1);
  --radius: 16px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #09090b; /* Zinc 950 */
    --paper: #18181b; /* Zinc 900 */
    --ink: #fafafa; /* Zinc 50 */
    --ink2: #e4e4e7; /* Zinc 200 */
    --mid: #a1a1aa; /* Zinc 400 */
    --faint: #3f3f46; /* Zinc 700 */
    --ghost: #27272a; /* Zinc 800 */
    --ghost-border: #3f3f46; /* Zinc 700 */
    --gem: #a78bfa; /* Violet 400 */
    --gem-dark: #8b5cf6; /* Violet 500 */
    --gem-light: #2e1065; /* Violet 900 */
  }
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html,body{height:100%;width:100%;overflow:hidden;background:var(--background);color:var(--ink);font-family:var(--sans);-webkit-font-smoothing:antialiased;letter-spacing:-0.01em;}

/* Subtle developer dot grid background */
body {
  background-image: radial-gradient(var(--ghost-border) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* SHELL */
.shell{display:flex;flex-direction:column;height:100dvh;width:100%;opacity:0;transition:opacity 0.5s var(--out)}
.shell.on{opacity:1}

/* ─── TOP NAV (Mobile Optimized) ─── */
.topbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 64px;
  background: rgba(var(--paper), 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--ghost-border);
  position: relative;
  z-index: 40;
  gap: 8px;
}

.wordmark {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  z-index: 1;
  font-family: var(--sans);
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.05em;
  color: var(--ink);
  user-select: none;
}
.wordmark span {
  background: linear-gradient(135deg, var(--gem), #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.chips {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: flex-end;
  flex-shrink: 0;
  z-index: 1;
}
.chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--ghost);
  border: 1px solid var(--ghost-border);
  font-family: var(--mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ink2);
  cursor: pointer;
  transition: all 0.2s var(--out);
  white-space: nowrap;
  position: relative;
}
.chip:hover {
  background: var(--paper);
  border-color: var(--mid);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  color: var(--ink);
}
.chip.pop { animation: chipPop 0.35s var(--spring); }
@keyframes chipPop{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
.cdot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.cdot.f { background: var(--fire); box-shadow: 0 0 6px rgba(245,158,11,0.4); }
.cdot.g { background: var(--gem); box-shadow: 0 0 6px rgba(139,92,246,0.4); }

/* Desktop adjustments for topbar */
@media (min-width: 768px) {
  .topbar { padding: 0 32px; height: 72px; gap: 16px; background: rgba(var(--paper), 0.85); }
  .wordmark { font-size: 1.7rem; }
  .chips { gap: 8px; }
  .chip { padding: 8px 14px; font-size: 0.8rem; border-radius: 10px; }
  .cdot { width: 8px; height: 8px; }
}

/* ─── INFO POPUP ─── */
.info-popup {
  position: fixed;
  transform: translateX(-50%) translateY(5px);
  background: var(--ink);
  color: var(--background);
  padding: 14px 18px;
  border-radius: 12px;
  z-index: 1000;
  width: max-content;
  max-width: 240px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05) inset;
  pointer-events: none;
  opacity: 0;
  transition: all 0.25s var(--spring);
  text-align: left;
}
.info-popup.on {
  transform: translateX(-50%) translateY(12px);
  opacity: 1;
  pointer-events: auto;
}
.info-popup::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 12px;
  height: 12px;
  background: var(--ink);
  border-radius: 2px;
}
.info-title {
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 6px;
  color: var(--ghost);
  font-family: var(--sans);
  letter-spacing: 0.02em;
}
.info-desc {
  font-size: 0.8rem;
  line-height: 1.5;
  color: rgba(255,255,255,0.75);
  font-family: var(--sans);
}

/* MAIN */
.main{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;padding-bottom:24px;}
@keyframes viewFadeIn {
  0% { opacity: 0; transform: translateY(8px); filter: blur(2px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0px); }
}
.view{display:none}.view.on{display:block; animation: viewFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;}

/* PATH VIEW */
.path-view{padding:32px 24px 80px; max-width: 600px; margin: 0 auto;}
.unit-hd{margin-bottom:32px; text-align: center; display: flex; flex-direction: column; align-items: center;}
.unit-label{font-family:var(--mono);font-size:0.65rem;font-weight:600;letter-spacing:0.1em;color: var(--gem);text-transform:uppercase;margin-bottom:8px; background:var(--gem-light); padding:4px 10px; border-radius:100px; border: 1px solid var(--ghost-border);}
.unit-name{font-family:var(--sans);font-size:2.2rem;font-weight:800;line-height:1.1;letter-spacing:-0.04em;color:var(--ink);margin-bottom:20px}
.prog-row{display:flex;align-items:center;gap:12px; width: 100%; max-width: 240px;}
.prog-track{flex:1;height:4px;background:var(--ghost-border);border-radius:2px;overflow:hidden}
.prog-bar{height:100%;background:var(--gem);width:0%;border-radius:2px;transition:width 0.8s var(--out)}
.prog-num{font-family:var(--mono);font-size:0.7rem;font-weight:600;color:var(--mid);flex-shrink:0}

/* LEVEL ITEMS */
.levels{display:flex;flex-direction:column;gap:0}
.unit-sep{display:flex;align-items:center;gap:12px;margin:32px 0 20px}
.unit-sep:first-child{margin-top:0}
.sep-label{font-family:var(--mono);font-size:0.65rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--mid);white-space:nowrap}
.sep-name{font-family:var(--sans);font-size:1.1rem;font-weight:700;color:var(--ink);letter-spacing:-0.02em;white-space:nowrap}
.sep-line{flex:1;height:1px;background:var(--ghost-border)}

.level-item{display:flex;align-items:stretch;opacity:0;animation:fadeUp 0.4s var(--out) forwards}
.level-item:nth-child(1){animation-delay:0.04s}.level-item:nth-child(2){animation-delay:0.08s}
.level-item:nth-child(3){animation-delay:0.12s}.level-item:nth-child(4){animation-delay:0.16s}
.level-item:nth-child(5){animation-delay:0.20s}.level-item:nth-child(6){animation-delay:0.24s}
@keyframes fadeUp{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}

/* Spine */
.spine{display:flex;flex-direction:column;align-items:center;width:48px;flex-shrink:0}
.s-dot{width:10px;height:10px;border-radius:50%;margin-top:24px;flex-shrink:0;transition:all 0.3s}
.s-line{width:2px;flex:1;background:var(--ghost-border);min-height:20px}
.level-item:last-child .s-line{display:none}
.level-item.done .s-dot{background:var(--ink2)}
.level-item.active .s-dot{background:var(--gem);box-shadow:0 0 0 6px var(--gem-light)}
.level-item.locked .s-dot{background:var(--faint);border:2px solid var(--background)}

/* Card */
.lv-card{flex:1;margin:8px 0 12px 0;padding:20px;border-radius:var(--radius);border:1px solid var(--ghost-border);background:var(--paper);cursor:default;transition:all 0.3s var(--out);text-align:left;position:relative;box-shadow:0 2px 8px rgba(0,0,0,0.02)}
.lv-card.tap{cursor:pointer;}
.lv-card.tap:hover{transform:translateY(-2px);border-color:var(--mid);box-shadow:0 12px 24px -8px rgba(0,0,0,0.08)}
.lv-card.tap:active{transform:scale(0.98);box-shadow:0 2px 4px rgba(0,0,0,0.03)}
.level-item.done .lv-card{background:var(--paper);opacity:0.7;}
.level-item.active .lv-card{border-color:var(--gem);box-shadow:0 8px 24px -8px rgba(139,92,246,0.25)}
.level-item.locked .lv-card{opacity:0.5;background:transparent;border-style:dashed;}

.lv-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.lv-num{font-family:var(--mono);font-size:0.65rem;font-weight:600;letter-spacing:0.1em;color:var(--mid);text-transform:uppercase}
.lv-tag{font-family:var(--mono);font-size:0.6rem;font-weight:600;letter-spacing:0.08em;padding:4px 8px;border-radius:6px;text-transform:uppercase}
.level-item.done .lv-tag{background:var(--ghost);color:var(--ink2)}
.level-item.active .lv-tag{background:var(--gem-light);color:var(--gem)}
.level-item.locked .lv-tag{background:transparent;color:var(--mid);border:1px solid var(--ghost-border)}

.lv-title{font-family:var(--sans);font-size:1.15rem;font-weight:700;letter-spacing:-0.02em;color:var(--ink);margin-bottom:4px}
.level-item.active .lv-title{font-size:1.25rem}
.lv-sub{font-size:0.85rem;color:var(--mid);line-height:1.4}
.level-item.active .lv-sub{color:var(--ink2)}

.lv-footer{display:flex;align-items:center;justify-content:space-between;margin-top:16px;padding-top:16px;border-top:1px solid var(--ghost-border)}
.lv-gems{display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:0.7rem;font-weight:600;color:var(--mid)}
.lv-gd{width:6px;height:6px;border-radius:50%;background:var(--gem)}
.lv-arrow{width:28px;height:28px;border-radius:50%;background:var(--ghost);display:flex;align-items:center;justify-content:center;color:var(--ink);font-size:0.8rem;flex-shrink:0;transition:all 0.2s;}
.level-item.active .lv-arrow{background:var(--gem);color:white;box-shadow:0 4px 10px rgba(139,92,246,0.3)}

/* LEADERBOARD */
.lb-view{padding:32px 24px 80px; max-width: 600px; margin: 0 auto;}
.lb-title{font-family:var(--sans);font-size:2.2rem;font-weight:800;letter-spacing:-0.04em;color:var(--ink);margin-bottom:6px}
.lb-sub{font-family:var(--mono);font-size:0.65rem;font-weight:600;color:var(--mid);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:24px}
.lb-you{background:var(--ink);color:var(--background);border-radius:16px;padding:16px 20px;display:flex;align-items:center;gap:16px;margin-bottom:16px;box-shadow:0 8px 20px rgba(0,0,0,0.1)}
.lb-you-rank{font-family:var(--mono);font-size:0.8rem;font-weight:600;opacity:0.6;width:30px;flex-shrink:0}
.lb-av{width:36px;height:36px;border-radius:50%;background:var(--paper);border:2px solid rgba(255,255,255,0.15);flex-shrink:0}
.lb-you-name{font-weight:600;font-size:0.95rem;flex:1}
.lb-you-xp{font-family:var(--mono);font-size:0.8rem;font-weight:600;opacity:0.9}
.lb-rows{display:flex;flex-direction:column;gap:8px}
.lb-row{display:flex;align-items:center;gap:16px;padding:16px 20px;background:var(--paper);border-radius:16px;border:1px solid var(--ghost-border);transition:transform 0.2s;}
.lb-row:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,0.05)}
.lb-rrank{font-family:var(--mono);font-size:0.8rem;font-weight:600;color:var(--mid);width:30px;text-align:center;flex-shrink:0}
.lb-rrank.g{color:var(--gold);}
.lb-rrank.s{color:#9ca3af;}
.lb-rrank.b{color:#b45309;}
.lb-rname{flex:1;font-size:0.95rem;font-weight:600;color:var(--ink)}
.lb-rxp{font-family:var(--mono);font-size:0.8rem;font-weight:600;color:var(--mid)}

/* ─── BOTTOM NAV (Floating Pill) ─── */
.botnav {
  position: fixed;
  bottom: max(20px, env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 360px;
  z-index: 50;
  display: flex;
  align-items: center;
  background: rgba(var(--paper), 0.95);
  backdrop-filter: blur(20px);
  border-radius: 100px;
  padding: 8px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px var(--ghost-border) inset;
}
@media (prefers-color-scheme: dark) {
  .botnav { box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px var(--ghost-border) inset; }
}
.botnav .nav-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 10px 4px;
  font-family: var(--sans);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--mid);
  letter-spacing: 0.02em;
  border-radius: 100px;
  transition: all 0.2s var(--out);
  position: relative;
}
.botnav .nav-ic {
  font-size: 1.2rem;
  line-height: 1;
  transition: transform 0.2s var(--out);
}
.botnav .nav-btn:hover { color: var(--ink); background: var(--ghost); }
.botnav .nav-btn.on { color: var(--gem); background: var(--gem-light); }
.botnav .nav-btn.on .nav-ic { transform: translateY(-1px) scale(1.1); color: var(--gem); }

/* MINECRAFT ACHIEVEMENT TOAST */
@keyframes achieveSlide {
  0% { transform: translateY(-120px) translateX(-50%); opacity: 0; }
  10% { transform: translateY(0) translateX(-50%); opacity: 1; }
  90% { transform: translateY(0) translateX(-50%); opacity: 1; }
  100% { transform: translateY(-120px) translateX(-50%); opacity: 0; }
}
.toast-achieve {
  position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
  width: 320px; background: var(--paper); border: 2px solid var(--gem); border-radius: 12px;
  display: flex; align-items: center; padding: 12px 16px; gap: 16px;
  z-index: 1000; animation: achieveSlide 4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  box-shadow: 0 16px 32px rgba(0,0,0,0.2); pointer-events: none;
}
.toast-ic { font-size: 2.2rem; animation: spinBounce 2s linear infinite; }
@keyframes spinBounce { 0% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.1) rotate(15deg); } 100% { transform: scale(1) rotate(0deg); } }
.toast-content { display: flex; flex-direction: column; }
.toast-title { color: var(--gem); font-family: var(--mono); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
.toast-desc { color: var(--ink); font-family: var(--sans); font-size: 0.95rem; font-weight: 600; }

/* OVERLAYS & MODALS */
@keyframes overlayFadeIn { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(8px); } }
@keyframes sheetPopIn { from { transform: translateY(100%); opacity: 0.5; } to { transform: translateY(0); opacity: 1; } }
.overlay{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,0.5);display:flex;flex-direction:column;pointer-events:none;}
.overlay.on{pointer-events:all; animation: overlayFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;}
.sheet{margin-top:auto;background:var(--paper);border-radius:24px 24px 0 0;display:flex;flex-direction:column;max-height:92dvh;box-shadow:0 -10px 40px rgba(0,0,0,0.2)}
.overlay.on .sheet{animation: sheetPopIn 0.4s var(--spring) forwards;}

.sh-handle{display:flex;justify-content:center;padding:12px 0 0;flex-shrink:0}
.sh-bar{width:40px;height:5px;border-radius:3px;background:var(--faint)}
.sh-hd{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid var(--ghost-border);flex-shrink:0}
.sh-fname{font-family:var(--mono);font-size:0.8rem;font-weight:600;color:var(--mid)}
.sh-reward{display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:0.75rem;font-weight:600;color:var(--gem);background:var(--gem-light);padding:6px 12px;border-radius:100px;}
.sh-close{width:32px;height:32px;border-radius:50%;background:var(--ghost);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--ink2);font-family:var(--sans);font-size:1rem;transition:background 0.2s;margin-left:8px}
.sh-close:hover{background:var(--faint);color:var(--ink);}
.sh-body{flex:1;overflow-y:auto;padding:24px;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;gap:20px}

.brief-lbl{font-family:var(--mono);font-size:0.65rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--gem);margin-bottom:8px}
.brief-q{font-family:var(--sans);font-size:1.25rem;font-weight:600;line-height:1.5;color:var(--ink);letter-spacing:-0.02em}

/* Code Blocks */
.code-wrap{background:#09090b;border-radius:12px;overflow:hidden;border:1px solid var(--ghost-border);}
.code-bar{display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid #27272a;background:#18181b;}
.code-bar .d{width:10px;height:10px;border-radius:50%}
.d.r{background:#ef4444}.d.y{background:#f59e0b}.d.g{background:#10b981}
.code-tag{margin-left:auto;font-family:var(--mono);font-size:0.65rem;font-weight:600;color:#a1a1aa;letter-spacing:0.1em;text-transform:uppercase}
.code-inner{padding:20px;overflow-x:auto;font-family:var(--mono);font-size:0.9rem;color:#f4f4f5;line-height:1.6;white-space:pre}
.ck{color:#c792ea}.cf{color:#82aaff}.cs{color:#c3e88d}.cb{color:#ffcb6b;font-style:italic}

/* Multiple Choice */
.opts-lbl{font-family:var(--mono);font-size:0.65rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--mid);margin-bottom:12px}
.opts-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.opt{padding:16px;border-radius:12px;border:2px solid var(--ghost-border);background:var(--paper);font-family:var(--mono);font-size:0.9rem;font-weight:600;color:var(--ink);cursor:pointer;text-align:center;transition:all 0.15s var(--out)}
.opt:hover{border-color:var(--mid);background:var(--ghost);}
.opt.on{border-color:var(--gem);background:var(--gem);color:white;box-shadow:0 8px 20px rgba(139,92,246,0.25);transform:translateY(-2px);}

.sh-ft{padding:20px 24px max(24px,env(safe-area-inset-bottom));border-top:1px solid var(--ghost-border);flex-shrink:0;background:var(--paper)}
.check-btn{width:100%;padding:18px;border-radius:14px;border:none;background:var(--ink);color:var(--background);font-family:var(--sans);font-size:1.05rem;font-weight:700;cursor:pointer;transition:all 0.2s;box-shadow:0 8px 20px rgba(0,0,0,0.15)}
.check-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 25px rgba(0,0,0,0.2)}
.check-btn:disabled{opacity:0.3;cursor:not-allowed;box-shadow:none}
.check-btn:not(:disabled):active{transform:scale(0.98)}

/* FEEDBACK OVERLAY */
@keyframes fbOvFadeIn { from{opacity:0} to{opacity:1} }
@keyframes fbSheetSlideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
.fb-ov{position:fixed;inset:0;z-index:110;background:rgba(0,0,0,0.6);display:flex;align-items:flex-end;pointer-events:none;}
.fb-ov.on{pointer-events:all; animation: fbOvFadeIn 0.25s ease forwards;}
.fb-sheet{width:100%;background:var(--paper);border-radius:24px 24px 0 0;border-top:4px solid var(--ink);padding:32px 24px max(32px,env(safe-area-inset-bottom));box-shadow:0 -10px 40px rgba(0,0,0,0.2)}
.fb-ov.on .fb-sheet{animation: fbSheetSlideUp 0.4s var(--spring) forwards;}
.fb-sheet.ok{border-top-color:var(--ok)}.fb-sheet.err{border-top-color:var(--err)}
.fb-em{font-family:var(--sans);font-size:2rem;font-weight:800;letter-spacing:-0.03em;margin-bottom:8px}
.fb-sheet.ok .fb-em{color:var(--ok)}.fb-sheet.err .fb-em{color:var(--err)}
.fb-body{font-size:0.95rem;font-weight:500;color:var(--ink2);margin-bottom:24px;line-height:1.6}
.fb-act{width:100%;padding:16px;border-radius:12px;border:none;font-family:var(--sans);font-size:1rem;font-weight:700;cursor:pointer;transition:transform 0.1s}
.fb-act:active{transform:scale(0.98)}
.fb-sheet.ok .fb-act{background:var(--ok);color:white;box-shadow:0 8px 20px rgba(16,185,129,0.3)}
.fb-sheet.err .fb-act{background:var(--err);color:white;box-shadow:0 8px 20px rgba(239,68,68,0.3)}

/* ONBOARDING */
.ob{position:fixed;inset:0;z-index:200;background:var(--background);display:flex;flex-direction:column}
.ob-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px 0;text-align:center}
.ob-glyph{font-size:4rem;margin-bottom:24px;animation:gFloat 3s ease-in-out infinite}
@keyframes gFloat{50%{transform:translateY(-8px)}}
.ob-h{font-family:var(--sans);font-size:2.8rem;font-weight:800;letter-spacing:-0.05em;line-height:1.1;color:var(--ink);margin-bottom:16px}
.ob-h em{font-style:normal;color:var(--gem)}
.ob-p{font-size:1.05rem;color:var(--mid);line-height:1.6;max-width:300px}
.ob-foot{padding:32px 24px max(32px,env(safe-area-inset-bottom))}
.ob-dots{display:flex;justify-content:center;gap:8px;margin-bottom:24px}
.ob-dot{height:6px;border-radius:3px;background:var(--ghost-border);transition:all 0.3s var(--spring);width:16px}
.ob-dot.on{width:32px;background:var(--ink)}
.ob-btn{width:100%;padding:18px;border-radius:14px;border:none;background:var(--ink);color:var(--background);font-family:var(--sans);font-size:1.05rem;font-weight:700;cursor:pointer;transition:transform 0.1s;box-shadow:0 8px 20px rgba(0,0,0,0.15)}
.ob-btn:active{transform:scale(0.98)}

/* COMPLETE */
.done-screen{position:fixed;inset:0;z-index:200;background:var(--background);display:none;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;text-align:center}
.done-screen.on{display:flex}
.done-glyph{font-size:4rem;margin-bottom:24px;animation:gFloat 3s ease-in-out infinite}
.done-h{font-family:var(--sans);font-size:2.4rem;font-weight:800;letter-spacing:-0.04em;color:var(--ink);margin-bottom:12px}
.done-sub{font-size:1rem;color:var(--mid);margin-bottom:32px;line-height:1.6;max-width:300px}
.done-stats{display:flex;gap:12px;width:100%;max-width:400px;margin-bottom:32px}
.done-stat{flex:1;background:var(--paper);border:1px solid var(--ghost-border);border-radius:16px;padding:20px 16px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.02)}
.done-val{font-family:var(--sans);font-size:2rem;font-weight:800;letter-spacing:-0.04em;color:var(--ink)}
.done-lbl{font-family:var(--mono);font-size:0.65rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--mid);margin-top:4px}
.done-restart{width:100%;max-width:400px;padding:18px;border-radius:14px;border:none;background:var(--ink);color:var(--background);font-family:var(--sans);font-size:1.05rem;font-weight:700;cursor:pointer;transition:transform 0.1s;box-shadow:0 8px 20px rgba(0,0,0,0.15)}
.done-restart:active{transform:scale(0.98)}

/* LANG SELECTOR */
.lang-sel { display: flex; gap: 1rem; width: 100%; max-width: 500px; flex-wrap: wrap; margin-top: 2rem; justify-content: center; }
.lang-card { flex: 1; min-width: 150px; background: var(--paper); border: 1px solid var(--ghost-border); border-radius: 16px; padding: 2rem 1rem; text-align: center; cursor: pointer; transition: all 0.2s var(--out); box-shadow: 0 4px 12px rgba(0,0,0,0.03); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
.lang-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(139,92,246,0.1); border-color: var(--mid); }
.lang-ic { font-size: 3.5rem; }
.lang-card span { font-family: var(--sans); font-size: 1.25rem; font-weight: 700; color: var(--ink); }

/* INTERACTIVE TERMINAL */
.interactive-terminal {
  width: 100%; height: 160px; background: #09090b; color: #f4f4f5;
  border: 1px solid var(--ghost-border); border-radius: 12px; padding: 20px;
  font-family: var(--mono); font-size: 0.95rem; resize: none; outline: none;
  line-height: 1.6; transition: all 0.2s var(--out); box-shadow: inset 0 2px 8px rgba(0,0,0,0.2);
}
.interactive-terminal:focus { border-color: var(--gem); box-shadow: 0 0 0 4px rgba(139,92,246,0.2), inset 0 2px 8px rgba(0,0,0,0.2); }

/* SHAKE & FLOATERS */
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  50% { transform: translateX(8px); }
  75% { transform: translateX(-8px); }
  100% { transform: translateX(0); }
}
.shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
@keyframes floatUp { 0% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-50px) scale(1.1); } }
.floater { position: fixed; pointer-events: none; font-weight: 800; font-size: 1.25rem; color: var(--ok); text-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: floatUp 1s ease-out forwards; z-index: 99999; }

/* PLAYGROUND (Mobile First) */
.play-view { display: flex !important; flex-direction: column; height: 100%; padding: 32px 24px; gap: 24px; max-width: 800px; margin: 0 auto;}
.play-title { font-size: 2rem; font-weight: 800; color: var(--ink); letter-spacing: -0.04em; }
.play-container { display: flex; flex-direction: column; gap: 16px; flex: 1; min-height: 0; }
.play-actions { display: flex; flex-direction: column; gap: 16px; }
.play-code {
  flex: 1; background: #09090b; color: #f4f4f5; border-radius: 16px; padding: 24px;
  font-family: var(--mono); resize: none; outline: none; font-size: 1rem; line-height: 1.6;
  border: 1px solid var(--ghost-border); box-shadow: inset 0 2px 10px rgba(0,0,0,0.2); transition: border-color 0.2s;
}
.play-code:focus { border-color: var(--gem); box-shadow: 0 0 0 4px rgba(139,92,246,0.2), inset 0 2px 10px rgba(0,0,0,0.2); }
.play-out {
  height: 180px; background: #000000; color: var(--ok); border-radius: 16px; padding: 20px;
  font-family: var(--mono); overflow-y: auto; font-size: 0.9rem; border: 1px solid var(--ghost-border); white-space: pre-wrap;
}
.play-run {
  background: var(--ink); color: var(--background); font-weight: 700; padding: 18px; font-size: 1.05rem;
  border-radius: 14px; text-align: center; cursor: pointer; box-shadow: 0 8px 20px rgba(0,0,0,0.15); transition: transform 0.1s, box-shadow 0.2s;
}
.play-run:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(0,0,0,0.2); }
.play-run:active { transform: translateY(2px); box-shadow: none; }

/* ─── RESPONSIVE / DESKTOP ─── */
@media (min-width: 768px) {
  body { background-color: var(--background); }
  .shell { display: grid; grid-template-columns: 260px 1fr; grid-template-rows: 72px 1fr; height: 100vh; max-width: 1400px; margin: 0 auto; }
  .topbar { grid-column: 1 / -1; grid-row: 1; padding: 0 40px; border-bottom: 1px solid var(--ghost-border); box-shadow: none; }
  .botnav {
    position: static; transform: none; width: 100%; height: 100%; max-width: none;
    grid-column: 1; grid-row: 2; display: flex; flex-direction: column;
    justify-content: flex-start; align-items: stretch; background: var(--background);
    border-radius: 0; border: none; border-right: 1px solid var(--ghost-border);
    padding: 32px 20px; gap: 8px; box-shadow: none;
  }
  .botnav .nav-btn { flex-direction: row; justify-content: flex-start; padding: 14px 20px; border-radius: 12px; font-size: 1rem; font-weight: 600; gap: 16px; flex: 0 0 auto; letter-spacing: 0; }
  .botnav .nav-btn.on { border: 1px solid var(--ghost-border); box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
  .botnav .nav-btn.on .nav-ic { transform: none; }
  .main { grid-column: 2; grid-row: 2; padding: 40px; background: transparent; z-index: 1; }
  .path-view, .lb-view { max-width: 800px; margin: 0 auto; }
  .play-view { padding: 0; max-width: 1200px; margin: 0 auto; width: 100%; }
  .play-container { flex-direction: row; align-items: stretch; gap: 24px; }
  .play-actions { width: 350px; flex-shrink: 0; gap: 24px; }
  .play-out { flex: 1; height: auto; }
  .overlay { justify-content: center; align-items: center; padding: 2rem; backdrop-filter: blur(8px); }
  .sheet { max-width: 650px; margin: 0; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); max-height: 85vh; border: 1px solid var(--ghost-border); }
  @keyframes sheetPopIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .sh-handle { display: none; }
  .fb-ov { justify-content: center; align-items: center; padding: 2rem; backdrop-filter: blur(8px); }
  .fb-sheet { max-width: 440px; margin: 0; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); border-top-width: 4px; padding: 40px; }
  @keyframes fbSheetSlideUp { from{transform:scale(0.95); opacity:0;} to{transform:scale(1); opacity:1;} }
  .info-popup { transform: translateX(-50%) translateY(12px); font-size: 0.9rem; border: 1px solid rgba(255,255,255,0.1); }
  .info-popup.on { transform: translateX(-50%) translateY(24px); }
}
`;

const AudioPacks = {
  ding: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3', // More prominent professional deny/thud tone
  fanfare: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  mc_achieve: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'
};

let audioCache: any = {};

if (typeof window !== 'undefined') {
  // Preload audio instantly in the background for zero-latency playback
  Object.entries(AudioPacks).forEach(([key, url]) => {
    const audio = new Audio(url);
    audio.preload = 'auto';
    audioCache[key] = audio;
  });
}

const SoundEngine = {
  play(type: 'ding' | 'error' | 'fanfare' | 'mc_achieve') {
    if (typeof window !== 'undefined') {
      try {
        // Clone the preloaded node to allow overlapping/instant playback
        const a = (audioCache[type] ? audioCache[type].cloneNode() : new Audio(AudioPacks[type])) as HTMLAudioElement;
        a.volume = type === 'error' ? 1.0 : type === 'mc_achieve' ? 0.8 : 0.4; // Boosted error volume to max
        a.play().catch(e => console.log('Audio playback blocked by browser', e));
      } catch (e) {
        console.error("Audio error:", e);
      }
    }
  }
};

// Judge0 CE public API for C/C++ execution
const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_LANG_IDS: Record<string, number> = { c: 50, cpp: 54 };

async function runWithJudge0(code: string, lang: 'c' | 'cpp', apiKey: string): Promise<{ output: string; error: string }> {
  const langId = JUDGE0_LANG_IDS[lang];
  try {
    const submitRes = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'X-RapidAPI-Key': apiKey,
      },
      body: JSON.stringify({ source_code: code, language_id: langId, stdin: '' })
    });
    const result = await submitRes.json();
    return {
      output: (result.stdout || '').trim(),
      error: (result.stderr || result.compile_output || '').trim()
    };
  } catch (e: any) {
    return { output: '', error: e.message || 'Network error' };
  }
}

// --- DATA ---
const UNITS_PY: any[] = [
  {
    id: 1, name: 'Syntax & Structure',
    levels: [
      { id: 1, type: 'lesson', title: 'Welcome to Python', sub: 'The absolute basics', q: 'Python is a highly readable language. To output text to the screen, we use the print() function. Look at the example syntax below:', codeSnippet: 'print("Hello, World!")', reward: 50 },
      { id: 2, title: 'Output', sub: 'Your first line of Python', q: 'Which built-in outputs text to the terminal?', code: '<span class="cb">___</span>(<span class="cs">"Hello, World!"</span>)', opts: ['echo', 'print', 'write', 'log'], correct: 1, reward: 10 },
      { id: 3, type: 'lesson', title: 'Variables', sub: 'Binding names to values', q: 'Variables allow you to store data for later use. We use the equals sign "=" to assign a value to a name.', codeSnippet: 'score = 42\nname = "Shawn"', reward: 50 },
      { id: 4, title: 'Assigning', sub: 'Binding names', q: 'What operator assigns 42 to the variable score?', code: 'score <span class="cb">___</span> 42', opts: ['==', ':=', '=', '->'], correct: 2, reward: 15 },
      { id: 5, type: 'project', title: 'Module 1 Capstone', sub: 'Write it yourself', q: 'Create a variable called `message` and assign it the exact string `"Hello User"`.', code: 'message = ', validation: `assert 'message' in globals(), "You must define a variable named 'message'"\nassert message == "Hello User", "The message must be exactly 'Hello User'"`, solution: 'message = "Hello User"', reward: 100 },
    ]
  },
  {
    id: 2, name: 'Data Structures',
    levels: [
      { id: 6, type: 'lesson', title: 'Lists', sub: 'Ordered collections', q: 'Lists hold ordered collections of items. They are incredibly useful for grouping data. We create them using square brackets [].', codeSnippet: 'my_list = [1, 2, 3]\nempty_list = []', reward: 50 },
      { id: 7, title: 'List Syntax', sub: 'Creating a list', q: 'Which syntax creates an empty list?', code: 'items <span class="ck">=</span> <span class="cb">___</span>', opts: ['{}', '()', '[]', '<>'], correct: 2, reward: 20 },
      { id: 8, title: 'Length', sub: 'Measuring collections', q: 'Which function returns the number of items in a list?', code: 'count <span class="ck">=</span> <span class="cb">___</span>(items)', opts: ['size', 'count', 'length', 'len'], correct: 3, reward: 30 },
      { id: 9, type: 'project', title: 'Module 2 Capstone', sub: 'List Mastery', q: 'Create a list called `primes` containing exactly the numbers 2, 3, and 5. Then use the `.append()` method to add 7 to it.', code: '# Step 1: Create primes list\n\n# Step 2: Append 7\n', validation: `assert 'primes' in globals(), "You must define a variable 'primes'"\nassert type(primes) is list, "primes must be a list"\nassert primes == [2, 3, 5, 7], "primes must equal [2, 3, 5, 7] at the end"`, solution: 'primes = [2, 3, 5]\nprimes.append(7)', reward: 100 },
    ]
  },
  {
    id: 3, name: 'String Mastery',
    levels: [
      { id: 10, type: 'lesson', title: 'String Methods', sub: 'Manipulating text', q: 'Python strings come with powerful built-in methods. For instance, `.upper()` converts a string to uppercase.', codeSnippet: 'word = "hello"\nshout = word.upper() # "HELLO"', reward: 50 },
      { id: 11, title: 'Upper', sub: 'Changing case', q: 'What converts a string to all uppercase?', code: 'result <span class="ck">=</span> name.<span class="cb">___</span>()', opts: ['capitalize', 'upper', 'toUpper', 'toUpperCase'], correct: 1, reward: 20 },
      { id: 12, title: 'Strip', sub: 'Removing whitespace', q: 'Which removes leading and trailing whitespace?', code: 'clean <span class="ck">=</span> text.<span class="cb">___</span>()', opts: ['clean', 'trim', 'remove', 'strip'], correct: 3, reward: 25 },
      { id: 13, type: 'project', title: 'Module 3 Capstone', sub: 'Shouting Box', q: 'Create a variable `name` = "shawn". Then create a variable `shout` that equals `name` fully uppercased.', code: '# Write your code below\n', validation: `assert 'name' in globals(), "You must define 'name'"\nassert 'shout' in globals(), "You must define 'shout'"\nassert shout == "SHAWN", "shout must be 'SHAWN'"`, solution: 'name = "shawn"\nshout = name.upper()', reward: 100 },
    ]
  }
];

const UNITS_JS: any[] = [
  {
    id: 1, name: 'Syntax & Types',
    levels: [
      { id: 101, type: 'lesson', title: 'Welcome to JS', sub: 'The web language.', q: 'JavaScript powers the interactivity of the web. To print text, we use console.log().', codeSnippet: 'console.log("Hello Web!");', reward: 50 },
      { id: 102, title: 'Console', sub: 'Printing text', q: 'How do you print output in JS?', code: '<span class="cb">___</span>(<span class="cs">"Welcome"</span>);', opts: ['print', 'console.log', 'echo', 'out'], correct: 1, reward: 10 },
      { id: 103, type: 'lesson', title: 'Constants', sub: 'Immutable bindings', q: 'Use const to define variables that should not be reassigned. Use let for variables that will change.', codeSnippet: 'const maxScore = 100;\nlet current = 0;', reward: 50 },
      { id: 104, title: 'Let vs Const', sub: 'Declaration', q: 'Which keyword allows a variable to be reassigned later?', code: '<span class="cb">___</span> age = 21;', opts: ['final', 'const', 'let', 'var'], correct: 2, reward: 15 },
      { id: 105, type: 'project', title: 'Module 1 Capstone', sub: 'Declaring Data', q: 'Create a constant called `message` assigned to exactly `"Hello OS"`.', code: 'message = ', validation: `if(typeof message === 'undefined') throw new Error("message is not defined"); if(message !== "Hello OS") throw new Error("message must be 'Hello OS'");`, solution: 'const message = "Hello OS";', reward: 100 }
    ]
  },
  {
    id: 2, name: 'Arrays & Logic',
    levels: [
      { id: 106, type: 'lesson', title: 'Arrays', sub: 'Lists of data', q: 'Arrays hold ordered collections of items. They use zero-based indexing.', codeSnippet: 'const arr = [10, 20, 30];\nconsole.log(arr[0]); // Prints 10', reward: 50 },
      { id: 107, title: 'Pushing', sub: 'Adding to arrays', q: 'Which method adds an item to the end of an array in JS?', code: 'items.<span class="cb">___</span>(42);', opts: ['append', 'insert', 'add', 'push'], correct: 3, reward: 20 },
      { id: 108, type: 'project', title: 'Module 2 Capstone', sub: 'Array Building', q: 'Create an array called `nums` containing 1 and 2. Use `.push()` to add 3 to it.', code: '// Create nums and push 3\n', validation: `if(typeof nums === 'undefined') throw new Error("nums is not defined"); if(!Array.isArray(nums)) throw new Error("nums must be an array"); if(nums.length !== 3 || nums[2] !== 3) throw new Error("nums must equal [1, 2, 3]");`, solution: 'const nums = [1, 2];\nnums.push(3);', reward: 100 }
    ]
  }
];

const UNITS_C: any[] = [
  {
    id: 1, name: 'Foundations of C',
    levels: [
      { id: 201, type: 'lesson', title: 'Welcome to C', sub: 'The mother of languages', reward: 50, q: 'C is a powerful, low-level language that underpins most operating systems. Every C program starts with a main() function, and we use printf() to output text.', codeSnippet: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}' },
      { id: 202, title: 'printf', sub: 'Printing output', reward: 10, q: 'Which function prints text to the terminal in C?', code: '#include &lt;stdio.h&gt;\nint main() {\n  <span class="cb">___</span>(<span class="cs">"Hello"</span>);\n  return 0;\n}', opts: ['print', 'cout', 'printf', 'echo'], correct: 2 },
      { id: 203, type: 'lesson', title: 'Variables & Types', sub: 'Typed memory', reward: 50, q: 'In C, every variable must have a declared type. Common types include int (integer), float (decimal), and char (single character).', codeSnippet: 'int age = 25;\nfloat pi = 3.14;\nchar grade = \'A\';' },
      { id: 204, title: 'Declaring int', sub: 'Integer variables', reward: 15, q: 'Which keyword declares an integer variable in C?', code: '<span class="cb">___</span> score = 100;', opts: ['number', 'var', 'int', 'integer'], correct: 2 },
      { id: 207, type: 'project', title: 'Module 1 Capstone', sub: 'Hello C World', reward: 100, q: 'Write a complete C program that prints exactly "Hello C" (no newline required). Include the stdio.h header and a proper main function.', code: '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}', expectedOutput: 'Hello C', solution: '#include <stdio.h>\n\nint main() {\n    printf("Hello C");\n    return 0;\n}' }
    ]
  }
];

const UNITS_CPP: any[] = [
  {
    id: 1, name: 'C++ Essentials',
    levels: [
      { id: 301, type: 'lesson', title: 'Welcome to C++', sub: 'C with superpowers', reward: 50, q: 'C++ extends C with object-oriented features. Instead of printf, C++ uses cout from the <iostream> library to output text.', codeSnippet: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}' },
      { id: 302, title: 'cout', sub: 'C++ output', reward: 10, q: 'Which object outputs text in C++?', code: '#include &lt;iostream&gt;\nusing namespace std;\nint main() {\n  <span class="cb">___</span> &lt;&lt; <span class="cs">"Hello"</span> &lt;&lt; endl;\n  return 0;\n}', opts: ['print', 'printf', 'cout', 'System.out'], correct: 2 },
      { id: 303, type: 'lesson', title: 'Variables & Auto', sub: 'Modern type inference', reward: 50, q: 'C++ supports all C types, but also adds `auto` for type inference, letting the compiler deduce the type from the assigned value.', codeSnippet: 'int age = 25;\nauto name = std::string("Alice");\nauto pi = 3.14159;' },
      { id: 307, type: 'project', title: 'Module 1 Capstone', sub: 'Hello C++', reward: 100, q: 'Write a complete C++ program that outputs exactly "Hello C++" using cout. Include iostream and use namespace std.', code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}', expectedOutput: 'Hello C++', solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello C++";\n    return 0;\n}' }
    ]
  }
];

const BOTS = [{ name: 'Aiko', xp: 38000, av: 'bot1' }, { name: 'Renz', xp: 25000, av: 'bot2' }, { name: 'Nova', xp: 14000, av: 'bot3' }, { name: 'Zuko', xp: 8000, av: 'bot4' }];

const OB = [
  { g: '<div style="font-family: var(--sans); font-weight: 800; font-size: 3.5rem; letter-spacing: -0.05em; color: var(--ink);">Skill<span style="color: var(--gem);">Streak</span></div>', h: 'Welcome', p: 'The most refined way to master programming. One micro-lesson at a time.' },
  { g: '⌥', h: 'Guard Your <em>Hearts</em>', p: 'Every wrong answer breaks your streak and costs 1 Heart. Stay sharp.' },
];

const LANG_META: Record<string, { label: string; icon: string; color: string }> = {
  py:  { label: 'Python',      icon: '🐍', color: '#3b82f6' },
  js:  { label: 'JavaScript',  icon: '⚡', color: '#f59e0b' },
  c:   { label: 'C',           icon: '⚙️', color: '#6366f1' },
  cpp: { label: 'C++',         icon: '🔷', color: '#0ea5e9' },
};

export default function App() {
  const [S, setS] = useState<any>({
    streak: 0, gems: 100, xp: 0, best: 0, sel: null, hearts: 5, lastHeartLoss: null, projTries: 3,
    qi_py: 0, qi_js: 0, qi_c: 0, qi_cpp: 0, lang: null, level: null
  });
  
  const [onboarded, setOnboarded] = useState(false);
  const [obStep, setObStep] = useState(0);
  const [view, setView] = useState('learn');
  const [challenge, setChallenge] = useState<any>(null);
  const [codeVal, setCodeVal] = useState<string>(''); 
  const [feedback, setFeedback] = useState<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [judge0ApiKey, setJudge0ApiKey] = useState<string>('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [judge0Running, setJudge0Running] = useState(false);

  const [playCodeVal, setPlayCodeVal] = useState<string>('');
  const [playOut, setPlayOut] = useState<string>('');
  const [isShaking, setIsShaking] = useState(false);
  const [floaters, setFloaters] = useState<any[]>([]);
  const [toast, setToast] = useState<{title: string, desc: string, icon: string} | null>(null);

  // Stats Info Popup
  const [infoPopup, setInfoPopup] = useState<{ id: string, title: string, desc: string, x: number, y: number } | null>(null);

  const getUnitsForLang = (lang: string) => {
    if (lang === 'py') return UNITS_PY;
    if (lang === 'js') return UNITS_JS;
    if (lang === 'c') return UNITS_C;
    if (lang === 'cpp') return UNITS_CPP;
    return [];
  };

  const ACTIVE_UNITS = getUnitsForLang(S.lang || '');
  const ALL = ACTIVE_UNITS.flatMap(u => u.levels.map((l: any) => ({ ...l, unit: u })));
  const TOTAL = ALL.length;
  const currentQi = S[`qi_${S.lang}`] ?? 0;
  const done = TOTAL > 0 && currentQi >= TOTAL;

  const isCompiledLang = (lang: string) => lang === 'c' || lang === 'cpp';

  // Global click listener to close popups
  useEffect(() => {
    const closeInfo = () => setInfoPopup(null);
    window.addEventListener('click', closeInfo);
    return () => window.removeEventListener('click', closeInfo);
  }, []);

  // Auto-scroll to current active level
  useEffect(() => {
    if (view === 'learn' && onboarded && S.lang) {
      const timer = setTimeout(() => {
        const activeEl = document.querySelector('.level-item.active');
        if (activeEl) {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [view, onboarded, S.lang, currentQi]);

  useEffect(() => {
    boot();
    if (localStorage.getItem('ks_ob') === '1') {
      setOnboarded(true);
    }

    if (typeof window !== 'undefined') {
      const initPy = async () => {
        try {
          (window as any).pyodideInstance = await (window as any).loadPyodide({
            stdout: (text: string) => {
              window.dispatchEvent(new CustomEvent('pyout', { detail: text + '\n' }));
            }
          });
          setPyReady(true);
        } catch (e) {
          console.error("Pyodide Load Failed", e);
        }
      };

      if (!(window as any).loadPyodide) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
        script.onload = initPy;
        document.head.appendChild(script);
      } else if (!(window as any).pyodideInstance) {
        initPy();
      } else {
        setPyReady(true);
      }

      const savedKey = localStorage.getItem('ks_j0_key');
      if (savedKey) setJudge0ApiKey(savedKey);
    }
  }, []);

  useEffect(() => {
    const handler = (e: any) => { setPlayOut(prev => prev + e.detail); };
    window.addEventListener('pyout', handler);
    return () => window.removeEventListener('pyout', handler);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      if (S.hearts < 5 && S.lastHeartLoss) {
        const diffHrs = (Date.now() - S.lastHeartLoss) / 3600000;
        if (diffHrs >= 1) {
          const gained = Math.floor(diffHrs);
          const newH = Math.min(5, S.hearts + gained);
          const newS = { ...S, hearts: newH, lastHeartLoss: newH === 5 ? null : S.lastHeartLoss + (gained * 3600000) };
          setS(newS); save(newS);
        }
      }
    }, 10000);
    return () => clearInterval(iv);
  }, [S]);

  useEffect(() => {
    const defaults: Record<string, string> = {
      js: 'console.log("Welcome to JavaScript Sandbox!");',
      py: 'print("Welcome to Python Sandbox!")',
      c: '#include <stdio.h>\n\nint main() {\n    printf("Welcome to C Sandbox!\\n");\n    return 0;\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Welcome to C++ Sandbox!" << endl;\n    return 0;\n}'
    };
    if (S.lang && defaults[S.lang]) setPlayCodeVal(defaults[S.lang]);
  }, [S.lang]);

  const boot = () => {
    const savedState = {
      streak: +localStorage.getItem('ks_s')! || 0,
      gems: +localStorage.getItem('ks_g')! || 100,
      xp: +localStorage.getItem('ks_x')! || 0,
      qi_py: +localStorage.getItem('ks_q_py')! || 0,
      qi_js: +localStorage.getItem('ks_q_js')! || 0,
      qi_c: +localStorage.getItem('ks_q_c')! || 0,
      qi_cpp: +localStorage.getItem('ks_q_cpp')! || 0,
      best: +localStorage.getItem('ks_b')! || 0,
      hearts: localStorage.getItem('ks_h') ? +localStorage.getItem('ks_h')! : 5,
      lastHeartLoss: localStorage.getItem('ks_lhl') ? +localStorage.getItem('ks_lhl')! : null,
      lang: localStorage.getItem('ks_lang') || null,
      level: localStorage.getItem('ks_level') || null,
      projTries: 3,
      sel: null
    };
    setS(savedState);
  };

  const save = (newState: any) => {
    localStorage.setItem('ks_s', newState.streak);
    localStorage.setItem('ks_g', newState.gems);
    localStorage.setItem('ks_x', newState.xp);
    localStorage.setItem('ks_q_py', newState.qi_py);
    localStorage.setItem('ks_q_js', newState.qi_js);
    localStorage.setItem('ks_q_c', newState.qi_c ?? 0);
    localStorage.setItem('ks_q_cpp', newState.qi_cpp ?? 0);
    localStorage.setItem('ks_b', newState.best);
    localStorage.setItem('ks_h', newState.hearts);
    if (newState.lang) localStorage.setItem('ks_lang', newState.lang);
    if (newState.level) localStorage.setItem('ks_level', newState.level);
    if (newState.lastHeartLoss) localStorage.setItem('ks_lhl', newState.lastHeartLoss);
    else localStorage.removeItem('ks_lhl');
  };

  const handleObNext = () => { setObStep(obStep + 1); };

  const pickLang = (l: string) => {
    const nextS = { ...S, lang: l };
    setS(nextS); save(nextS);
  };

  const pickLevel = (lvl: string) => {
    let startQi = 0;
    const units = getUnitsForLang(S.lang);
    
    // Calculate starting index based on level
    if (lvl === 'intermediate' && units.length > 1) {
      startQi = units[0].levels.length; // Skip module 1
    } else if (lvl === 'advanced') {
      if (units.length > 2) {
        startQi = units[0].levels.length + units[1].levels.length; // Skip modules 1 & 2
      } else if (units.length > 1) {
        startQi = units[0].levels.length; // Fallback: Skip module 1 if only 2 exist
      }
    }

    const qiKey = `qi_${S.lang}`;
    const nextS = { ...S, level: lvl, [qiKey]: Math.max(startQi, S[qiKey] || 0) };
    
    setS(nextS); save(nextS);
    localStorage.setItem('ks_ob', '1');
    setOnboarded(true);
  };

  const openChallenge = (lv: any) => {
    if (lv.type !== 'lesson' && S.hearts === 0) {
      setFeedback({
        type: 'err', em: 'Out of Hearts.',
        body: `You have 0 Hearts remaining. Wait for regeneration or refill instantly.`,
        act: 'Refill Hearts (50 Gems)',
        isRefill: true
      });
      return;
    }
    setChallenge(lv);
    setS((prev: any) => ({ ...prev, sel: null, projTries: 3 }));
    if (lv.type === 'interactive' || lv.type === 'project') setCodeVal(lv.code || '');
  };

  const spawnFloater = (e: React.MouseEvent, text: string) => {
    if (!e) return;
    const id = Date.now() + Math.random();
    const dx = (Math.random() - 0.5) * 40;
    setFloaters(prev => [...prev, { id, text, x: e.clientX + dx - 20, y: e.clientY - 40 }]);
    setTimeout(() => { setFloaters(prev => prev.filter(f => f.id !== id)); }, 1000);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  const getUpdatedQiState = (isLatest: boolean, inc = 1) => {
    if (!isLatest) return {}; // Don't advance progress if replaying old levels
    const key = `qi_${S.lang}`;
    return { [key]: (S[key] ?? 0) + inc };
  };

  const toggleStatInfo = (e: React.MouseEvent, id: string, title: string, desc: string) => {
    e.stopPropagation(); // prevent window click from immediately closing
    if (infoPopup?.id === id) {
      setInfoPopup(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setInfoPopup({
      id, title, desc,
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8
    });
  };

  const onCheck = async (e?: React.MouseEvent) => {
    const lv = challenge;
    if (!lv) return;
    const gi = ALL.findIndex((l: any) => l.id === lv.id);
    const isLatest = gi === currentQi;

    if (lv.type === 'lesson') {
      SoundEngine.play('ding');
      const rwd = isLatest ? (lv.reward || 50) : 10;
      if (e) spawnFloater(e, `+${rwd} XP`);
      const newState = { ...S, xp: S.xp + rwd, ...getUpdatedQiState(isLatest) };
      setS(newState); save(newState);
      setFeedback({ type: 'ok', em: isLatest ? 'Lesson Complete.' : 'Review Complete.', body: `+${rwd} XP earned.`, act: (isLatest && currentQi + 1 >= TOTAL) ? 'Finish Course →' : 'Continue →' });
      setChallenge(null);
      return;
    }

    if (lv.type === 'project' || lv.type === 'interactive') {
      if (!codeVal.trim()) return;
      let isCorrect = false;
      let errMsg = '';

      if (isCompiledLang(S.lang)) {
        const key = judge0ApiKey || localStorage.getItem('ks_j0_key') || '';
        if (!key) {
           setFeedback({ type: 'err', em: 'Missing Key', body: 'RapidAPI Judge0 CE Key required for C/C++.', act: 'Okay' });
           setChallenge(null); setShowApiKeyModal(true); return;
        }
        setJudge0Running(true);
        const { output, error } = await runWithJudge0(codeVal, S.lang as 'c'|'cpp', key);
        setJudge0Running(false);
        if (error && !output) {
          errMsg = error; isCorrect = false;
        } else {
          const expected = (lv.expectedOutput || '').trim();
          const actual = output.trim();
          isCorrect = actual === expected;
          if (!isCorrect) errMsg = `Expected "${expected}" but got "${actual || '(no output)'}"`;
        }
      } else if (S.lang === 'py') {
        try {
          (window as any).pyodideInstance.runPython(codeVal + '\n' + lv.validation);
          isCorrect = true;
        } catch (err: any) {
          isCorrect = false; errMsg = err.message.split('\n').pop() || 'Execution failed';
        }
      } else {
        try {
          const fn = new Function(`${codeVal}\n${lv.validation}`);
          fn(); isCorrect = true;
        } catch (err: any) {
          isCorrect = false; errMsg = err.message || 'Execution failed';
        }
      }

      if (isCorrect) {
        if (lv.type === 'project') {
          SoundEngine.play('mc_achieve');
          setToast({ title: 'Achievement Get!', desc: lv.title + ' Passed', icon: '🏆' });
          setTimeout(() => setToast(null), 4000);
        } else {
          SoundEngine.play((isLatest && currentQi >= TOTAL - 1) ? 'fanfare' : 'ding');
        }
        const rwd = isLatest ? (lv.reward || 50) : 5;
        if (e) spawnFloater(e, `+${rwd} Gems`);
        const newState = { ...S, gems: S.gems + rwd, xp: S.xp + rwd * 10, streak: S.streak + 1, best: Math.max(S.best, S.streak + 1), ...getUpdatedQiState(isLatest) };
        setS(newState); save(newState);
        setFeedback({ type: 'ok', em: 'Passed!', body: `Amazing! +${rwd} gems earned.`, act: (isLatest && currentQi + 1 >= TOTAL) ? 'Finish Course →' : 'Continue →' });
      } else {
        SoundEngine.play('error'); triggerShake();
        const newTries = Math.max(0, S.projTries - 1);
        const newState = { ...S, projTries: newTries };
        setS(newState); save(newState);

        if (newTries > 0) {
          setFeedback({ type: 'err', em: 'Test Failed.', body: `${errMsg}. You have ${newTries} tries left.`, act: 'Try Again' });
        } else {
          setFeedback({ type: 'err', em: 'Project Failed.', body: `${errMsg}. Out of tries. Study the solution to continue.`, act: 'Show Solution', isShowSolution: true, failedLv: lv });
        }
      }
      setChallenge(null); return;
    }

    // Multiple choice
    if (S.sel === null) return;
    const isCorrect = (S.sel === lv.correct);

    if (isCorrect) {
      SoundEngine.play((isLatest && currentQi >= TOTAL - 1) ? 'fanfare' : 'ding');
      const rwd = isLatest ? (lv.reward || 50) : 5;
      if (e) spawnFloater(e, `+${rwd} Gems`);
      const newState = { ...S, gems: S.gems + rwd, xp: S.xp + rwd * 10, streak: S.streak + 1, best: Math.max(S.best, S.streak + 1), ...getUpdatedQiState(isLatest) };
      setS(newState); save(newState);
      setFeedback({ type: 'ok', em: 'Correct.', body: `+${rwd} gems earned. Streak: ${newState.streak}`, act: (isLatest && currentQi + 1 >= TOTAL) ? 'View Results →' : 'Next Level →' });
    } else {
      SoundEngine.play('error'); triggerShake();
      const newH = Math.max(0, S.hearts - 1);
      const newState = { ...S, hearts: newH, streak: 0, lastHeartLoss: newH < 5 && S.hearts === 5 ? Date.now() : S.lastHeartLoss };
      setS(newState); save(newState);
      setFeedback({ type: 'err', em: 'Wrong.', body: `Streak lost. −1 Heart. ${newH === 0 ? '(Out of hearts!)' : 'Try again.'}`, act: newH === 0 ? 'Refill Hearts (50 Gems)' : 'Try Again', isRefill: newH === 0 });
    }
    setChallenge(null); setCodeVal('');
  };

  const handleFeedbackAck = () => {
    if (feedback.isRefill) {
      if (S.gems >= 50) {
        const ns = { ...S, gems: S.gems - 50, hearts: 5, lastHeartLoss: null };
        setS(ns); save(ns); setFeedback(null); SoundEngine.play('ding');
      } else { alert("Not enough gems to refill hearts!"); setFeedback(null); }
      return;
    }
    if (feedback.isShowSolution) {
      const lv = feedback.failedLv;
      setCodeVal(lv.solution);
      setS((prev: any) => ({ ...prev, projTries: 3 }));
      setFeedback(null); setChallenge(lv); return;
    }
    setFeedback(null);
  };

  const runPlayground = async () => {
    setPlayOut('');
    if (isCompiledLang(S.lang)) {
      const key = judge0ApiKey || localStorage.getItem('ks_j0_key') || '';
      if (!key) { setPlayOut('⚠️ No Judge0 API key. Set it via the ⚙️ button above.'); return; }
      setJudge0Running(true); setPlayOut('Compiling & Running...');
      const { output, error } = await runWithJudge0(playCodeVal, S.lang as 'c'|'cpp', key);
      setJudge0Running(false); setPlayOut(output || error || '(no output)');
    } else if (S.lang === 'py') {
      if (!pyReady) return;
      try { (window as any).pyodideInstance.runPython(playCodeVal); }
      catch (err: any) { setPlayOut(prev => prev + '\n' + err.message); }
    } else {
      const oldLog = console.log; let logs = "";
      console.log = (...args) => { logs += args.join(' ') + '\n'; };
      try { const fn = new Function(playCodeVal); fn(); setPlayOut(logs || 'Finished (no output).'); }
      catch (err: any) { setPlayOut(logs + '\nError: ' + err.message); }
      finally { console.log = oldLog; }
    }
  };

  if (!onboarded || !S.lang || !S.level) {
    if (obStep < OB.length) {
      const o = OB[obStep];
      return (
        <div className="ob">
          <style dangerouslySetInnerHTML={{ __html: STYLES }} />
          <div className="ob-body">
            <div className="ob-glyph" dangerouslySetInnerHTML={{ __html: o.g }}></div>
            <div className="ob-h" dangerouslySetInnerHTML={{ __html: o.h }}></div>
            <div className="ob-p">{o.p}</div>
          </div>
          <div className="ob-foot">
            <div className="ob-dots">
              {OB.map((_, i) => <div key={i} className={`ob-dot ${i === obStep ? 'on' : ''}`}></div>)}
            </div>
            <button className="ob-btn" onClick={handleObNext}>{obStep === OB.length - 1 ? 'Start Learning →' : 'Continue'}</button>
          </div>
        </div>
      );
    } else if (!S.lang) {
      return (
        <div className="ob">
          <style dangerouslySetInnerHTML={{ __html: STYLES }} />
          <div className="ob-body" style={{ justifyContent: 'center' }}>
            <div className="ob-h">Choose Your Path</div>
            <div className="ob-p">Which language do you want to master first?</div>
            <div className="lang-sel">
              {Object.entries(LANG_META).map(([key, meta]) => (
                <div className="lang-card" key={key} onClick={() => pickLang(key)}>
                  <div className="lang-ic">{meta.icon}</div>
                  <span>{meta.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="ob">
          <style dangerouslySetInnerHTML={{ __html: STYLES }} />
          <div className="ob-body" style={{ justifyContent: 'center' }}>
            <div className="ob-h">What's your experience level?</div>
            <div className="ob-p">We'll tailor your journey accordingly.</div>
            <div className="lang-sel">
              <div className="lang-card" onClick={() => pickLevel('beginner')}>
                <div className="lang-ic">🌱</div>
                <span>Beginner</span>
                <div style={{fontSize: '0.85rem', color: 'var(--mid)', marginTop: '-8px'}}>New to coding</div>
              </div>
              <div className="lang-card" onClick={() => pickLevel('intermediate')}>
                <div className="lang-ic">🚀</div>
                <span>Intermediate</span>
                <div style={{fontSize: '0.85rem', color: 'var(--mid)', marginTop: '-8px'}}>Know the basics</div>
              </div>
              <div className="lang-card" onClick={() => pickLevel('advanced')}>
                <div className="lang-ic">🔥</div>
                <span>Advanced</span>
                <div style={{fontSize: '0.85rem', color: 'var(--mid)', marginTop: '-8px'}}>I'm a pro</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  const pct = TOTAL === 0 ? 0 : Math.round((currentQi / TOTAL) * 100);
  const cycleLang = () => {
    const langs = Object.keys(LANG_META);
    const idx = langs.indexOf(S.lang);
    const next = langs[(idx + 1) % langs.length];
    pickLang(next);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      {/* Dynamic Popups for Stats */}
      {infoPopup && (
        <div className="info-popup on" style={{ left: infoPopup.x, top: infoPopup.y }} onClick={(e) => e.stopPropagation()}>
          <div className="info-title">{infoPopup.title}</div>
          <div className="info-desc">{infoPopup.desc}</div>
        </div>
      )}

      {/* Settings Modal */}
      {showApiKeyModal && (
        <div className="fb-ov on" style={{ zIndex: 300 }}>
          <div className="fb-sheet" style={{ borderTopColor: 'var(--gem)' }}>
            <div className="fb-em" style={{ color: 'var(--ink)', fontSize: '1.4rem' }}>⚙️ C/C++ Setup</div>
            <div className="fb-body">
              C and C++ require a free RapidAPI key for Judge0 CE to run code.{' '}
              <a href="https://rapidapi.com/judge0-official/api/judge0-ce" target="_blank" rel="noreferrer" style={{ color: 'var(--gem)' }}>Get yours →</a>
            </div>
            <input type="text" placeholder="Paste your RapidAPI key" value={judge0ApiKey} onChange={e => setJudge0ApiKey(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--ghost-border)', fontFamily: 'var(--mono)', fontSize: '0.82rem', marginBottom: '12px', outline: 'none' }} />
            <button className="fb-act" style={{ background: 'var(--gem)' }} onClick={() => { localStorage.setItem('ks_j0_key', judge0ApiKey); setShowApiKeyModal(false); }}>Save Key</button>
            <button onClick={() => setShowApiKeyModal(false)} style={{ width: '100%', background: 'none', border: 'none', marginTop: '10px', color: 'var(--mid)', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-achieve">
          <div className="toast-ic">{toast.icon}</div>
          <div className="toast-content"><div className="toast-title">{toast.title}</div><div className="toast-desc">{toast.desc}</div></div>
        </div>
      )}
      
      {floaters.map(f => ( <div key={f.id} className="floater" style={{ left: f.x, top: f.y }}>{f.text}</div> ))}

      <div className={`shell on ${isShaking ? 'shake' : ''}`}>
        <header className="topbar">
          <div className="wordmark">
            Skill<span>Streak</span>
          </div>
          <div className="chips">
            <div className="chip" style={{ borderColor: LANG_META[S.lang]?.color || 'var(--gem)' }} onClick={cycleLang}>
              <div className="cdot g" style={{ background: LANG_META[S.lang]?.color || 'var(--gem)' }}></div>
              <span>{LANG_META[S.lang]?.icon} {LANG_META[S.lang]?.label}</span>
            </div>
            {isCompiledLang(S.lang) && (
              <div className="chip" onClick={() => setShowApiKeyModal(true)}><span>⚙️</span></div>
            )}
            <div className="chip" onClick={(e) => toggleStatInfo(e, 'hearts', 'Hearts', 'You lose 1 Heart for incorrect answers. Refills over time.')}>
              <div className="cdot" style={{ background: '#e11d48' }}></div><span>{S.hearts}/5</span>
            </div>
            <div className="chip" onClick={(e) => toggleStatInfo(e, 'streak', 'Streak', "Consecutive correct answers. Don't break your streak!")}>
              <div className="cdot f"></div><span>{S.streak}</span>
            </div>
            <div className="chip" onClick={(e) => toggleStatInfo(e, 'gems', 'Gems', 'Earned by passing modules. Use them to refill Hearts.')}>
              <div className="cdot g"></div><span>{S.gems}</span>
            </div>
          </div>
        </header>

        <div className="main">
          {done ? (
             <div className="done-screen on">
               <div className="done-glyph">✦</div>
               <div className="done-h">{LANG_META[S.lang]?.label} Mastery.</div>
               <div className="done-sub">You've finished all active modules. More content arriving soon.</div>
               <div className="done-stats">
                 <div className="done-stat"><div className="done-val">{S.gems}</div><div className="done-lbl">Gems</div></div>
                 <div className="done-stat"><div className="done-val">{S.best}</div><div className="done-lbl">Best</div></div>
                 <div className="done-stat"><div className="done-val">{S.xp}</div><div className="done-lbl">XP</div></div>
               </div>
               <button className="done-restart" onClick={() => {
                 const newState = { ...S, [`qi_${S.lang}`]: 0 }; setS(newState); save(newState);
               }}>Play Again</button>
             </div>
          ) : view === 'learn' && (
            <div className="view on">
              <div className="path-view">
                <div className="unit-hd">
                  <div className="unit-label">{LANG_META[S.lang]?.label} · Curriculum</div>
                  <div className="unit-name">{ACTIVE_UNITS[0]?.name || 'Course'}</div>
                  <div className="prog-row">
                    <div className="prog-track"><div className="prog-bar" style={{ width: `${pct}%` }}></div></div>
                    <div className="prog-num">{currentQi}/{TOTAL}</div>
                  </div>
                </div>
                <div className="levels">
                  {ACTIVE_UNITS.map((unit) => (
                    <div key={unit.id}>
                      <div className="unit-sep">
                        <span className="sep-label">Module {unit.id}</span>
                        <span className="sep-name">{unit.name}</span>
                        <div className="sep-line"></div>
                      </div>
                      {unit.levels.map((lv: any, i: number) => {
                        const gi = ALL.findIndex((l: any) => l.id === lv.id);
                        const state = gi < currentQi ? 'done' : gi === currentQi ? 'active' : 'locked';
                        let tag = state === 'done' ? 'complete' : state === 'active' ? 'current' : 'locked';
                        if (lv.type === 'lesson' && state !== 'done') tag = 'lesson';
                        if (lv.type === 'project' && state !== 'done') tag = 'project';

                        return (
                          <div className={`level-item ${state}`} key={lv.id}>
                            <div className="spine">
                              <div className="s-dot" style={lv.type === 'project' ? { borderRadius: '4px' } : {}}></div>
                              <div className="s-line"></div>
                            </div>
                            <div className={`lv-card ${state === 'active' || state === 'done' ? 'tap' : ''}`} onClick={() => (state === 'active' || state === 'done') && openChallenge(lv)}>
                              <div className="lv-top">
                                <div className="lv-num">Step {i + 1}</div>
                                <div className="lv-tag" style={lv.type === 'project' && state === 'active' ? { background: '#f43f5e', color: 'white' } : lv.type === 'lesson' && state === 'active' ? { background: 'var(--ink2)', color: 'white' } : {}}>{tag}</div>
                              </div>
                              <div className="lv-title">{lv.title}</div>
                              <div className="lv-sub">{lv.sub}</div>
                              {state !== 'locked' && (
                                <div className="lv-footer">
                                  {lv.type !== 'lesson' && <div className="lv-gems"><div className="lv-gd"></div>{lv.reward} gems</div>}
                                  {lv.type === 'lesson' && <div className="lv-gems">+50 XP</div>}
                                  {state === 'active' && <div className="lv-arrow">→</div>}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'rank' && !done && (
            <div className="view on"><Leaderboard xp={S.xp} /></div>
          )}

          {view === 'play' && !done && (
            <div className="view play-view on">
              <div className="play-title">Playground {LANG_META[S.lang]?.icon}</div>
              <div className="play-container">
                <textarea className="play-code" value={playCodeVal} onChange={(e) => setPlayCodeVal(e.target.value)} spellCheck={false} placeholder={`// Write any ${LANG_META[S.lang]?.label} code here`} />
                <div className="play-actions">
                  <div className="play-run" onClick={runPlayground}>{judge0Running ? 'Compiling...' : S.lang === 'py' && !pyReady ? 'Loading Python...' : 'Run Code ▶'}</div>
                  <div className="play-out">{playOut || `Ready for ${LANG_META[S.lang]?.label} output...`}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <nav className="botnav">
          <button className={`nav-btn ${view === 'learn' ? 'on' : ''}`} onClick={() => setView('learn')}><div className="nav-ic">⊞</div><span>Learn</span></button>
          <button className={`nav-btn ${view === 'play' ? 'on' : ''}`} onClick={() => setView('play')}><div className="nav-ic">💻</div><span>Sandbox</span></button>
          <button className={`nav-btn ${view === 'rank' ? 'on' : ''}`} onClick={() => setView('rank')}><div className="nav-ic">◈</div><span>Rank</span></button>
        </nav>

        {challenge && (
          <div className="overlay on">
            <div className="sheet">
              <div className="sh-handle"><div className="sh-bar"></div></div>
              <div className="sh-hd">
                <div className="sh-fname">step_{challenge.id}.{S.lang === 'cpp' ? 'cpp' : S.lang}</div>
                {challenge.type !== 'lesson' && <div className="sh-reward">+{challenge.reward} gems</div>}
                <button className="sh-close" onClick={() => setChallenge(null)}>✕</button>
              </div>
              <div className="sh-body">
                {challenge.type === 'lesson' ? (
                  <>
                    <div><div className="brief-lbl">Lesson</div><div className="brief-q">{challenge.q}</div></div>
                    <div className="code-wrap">
                      <div className="code-bar"><div className="d r"></div><div className="d y"></div><div className="d g"></div><div className="code-tag">example</div></div>
                      <div className="code-inner">{challenge.codeSnippet}</div>
                    </div>
                  </>
                ) : challenge.type === 'project' ? (
                  <>
                    <div>
                      <div className="brief-lbl">Capstone Project • {S.projTries} Tries Left</div>
                      <div className="brief-q">{challenge.q}</div>
                    </div>
                    <div className="code-wrap" style={{ background: 'transparent', padding: 0, border: 'none' }}>
                      <textarea className="interactive-terminal" value={codeVal} onChange={(e) => setCodeVal(e.target.value)} spellCheck={false} placeholder="Write your code here" />
                    </div>
                    {S.lang === 'py' && !pyReady && <div style={{ fontSize: '0.8rem', color: 'var(--mid)', textAlign: 'center' }}>Loading Python Runtime...</div>}
                  </>
                ) : (
                  <>
                    <div><div className="brief-lbl">Mission</div><div className="brief-q">{challenge.q}</div></div>
                    <div className="code-wrap">
                      <div className="code-bar"><div className="d r"></div><div className="d y"></div><div className="d g"></div><div className="code-tag">{S.lang}</div></div>
                      <div className="code-inner" dangerouslySetInnerHTML={{ __html: challenge.code }}></div>
                    </div>
                    <div>
                      <div className="opts-lbl">Pick the correct answer</div>
                      <div className="opts-grid">
                        {challenge.opts.map((o: string, i: number) => (
                          <button key={i} className={`opt ${S.sel === i ? 'on' : ''}`} onClick={() => setS((prev: any) => ({ ...prev, sel: i }))}>{o}</button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="sh-ft">
                {challenge.type === 'lesson' ? (
                  <button className="check-btn" onClick={(e) => onCheck(e)}>Complete Lesson</button>
                ) : (
                  <button className="check-btn" disabled={(challenge.type === 'project') ? (!codeVal.trim() || (S.lang === 'py' && !pyReady) || judge0Running) : S.sel === null} onClick={(e) => onCheck(e)}>
                    {judge0Running ? 'Compiling & Running...' : S.lang === 'py' && !pyReady ? 'Downloading Python...' : challenge.type === 'project' ? 'Submit Project' : 'Check Answer'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {feedback && (
          <div className="fb-ov on">
            <div className={`fb-sheet ${feedback.type}`}>
              <div className="fb-em">{feedback.em}</div>
              <div className="fb-body">{feedback.body}</div>
              <button className="fb-act" onClick={handleFeedbackAck}>{feedback.act}</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const Leaderboard = ({ xp }: { xp: number }) => {
  const me = { name: 'You', xp, av: 'Alpha', me: true };
  const all = [...BOTS, me].sort((a, b) => b.xp - a.xp);
  const rank = all.findIndex(u => u.me) + 1;
  const rc = ['g', 's', 'b'];

  return (
    <div className="lb-view">
      <div className="lb-title">Rankings</div>
      <div className="lb-sub">Weekly · Global</div>
      <div className="lb-you">
        <div className="lb-you-rank">#{rank}</div>
        <img className="lb-av" src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=You" alt="" />
        <div className="lb-you-name">You</div>
        <div className="lb-you-xp">{xp.toLocaleString()} XP</div>
      </div>
      <div className="lb-rows">
        {all.map((u, i) => (
          <div className="lb-row" key={u.name}>
            <div className={`lb-rrank ${rc[i] || ''}`}>{['①', '②', '③'][i] || `#${i + 1}`}</div>
            <img className="lb-av" src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${u.av || u.name}`} alt="" />
            <div className="lb-rname">{u.name}</div>
            <div className="lb-rxp">{u.xp.toLocaleString()} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
};