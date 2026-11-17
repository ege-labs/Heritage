// Heritage wiki — veri üretici.
// strategy/ klasörünü YALNIZCA OKUR; çıktıyı Strategy-web/ içine yazar.
//   node tools/build-data.mjs [oyun_klasörü]
// Çıktılar: data/wiki-data.js (tarayıcı / file:// için), data/wiki-data.json (Godot'ta doğrudan okumak için),
//           assets/flags, assets/screens, assets/fonts, assets/icon.svg
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(here, "..");
const GAME = path.resolve(process.argv[2] || path.join(WEB, "..", "strategy"));
const rd = (p) => JSON.parse(fs.readFileSync(path.join(GAME, p), "utf8"));
const exists = (p) => fs.existsSync(path.join(GAME, p));

const LANGS = [
  ["tr", "Türkçe"], ["en", "English"], ["zh_CN", null], ["ru", null], ["es", null],
  ["pt", null], ["de", null], ["fr", null], ["ja", null],
];

// --- Tanımlar -----------------------------------------------------------------------------------
const mil = rd("data/defs/military.json");
const ind = rd("data/defs/industry.json");
const trd = rd("data/defs/trade.json");
const dip = rd("data/defs/diplomacy.json");
const pol = rd("data/defs/policies.json");
const res = rd("data/defs/research.json");
const nav = rd("data/defs/naval.json");
const air = rd("data/defs/air.json");
const par = rd("data/defs/parties.json");
const peace = rd("data/defs/peace.json");
const evdef = rd("data/defs/events.json");
const map = rd("data/map/map.json");

const strip = (o, ...keys) => { const c = { ...o }; for (const k of keys) delete c[k]; return c; };
const ordered = (obj, order) => order.map((id) => ({ id, ...obj[id] }));

// Olaylar
const events = [];
for (const f of fs.readdirSync(path.join(GAME, "data/events"))) {
  if (!f.endsWith(".json") || f.startsWith("_")) continue;
  const d = rd("data/events/" + f);
  for (const e of Array.isArray(d) ? d : d.events || []) {
    const en = (e.i18n && e.i18n.en) || {};
    events.push({
      id: e.id,
      scope: e.countries ? e.countries.join(", ") : (f.startsWith("world") ? "world" : "any"),
      title: e.title, text: e.text,
      en_title: en.title || "", en_text: en.text || "",
      options: (e.options || []).map((o) => ({ label: o.label, en: (o.i18n && o.i18n.en) || "" })),
    });
  }
}
events.sort((a, b) => a.title.localeCompare(b.title, "tr"));

