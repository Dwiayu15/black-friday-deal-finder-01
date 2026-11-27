// Router and filters for DealHunt. Hash routes:
//
//   #/            the deal board, with search and filters
//   #/deal/<id>   one deal, with its verdict and checked source
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { CATEGORIES, STORES, deals } from "./data.js";
import { dealPage, discountPct, listPage, missingPage, saving } from "./views.js";

const app = document.getElementById("app");
const searchBox = document.getElementById("search");
const categoryBox = document.getElementById("category");
const storeBox = document.getElementById("store");
const minDiscBox = document.getElementById("mindisc");
const sortBox = document.getElementById("sort");

for (const c of CATEGORIES) {
  const o = document.createElement("option");
  o.value = c;
  o.textContent = c;
  categoryBox.appendChild(o);
}
for (const s of STORES) {
  const o = document.createElement("option");
  o.value = s;
  o.textContent = s;
  storeBox.appendChild(o);
}

function state() {
  return {
    q: searchBox.value.trim().toLowerCase(),
    category: categoryBox.value,
    store: storeBox.value,
    minDisc: Number(minDiscBox.value),
    sort: sortBox.value,
  };
}

function applyFilters(list, s) {
  let out = list.filter((d) => {
    if (s.category && d.category !== s.category) return false;
    if (s.store && d.store !== s.store) return false;
    if (discountPct(d) < s.minDisc) return false;
    if (s.q && !(d.title + " " + d.store + " " + d.category).toLowerCase().includes(s.q)) return false;
    return true;
  });
  if (s.sort === "discount") out.sort((a, b) => discountPct(b) - discountPct(a) || saving(b) - saving(a));
  else if (s.sort === "saving") out.sort((a, b) => saving(b) - saving(a));
  else if (s.sort === "price") out.sort((a, b) => a.price - b.price);
  else if (s.sort === "name") out.sort((a, b) => a.title.localeCompare(b.title));
  return out;
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Not found"} | DealHunt`;
    app.innerHTML = found ? dealPage(found) : missingPage();
  } else {
    document.title = "DealHunt — Black Friday 2026 deal finder";
    app.innerHTML = listPage(applyFilters(deals, state()));
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

for (const el of [searchBox, categoryBox, storeBox, minDiscBox, sortBox]) {
  el.addEventListener("input", render);
  el.addEventListener("change", render);
}
window.addEventListener("hashchange", render);
render();
