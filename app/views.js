// Views: turns deal objects into HTML strings. No network, no templates from
// anywhere else — plain string building with escaped text.

import { CHECKED_LABEL, deals } from "./data.js";

export function money(n) {
  return "$" + n.toFixed(2).replace(/\.00$/, "");
}

export function discountPct(d) {
  return Math.round((1 - d.price / d.was) * 100);
}

export function saving(d) {
  return d.was - d.price;
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const VERDICT_LABEL = {
  "new-low": "★ NEW LOW",
  strong: "STRONG DEAL",
  routine: "ROUTINE SALE",
};

export function verdictPill(d) {
  return `<span class="verdict ${d.verdict}">${VERDICT_LABEL[d.verdict]}</span>`;
}

export function dealCard(d) {
  return `<li class="deal-card">
    ${verdictPill(d)}
    <h3><a href="#/deal/${d.id}">${esc(d.title)}</a></h3>
    <p class="meta"><span class="chip">${esc(d.store)}</span><span class="chip">${esc(d.category)}</span></p>
    <p class="price-row"><span class="price">${money(d.price)}</span><span class="was">${money(d.was)}</span><span class="off">−${discountPct(d)}%</span></p>
    <p class="note">${esc(d.note)}</p>
    <p class="checked-line">Checked ${CHECKED_LABEL} · ${esc(d.source)}</p>
    <a class="store-link" href="${esc(d.url)}" target="_blank" rel="noopener">View at ${esc(d.store)} →</a>
  </li>`;
}

export function dealRows(list) {
  if (list.length === 0) {
    return `<p class="empty">No deals match those filters. Try clearing the search or lowering the minimum discount.</p>`;
  }
  return `<ul class="deal-grid">${list.map(dealCard).join("")}</ul>`;
}

export function summaryBar(list) {
  const total = list.length;
  const biggest = list.reduce((m, d) => Math.max(m, discountPct(d)), 0);
  const saved = list.reduce((sum, d) => sum + saving(d), 0);
  const stores = new Set(list.map((d) => d.store)).size;
  return `<div class="summary">
    <div class="stat"><b>${total}</b><span>deals shown</span></div>
    <div class="stat"><b>${stores}</b><span>stores</span></div>
    <div class="stat"><b>−${biggest}%</b><span>biggest discount</span></div>
    <div class="stat"><b>${money(saved)}</b><span>total saving if you bought them all</span></div>
  </div>`;
}

export function listPage(list) {
  return summaryBar(list) + dealRows(list);
}

export function dealPage(d) {
  const others = deals.filter((x) => x.id !== d.id && x.category === d.category).slice(0, 3);
  const compared = d.also
    ? `<dt>Also at</dt><dd>${d.also
        .map((a) => `<a href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.store)} ${money(a.price)}</a>`)
        .join(" · ")} — this page's price is the cheapest of them.</dd>`
    : "";
  return `<article class="detail">
    <a class="back" href="#/">← All deals</a>
    ${verdictPill(d)}
    <h2>${esc(d.title)}</h2>
    <p class="meta"><span class="chip">${esc(d.store)}</span><span class="chip">${esc(d.category)}</span></p>
    <p class="price-row"><span class="price">${money(d.price)}</span><span class="was">${money(d.was)}</span><span class="off">−${discountPct(d)}%</span></p>
    <p class="saving">You save ${money(saving(d))}.</p>
    <p class="note">${esc(d.note)}</p>
    <dl class="breakdown">
      <dt>Is it really a deal?</dt>
      <dd>${verdictText(d)}</dd>
      <dt>Checked</dt>
      <dd>${CHECKED_LABEL} — ${esc(d.source)}.</dd>
      ${compared}
      <dt>Buy it at</dt>
      <dd><a href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.store)} →</a></dd>
    </dl>
    <a class="store-link" href="${esc(d.url)}" target="_blank" rel="noopener">View at ${esc(d.store)} →</a>
    <h3>More in ${esc(d.category)}</h3>
    <ul class="deal-grid">${others.map(dealCard).join("")}</ul>
  </article>`;
}

function verdictText(d) {
  if (d.verdict === "new-low") {
    return "Yes — deal trackers report this as the lowest price ever recorded for the product, and the discount is measured against the store's own list price.";
  }
  if (d.verdict === "strong") {
    return "Yes — a real cut on a current model, below the price it has sold at most of the year.";
  }
  return "Partly — a genuine saving, but a small one. It is the usual Black Friday cut for this product, not a standout price.";
}

export function missingPage() {
  return `<p class="empty">That deal is not on the board. <a href="#/">Back to all deals</a>.</p>`;
}