// Ülkeler
const eco = rd("data/db/economy.json").countries;
const popdb = rd("data/db/population.json").countries;
const mildb = rd("data/db/military.json").countries;
const names = {}; // en -> [tr,en,zh,ru,es,pt,de,fr,ja]
for (const f of ["countries1.txt", "countries2.txt"]) {
  for (const line of fs.readFileSync(path.join(GAME, "data/lang/src", f), "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const c = line.split("¦").map((s) => s.trim());
    if (c.length >= 9) names[c[1]] = c;
  }
}
const byTag = {}, nameArea = {};
for (const s of map.states) {
  const c = (byTag[s.tag] ||= { tag: s.tag, en: s.country_name, states: 0, area: 0 });
  c.states++; c.area += s.area_km2 || 0;
  const na = (nameArea[s.tag] ||= {});
  na[s.country_name] = (na[s.country_name] || 0) + (s.area_km2 || 0);
}
// Bir etiketin altında birden çok ad olabilir (ör. üs bölgeleri): alanı en büyük olanı al.
for (const [tag, na] of Object.entries(nameArea)) byTag[tag].en = Object.entries(na).sort((a, b) => b[1] - a[1])[0][0];
// map.json'daki İngilizce adlar ile oyunun ülke adı tablosundaki adlar farklı olabilir.
const ALIAS = { "United States of America": "United States", "Turkey": "Türkiye", "Hong Kong S.A.R.": "Hong Kong", "Czech Republic": "Czechia",
  "Republic of Serbia": "Serbia", "Ivory Coast": "Côte d'Ivoire", "United Republic of Tanzania": "Tanzania", "Macau S.A.R": "Macau",
  "Macedonia": "North Macedonia", "West Bank": "Palestine", "The Bahamas": "Bahamas", "S. Sudan": "South Sudan", "Swaziland": "Eswatini",
  "United States Virgin Islands": "U.S. Virgin Islands", "Guinea Bissau": "Guinea-Bissau", "East Timor": "Timor-Leste", "Aland": "Åland",
  "Sao Tome and Principe": "São Tomé and Príncipe", "Federated States of Micronesia": "Micronesia", "Saint Barthelemy": "Saint Barthélemy",
  "South Georgia and the Islands": "South Georgia and the South Sandwich Islands" };
for (const c of Object.values(byTag)) if (!names[c.en] && ALIAS[c.en] && names[ALIAS[c.en]]) names[c.en] = names[ALIAS[c.en]];
const flagsDir = path.join(GAME, "data/flags");
const flagSet = new Set(fs.readdirSync(flagsDir).filter((f) => f.endsWith(".png")).map((f) => f.slice(0, -4)));
const countries = Object.values(byTag).map((c) => {
  const e = eco[c.tag] || {}, p = popdb[c.tag] || {}, m = mildb[c.tag] || {};
  return {
    tag: c.tag, n: names[c.en] || null, en: c.en, flag: flagSet.has(c.tag),
    states: c.states, area: Math.round(c.area),
    gdp: e.gdp_usd || 0, gdppc: e.gdp_usd && p.pop ? Math.round(e.gdp_usd / p.pop) : 0,
    pop: p.pop || 0, infl: e.inflation ?? null, unemp: e.unemployment ?? null, growth: e.growth_avg ?? null,
    mil: m.personnel || 0, cur: e.currency ? e.currency.code : "",
  };
}).sort((a, b) => b.gdp - a.gdp);

const data = {
  stats: { countries: countries.length, provinces: map.provinces.length, states: map.states.length, techs: Object.keys(res.TECHS).length, events: events.length, flags: flagSet.size },
  military: {
    equipment: ordered(mil.EQUIPMENT, mil.EQUIPMENT_ORDER),
    units: ordered(mil.UNITS, mil.UNIT_ORDER),
    airWing: mil.AIR_WING, buildings: Object.entries(mil.BUILDINGS).map(([id, b]) => ({ id, ...b })),
    laws: mil.LAWS, params: strip(mil, "EQUIPMENT", "EQUIPMENT_ORDER", "UNITS", "UNIT_ORDER", "AIR_WING", "BUILDINGS", "LAWS", "_meta"),
  },
  industry: {
    goods: ordered(ind.GOODS, ind.GOOD_ORDER), categories: ind.CATEGORIES,
    buildings: ordered(ind.BUILDINGS, ind.BUILDING_ORDER),
    params: { EXPAND_COST: ind.EXPAND_COST, EXPAND_TIME: ind.EXPAND_TIME, MODERNIZE_COST: ind.MODERNIZE_COST, MODERNIZE_MONTHS: ind.MODERNIZE_MONTHS, MODERNIZE_BONUS: ind.MODERNIZE_BONUS, MAX_TIER: ind.MAX_TIER },
  },
  trade: { systems: trd.SYSTEMS, sanctions: trd.SANCTION_LEVELS, regions: trd.REGIONS, traded: trd.TRADED, importBan: trd.SELECTIVE_IMPORT_BAN, exportBan: trd.SELECTIVE_EXPORT_BAN, notes: pol.SECTION_NOTES },
  diplomacy: {
    treaties: Object.entries(dip.TREATIES).map(([id, t]) => ({ id, ...t, proposable: dip.PROPOSABLE.includes(id) })),
    params: Object.fromEntries(Object.entries(dip).filter(([k, v]) => typeof v === "number")),
    states: dip.STATE_NAMES, baseByTreaty: dip.BASE_BY_TREATY, repBreach: dip.REP_BREACH,
  },
  naval: { ships: ordered(nav.SHIPS, nav.SHIP_ORDER), straits: nav.STRAITS.map((s) => s.name), seas: nav.SEAS.map((s) => ({ name: s.name, en: s.en })), params: { FLEET_YEARS: nav.FLEET_YEARS, NAVAL_BUDGET_SHARE: nav.NAVAL_BUDGET_SHARE, MAX_QUEUE: nav.MAX_QUEUE } },
  air: { missions: ordered(air.MISSIONS, air.MISSION_ORDER), types: ordered(air.AIR_TYPES, air.AIR_TYPE_ORDER), params: { BOMB_CAP: air.BOMB_CAP, SUPPRESS_MAX: air.SUPPRESS_MAX, INTERDICT_CAP: air.INTERDICT_CAP, AA_BONUS: air.AA_BONUS, AIRLIFT_UNITS: air.AIRLIFT_UNITS } },
  politics: {
    parties: Object.entries(par.PARTIES).map(([id, p]) => ({ id, name: p.name, en: p.en, color: p.color, ideology: p.ideology })),
    electionYears: par.ELECTION_YEARS, coalitionBelow: par.COALITION_BELOW,
  },
  peace,
  research: { slots: res.SLOTS, tierCost: res.TIER_COST, branches: res.BRANCHES, techs: Object.entries(res.TECHS).map(([id, t]) => ({ id, ...t })) },
  policies: { groups: pol.GROUPS, list: pol.POLICIES.map((p) => ({ id: p.id, group: p.group, section: p.section, kind: p.kind, label: p.label, description: p.description, min: p.min, max: p.max, step: p.step, unit: p.unit, options: p.options })) },
  eventStats: Object.fromEntries(Object.entries(evdef.STATS).map(([k, v]) => [k, v.label])),
  events, countries,
};

// --- Çeviriler: yalnızca wiki'de geçen Türkçe metinler için ----------------------------------------
const strings = new Set();
(function walk(v) {
  if (typeof v === "string") { if (/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(v)) strings.add(v); }
  else if (Array.isArray(v)) v.forEach(walk);
  else if (v && typeof v === "object") Object.values(v).forEach(walk);
})(data);
const tx = {};
for (const [code] of LANGS.slice(1)) {
  if (!exists(`data/lang/${code}.json`)) continue;
  const tab = rd(`data/lang/${code}.json`);
  const out = {};
  for (const s of strings) if (tab[s] && tab[s] !== s) out[s] = tab[s];
  tx[code] = out;
  if (code !== "en") tx[code]["@@name"] = tab["@@name"] || code;
}
const langs = LANGS.map(([code, nm], i) => ({ code, name: nm || (tx[code] && tx[code]["@@name"]) || code, idx: i }));
for (const c of Object.keys(tx)) delete tx[c]["@@name"];

const out = { generated: new Date().toISOString(), langs, tx, data };
fs.mkdirSync(path.join(WEB, "data"), { recursive: true });
fs.writeFileSync(path.join(WEB, "data/wiki-data.json"), JSON.stringify(out));
fs.writeFileSync(path.join(WEB, "data/wiki-data.js"), "window.WIKI_DATA=" + JSON.stringify(out) + ";\n");

// --- Varlıklar (kopyalama; kaynak değişmez) ---------------------------------------------------------
const cp = (from, to) => { fs.mkdirSync(path.dirname(path.join(WEB, to)), { recursive: true }); fs.copyFileSync(path.join(GAME, from), path.join(WEB, to)); };
for (const f of flagSet) cp(`data/flags/${f}.png`, `assets/flags/${f}.png`);
for (const f of fs.readdirSync(path.join(GAME, "screenshots")).filter((f) => f.endsWith(".png"))) cp(`screenshots/${f}`, `assets/screens/${f}`);
for (const f of ["Barlow-Regular.ttf", "Barlow-SemiBold.ttf", "BarlowCondensed-Bold.ttf", "OFL.txt"]) cp(`assets/fonts/${f}`, `assets/fonts/${f}`);
cp("icon.svg", "assets/icon.svg");

const kb = (p) => Math.round(fs.statSync(path.join(WEB, p)).size / 1024);
console.log(`ülke ${countries.length}, olay ${events.length}, teknoloji ${data.stats.techs}, metin ${strings.size}`);
console.log(`wiki-data.js ${kb("data/wiki-data.js")} KB; bayrak ${flagSet.size}`);
