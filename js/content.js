/* Heritage Wiki — sayfa içerikleri. Anlatımlar TR/EN; sayılar ve tablolar oyun dosyalarından (data/wiki-data.js). */
(function () {
  "use strict";
  const G = (tr, en) => ({ tr, en });
  window.WikiGroups = {
    intro: G("Giriş", "Introduction"),
    sys: G("Ülkeni yönet", "Run your country"),
    war: G("Savaş", "War"),
    world: G("Dünya", "The world"),
    more: G("Ek", "More"),
  };
  const P = [];
  const page = (id, group, icon, title, render, keywords) => P.push({ id, group, icon, title, render, keywords });

  // ortak küçük yardımcılar
  const li = (arr) => `<ul class="clean">${arr.map((x) => `<li>${x}</li>`).join("")}</ul>`;

  // =============================================================================================
  page("home", "intro", "⌂", G("Ana sayfa", "Home"), (W) => {
    const s = W.D.stats;
    return `
    <div class="hero"><img src="assets/screens/07_dunya_gorunumu.png" alt=""><div class="in">
      <h1>Heritage</h1>
      <p class="lead" style="margin:0">${W.p(G("Gerçek bir ülkeyi, canlı bir dünya haritasında yönet.", "Run a real country on a living world map."))}</p></div></div>
    <p>${W.p(G(
      "Heritage; gerçek ülke verileriyle başlayan, ekonomi, sanayi, ordu, ticaret ve diplomasiyi tek bir canlı simülasyonda birleştiren bir büyük strateji oyunudur. Enflasyon, faiz ve kamu borcuyla uğraşır, santraller ve fabrikalar kurar, ordunu donatır, anlaşmalar imzalar ve savaş ya da barış arasında seçim yaparsın. Bu wiki, oyundaki sistemlerin nasıl çalıştığını anlatır; tablolardaki sayılar doğrudan oyunun veri dosyalarından üretilir.",
      "Heritage is a grand strategy game that starts from real-world country data and combines economy, industry, military, trade and diplomacy in one living simulation. You fight inflation, interest rates and national debt, build power plants and factories, equip your army, sign treaties and choose between war and peace. This wiki explains how the game's systems work; the numbers in the tables are generated straight from the game's data files."))}</p>
    <div class="stats">
      <div class="stat"><b>${s.countries}</b><span>${W.p(G("ülke", "countries"))}</span></div>
      <div class="stat"><b>${W.num(s.provinces)}</b><span>${W.p(G("il", "provinces"))}</span></div>
      <div class="stat"><b>${W.num(s.states)}</b><span>${W.p(G("eyalet", "states"))}</span></div>
      <div class="stat"><b>${s.techs}</b><span>${W.p(G("teknoloji", "technologies"))}</span></div>
      <div class="stat"><b>${s.events}</b><span>${W.p(G("olay", "events"))}</span></div>
      <div class="stat"><b>9</b><span>${W.p(G("dil", "languages"))}</span></div>
    </div>
    ${W.h2("where", W.p(G("Nereden başlamalı?", "Where to start?")))}
    ${W.grid([
      { href: "#/start", title: W.p(G("Başlarken", "Getting started")), desc: W.p(G("Kontroller, kısayollar ve ilk 10 dakika.", "Controls, hotkeys and your first 10 minutes.")) },
      { href: "#/economy", title: W.p(G("Ekonomi", "Economy")), desc: W.p(G("Bütçe, vergi, faiz, enflasyon ve borç.", "Budget, taxes, interest, inflation and debt.")) },
      { href: "#/industry", title: W.p(G("Sanayi", "Industry")), desc: W.p(G("Santraller, madenler, fabrikalar ve mallar.", "Power plants, mines, factories and goods.")) },
      { href: "#/military", title: W.p(G("Ordu", "Military")), desc: W.p(G("Tümenler, ekipman, askerlik kanunu.", "Divisions, equipment, conscription law.")) },
      { href: "#/diplomacy", title: W.p(G("Diplomasi", "Diplomacy")), desc: W.p(G("Anlaşmalar, ilişkiler, itibar.", "Treaties, relations, reputation.")) },
      { href: "#/research", title: W.p(G("Araştırma", "Research")), desc: W.p(G("8 daldan 65 teknoloji.", "65 technologies in 8 branches.")) },
      { href: "#/countries", title: W.p(G("Ülkeler", "Countries")), desc: W.p(G("Tüm ülkelerin başlangıç verileri.", "Starting data for every country.")) },
      { href: "#/modding", title: W.p(G("Modlama", "Modding")), desc: W.p(G("Kod yazmadan JSON ile oyunu değiştir.", "Change the game with JSON — no code.")) },
    ])}
    ${W.h2("gallery", W.p(G("Ekran görüntüleri", "Screenshots")))}
    <div class="shots">
      ${["01_ulke_secimi", "03_turkiye_yakin", "04_ekonomi_paneli", "05_ordu_paneli", "06_diplomasi"].map((f) => W.shot(f + ".png", G("", ""))).join("")}
    </div>`;
  }, G("heritage ana sayfa giriş", "heritage home intro"));

  // =============================================================================================
  page("start", "intro", "▶", G("Başlarken", "Getting started"), (W) => {
    const hot = [["E", G("Ekonomi", "Economy")], ["N", G("Nüfus", "Population")], ["I", G("Sanayi", "Industry")], ["T", G("Ticaret", "Trade")], ["O", G("Ordu", "Military")], ["A", G("Araştırma", "Research")], ["P", G("İç siyaset", "Domestic politics")], ["D", G("Donanma", "Navy")], ["H", G("Hava kuvvetleri", "Air force")], ["R", G("Diplomasi", "Diplomacy")], ["V", G("Kıyasla", "Compare")], ["K", G("Kontrol Paneli", "Control Panel")], ["L", G("Bildirim geçmişi", "Notification history")]];
    const mouse = [
      [G("Sol tık", "Left click"), G("Eyalet ya da birlik seç", "Select a state or unit")],
      [G("Sağ tık", "Right click"), G("Etkileşim: birliğe hareket / saldırı emri", "Interact: order selected units to move / attack")],
      [G("Tekerlek", "Wheel"), G("Yakınlaş / uzaklaş", "Zoom in / out")],
      [G("Sürükle / W A S D", "Drag / W A S D"), G("Haritayı kaydır", "Pan the map")],
      [G("Boşluk", "Space"), G("Zamanı duraklat / devam ettir", "Pause / resume time")],
      [G("1 – 5", "1 – 5"), G("Oyun hızı (5. hız ≈ saniyede 100 oyun saati)", "Game speed (speed 5 ≈ 100 game hours per second)")],
      [G("F1", "F1"), G("Kısayol listesi", "Hotkey list")],
      [G("G", "G"), G("Seçili birlikleri gruplandır", "Group the selected units")],
      [G("Esc", "Esc"), G("Geri / menü", "Back / menu")],
    ];
    return `
    <h1>${W.p(G("Başlarken", "Getting started"))}</h1>
    <p class="lead">${W.p(G("Oyuna ilk girişte yapacakların ve bilmen gereken kontroller.", "What to do the first time you play, and the controls you need."))}</p>
    ${W.shot("01_ulke_secimi.png", G("Ülke seçimi: haritadan ya da listeden bir ülke seç.", "Country selection: pick a country from the map or the list."))}
    ${W.h2("first", W.p(G("İlk 10 dakika", "Your first 10 minutes")))}
    ${li([
      W.p(G("<b>Ülkeni seç.</b> Her ülke gerçek verilerle (GSYİH, nüfus, enflasyon, borç, ordu…) başlar. Büyük ekonomiler daha fazla seçenek sunar, küçükler daha zorlu ama daha esnektir.", "<b>Pick your country.</b> Every country starts with real data (GDP, population, inflation, debt, army…). Big economies offer more options; small ones are harder but more flexible.")),
      W.p(G("<b>Zaman duraklatılmış başlar.</b> Hazır olunca <kbd>Boşluk</kbd> ile başlat; <kbd>1</kbd>–<kbd>5</kbd> ile hızı ayarla. Simülasyon deterministiktir: hız sonucu değiştirmez, yalnızca ne kadar çabuk ilerlediğini.", "<b>Time starts paused.</b> Press <kbd>Space</kbd> when ready; use <kbd>1</kbd>–<kbd>5</kbd> for speed. The simulation is deterministic: speed changes only how fast it runs, not the outcome.")),
      W.p(G("<b>Önce Ekonomi panelini aç</b> (<kbd>E</kbd>). Enflasyon, işsizlik, politika faizi, bütçe açığı ve borç sana durumu söyler.", "<b>Open the Economy panel first</b> (<kbd>E</kbd>). Inflation, unemployment, policy rate, deficit and debt tell you where you stand.")),
      W.p(G("<b>Kontrol Paneli'ne</b> (<kbd>K</kbd>) bak: vergiler, harcamalar, faiz ve askerlik kanunu burada ayarlanır.", "<b>Visit the Control Panel</b> (<kbd>K</kbd>): taxes, spending, interest rates and conscription law are set there.")),
      W.p(G("<b>Araştırma</b> (<kbd>A</kbd>) ve <b>Sanayi</b> (<kbd>I</kbd>) uzun vadeli yatırımlardır; erken başla.", "<b>Research</b> (<kbd>A</kbd>) and <b>Industry</b> (<kbd>I</kbd>) are long-term investments; start early.")),
      W.p(G("<b>Olayları</b> dikkatle oku: her seçeneğin bedeli ve getirisi vardır.", "<b>Read events carefully:</b> every option has a cost and a payoff.")),
    ])}
    ${W.shot("02_oyun_baslangic.png", G("Oyun başlangıcı: üstte hazine, GSYİH, enflasyon, nüfus, sanayi, ticaret ve ordu özeti.", "Game start: the top bar summarises treasury, GDP, inflation, population, industry, trade and army."))}
    ${W.h2("controls", W.p(G("Fare ve klavye", "Mouse and keyboard")))}
    ${W.table([W.p(G("Giriş", "Input")), W.p(G("İşlev", "Action"))], mouse.map(([a, b]) => [`<kbd>${W.esc(W.p(a))}</kbd>`, W.esc(W.p(b))]))}
    ${W.h2("hotkeys", W.p(G("Sayfa kısayolları", "Page hotkeys")))}
    <p>${W.p(G("Aşağıdaki tuşlar ilgili bilgi sayfasını açar.", "These keys open the matching info page."))}</p>
    <div class="grid">${hot.map(([k, n]) => `<div class="card"><b><kbd>${k}</kbd> &nbsp;${W.esc(W.p(n))}</b></div>`).join("")}</div>
    ${W.h2("save", W.p(G("Kayıt, dil ve ayarlar", "Saving, language and settings")))}
    ${li([
      W.p(G("Ana menüden kayıt yükleyebilir, <b>Ayarlar</b>'dan dili değiştirebilirsin. Oyun 9 dili destekler: Türkçe, İngilizce, Çince, Rusça, İspanyolca, Portekizce, Almanca, Fransızca, Japonca.", "Load games from the main menu and change language in <b>Settings</b>. The game supports 9 languages: Turkish, English, Chinese, Russian, Spanish, Portuguese, German, French and Japanese.")),
      W.p(G("Kayıt dosyası etkin modların listesini saklar; farklı mod kümesiyle yapılmış kayıt yükleme ekranında “⚠ modlar farklı” ile işaretlenir.", "A save stores the list of enabled mods; a save made with a different mod set is flagged “⚠ mods differ” on the load screen.")),
    ])}
    ${W.shot("08_yukleme_ekrani.png", G("Yükleme ekranı.", "Load screen."))}`;
  }, G("kontroller kısayol tuş klavye başlangıç öğretici", "controls hotkeys keys tutorial beginner"));

  // =============================================================================================
  page("economy", "sys", "$", G("Ekonomi", "Economy"), (W) => {
    const pols = W.D.policies.list.filter((x) => x.group === "economy");
    const sys = W.D.trade.systems;
    return `
    <h1>${W.p(G("Ekonomi", "Economy"))}</h1>
    <p class="lead">${W.p(G("Hazineyi yönet, enflasyonu dizginle, borcu sürdürülebilir tut.", "Manage the treasury, tame inflation, keep debt sustainable."))}</p>
    ${W.shot("04_ekonomi_paneli.png", G("Ekonomi paneli: GSYİH, enflasyon, para birimi, bütçe ve hazine bilgileri.", "Economy panel: GDP, inflation, currency, budget and treasury figures."))}
    ${W.h2("basics", W.p(G("Temel göstergeler", "Core indicators")))}
    <p>${W.p(G("Her ülke gerçek dünya verileriyle başlar (GSYİH, büyüme, enflasyon, işsizlik, kamu gelir-gider ve borç oranları, para arzı, döviz kuru, rezervler). Panelde şunları izlersin:", "Every country starts from real-world figures (GDP, growth, inflation, unemployment, revenue, spending and debt ratios, money supply, exchange rate, reserves). The panel shows:"))}</p>
    ${li([
      W.p(G("<b>GSYİH ve kişi başı gelir</b>, reel büyüme, <b>çıktı açığı</b> (ekonominin potansiyelin altında / üstünde olması).", "<b>GDP and income per capita</b>, real growth, and the <b>output gap</b> (economy below / above potential).")),
      W.p(G("<b>Enflasyon</b>, <b>enflasyon beklentisi</b> ve <b>enflasyon hedefi</b>; <b>merkez bankası güveni</b> beklentileri çapalar.", "<b>Inflation</b>, <b>inflation expectations</b> and the <b>inflation target</b>; <b>central bank credibility</b> anchors expectations.")),
      W.p(G("<b>Politika faizi</b>, para arzı, <b>döviz kuru</b> ve <b>döviz rezervleri</b>.", "The <b>policy rate</b>, money supply, <b>exchange rate</b> and <b>FX reserves</b>.")),
      W.p(G("<b>Bütçe</b>: son 12 ayın gelir, gider, faiz gideri, açık ve kamu borcu (yerli / döviz cinsi ayrımıyla).", "<b>Budget</b>: last-12-month revenue, spending, interest costs, deficit and public debt (split into local / foreign currency).")),
      W.p(G("<b>Hazine</b>: kasadaki nakit; gelir – gider farkı ay sonunda kasaya eklenir.", "<b>Treasury</b>: cash on hand; the monthly revenue-minus-spending gap is added to it at month end.")),
    ])}
    ${W.h2("systems", W.p(G("Ekonomik sistemler", "Economic systems")))}
    <p>${W.p(G("Hedef sistemi Kontrol Paneli'nden seçersin; geçiş her seferinde bir kademedir ve yaklaşık 1,5 yıl sürer (demokrasilerde parlamento süreci nedeniyle 3 yıla kadar). Devlet kontrolüne doğru her adım istikrarı sarsar; planlı ekonomiden piyasaya geçiş de geçiş sancısı yaratır.", "You pick a target system in the Control Panel; transitions move one step at a time and take about 1.5 years each (up to 3 in democracies because of parliament and opposition). Every step toward state control shakes stability; moving from planned economy back to markets also causes transition pain."))}</p>
    ${W.table([W.p(G("Sistem", "System")), W.p(G("Verimlilik büyümesi", "Productivity growth")), W.p(G("Dış ticaret çarpanı", "Foreign-trade multiplier")), W.p(G("Fiyat geçişi", "Price pass-through")), W.p(G("Devlet kontrolü", "State control")), ""], sys.map((s) => [`<b>${W.esc(W.t(s.name))}</b>`, `${s.growth > 0 ? "+" : ""}${W.num(s.growth * 100, 2)}%`, "×" + W.num(s.two_way, 2), W.pct(s.price_pass, 0), W.pct(s.control, 0), `<small>${W.esc(W.t(s.description))}</small>`]), { num: [1, 2, 3, 4] })}
    ${W.h2("policy", W.p(G("Ekonomi politikaları", "Economic policies")))}
    <p>${W.p(G("Aşağıdakiler Kontrol Paneli'nin <b>Ekonomi</b> sekmesindeki ayarlardır.", "These are the settings found under the <b>Economy</b> tab of the Control Panel."))}</p>
    ${W.table([W.p(G("Politika", "Policy")), W.p(G("Bölüm", "Section")), W.p(G("Tür", "Type")), W.p(G("Açıklama", "Description"))], pols.map((x) => ({ id: "po_" + x.id, cells: [`<b>${W.esc(W.t(x.label))}</b>`, W.esc(W.t(x.section)), W.esc(W.ui(x.kind)), `${W.esc(W.t(x.description))}`] })))}
    ${W.tip(W.p(G("<b>İpucu:</b> toplam vergi yükü GSYİH'nin yaklaşık %25'ini aşınca verimlilik artışı yavaşlar; kasada yeterli tampon yoksa hazine piyasadan otomatik borçlanır ve faiz öder.", "<b>Tip:</b> once the total tax burden passes roughly 25% of GDP, productivity growth slows; without a sufficient cash buffer the treasury automatically borrows at market rates.")))}`;
  }, G("gsyih enflasyon faiz borç bütçe vergi hazine merkez bankası", "gdp inflation interest debt budget tax treasury central bank"));

  // =============================================================================================
  page("population", "sys", "☺", G("Nüfus", "Population"), (W) => {
    const pols = W.D.policies.list.filter((x) => x.group === "society");
    return `
    <h1>${W.p(G("Nüfus", "Population"))}</h1>
    <p class="lead">${W.p(G("Yaş piramidi, doğurganlık, göç ve iş gücü ekonominin ve ordunun hammaddesidir.", "The age pyramid, fertility, migration and labor force are the raw material of the economy and the army."))}</p>
    ${W.h2("model", W.p(G("Nüfus modeli", "Population model")))}
    <p>${W.p(G("Nüfus, kadın ve erkek için <b>17 yaş grubundan</b> oluşan bir piramitle simüle edilir. Her ülke için başlangıçta ham doğum ve ölüm hızı, toplam doğurganlık, yaşam beklentisi, bebek ölümleri, net göç, iş gücü ve okur-yazarlık verileri vardır. Zamanla yaş grupları ilerler, doğum ve ölümler piramidi değiştirir.", "Population is simulated as a pyramid of <b>17 age groups</b> for men and women. Each country starts with crude birth and death rates, total fertility, life expectancy, infant mortality, net migration, labor force and literacy. Over time the age cohorts advance and births and deaths reshape the pyramid."))}</p>
    ${li([
      W.p(G("<b>İş gücü</b> işsizlik oranını ve üretimi belirler; askere alınanlar iş gücünden çekilir (bkz. <a href=\"#/military\">Ordu</a>).", "<b>Labor force</b> drives unemployment and output; conscripted men leave the labor force (see <a href=\"#/military\">Military</a>).")),
      W.p(G("<b>Askerlik çağı</b> 20–39 yaş erkeklerdir; askerlik kanunu bunların ne kadarının silah altına alınabileceğini belirler.", "<b>Military age</b> is men aged 20–39; the conscription law sets how many of them can be mobilised.")),
      W.p(G("<b>Savunma harcaması, sağlık ve eğitim</b> kamu bütçesinden gelir; sağlık teknolojileri ölüm hızını düşürür (araştırma ağacı).", "<b>Defense, health and education</b> are paid from the public budget; health technologies lower mortality (see the research tree).")),
    ])}
    ${W.h2("policy", W.p(G("Toplum politikaları", "Society policies")))}
    ${W.table([W.p(G("Politika", "Policy")), W.p(G("Seçenekler", "Options")), W.p(G("Açıklama", "Description"))], pols.map((x) => ({ id: "po_" + x.id, cells: [`<b>${W.esc(W.t(x.label))}</b>`, x.kind === "choice" ? x.options.map((o) => W.esc(W.t(o[0]))).join(" · ") : `${W.num(x.min * 100, 2)}% – ${W.num(x.max * 100, 2)}% ${W.p(G("GSYİH", "of GDP"))}`, W.esc(W.t(x.description))] })))}
    ${W.note(W.p(G("Nüfus verileri Dünya Bankası ve BM tahminlerinden derlenmiştir; her ülkenin başlangıç değeri <a href=\"#/countries\">Ülkeler</a> sayfasında listelenir.", "Population data is compiled from World Bank and UN estimates; each country's starting value is listed on the <a href=\"#/countries\">Countries</a> page.")))}`;
  }, G("nüfus göç doğurganlık yaş piramidi iş gücü", "population migration fertility age pyramid labor force"));

  // =============================================================================================
  page("industry", "sys", "⚙", G("Sanayi ve enerji", "Industry & energy"), (W) => {
    const I = W.D.industry, pr = I.params;
    const row = (b) => ({ id: b.id, cells: [`<b>${W.esc(W.t(b.name))}</b>`, W.esc(W.t(I.categories.find((c) => c[0] === b.category)[1])), W.good(b.output), Object.keys(b.inputs || {}).length ? Object.entries(b.inputs).map(([g, v]) => `${W.good(g)} <small>×${W.num(v, 2)}</small>`).join("<br>") : "—", W.money(b.cost), b.months, W.num(b.jobs)] });
    return `
    <h1>${W.p(G("Sanayi ve enerji", "Industry & energy"))}</h1>
    <p class="lead">${W.p(G("Elektrikten silaha kadar uzanan bir üretim zinciri: girdiyi bul, tesisi kur, malı sat.", "A production chain from electricity to weapons: secure inputs, build the plant, sell the goods."))}</p>
    ${W.h2("how", W.p(G("Nasıl çalışır?", "How it works")))}
    ${li([
      W.p(G("Her eyalette <b>tesisler</b> kurulur; her tesis bir <b>mal</b> üretir ve bazı <b>girdileri</b> tüketir (ör. termik santral kömür yakar, çelik fabrikası cevher ve elektrik kullanır).", "Each state hosts <b>facilities</b>; each produces a <b>good</b> and consumes <b>inputs</b> (a coal plant burns coal; a steel mill uses ore and electricity).")),
      W.p(G("İç üretim yetmezse mal <a href=\"#/trade\">dış ticaretten</a> alınır; fazla üretim satılır. Elektrik ticarete konu olmaz.", "When domestic output falls short, goods are bought through <a href=\"#/trade\">foreign trade</a>; surplus is sold. Electricity is not tradable.")),
      W.p(G(`Mevcut bir tesisi <b>genişletmek</b> yeni kurmaktan ucuz ve hızlıdır (maliyet ×${pr.EXPAND_COST}, süre ×${pr.EXPAND_TIME}). <b>Modernizasyon</b> maliyetin %${W.num(pr.MODERNIZE_COST * 100)}'una ${pr.MODERNIZE_MONTHS} ayda yapılır, her kademe verimi %${W.num(pr.MODERNIZE_BONUS * 100)} artırır (en çok ${pr.MAX_TIER} kademe).`, `<b>Expanding</b> an existing facility is cheaper and faster than building new (cost ×${pr.EXPAND_COST}, time ×${pr.EXPAND_TIME}). <b>Modernisation</b> costs ${W.num(pr.MODERNIZE_COST * 100)}% of the base cost, takes ${pr.MODERNIZE_MONTHS} months, and each tier raises efficiency by ${W.num(pr.MODERNIZE_BONUS * 100)}% (up to ${pr.MAX_TIER} tiers).`)),
      W.p(G("Tesisler <b>istihdam</b> yaratır; inşaat sürerken maliyet yıllara yayılarak ödenir.", "Facilities create <b>jobs</b>; during construction the cost is paid in installments across the build time.")),
    ])}
    ${W.h2("goods", W.p(G("Mallar", "Goods")))}
    ${W.table([W.ui("name"), W.p(G("Dış ticaret", "Tradable"))], I.goods.map((g) => [`<b>${W.esc(W.t(g.name))}</b>`, g.tradable ? "✓" : "—"]))}
    ${W.h2("buildings", W.p(G("Tesisler", "Facilities")))}
    <p>${W.p(G("Maliyet, milyar dolar cinsinden temel inşaat bedelidir; girdiler, bir birim çıktı için gereken miktarı gösterir.", "Cost is the base construction price in billions of dollars; inputs show the amount needed per unit of output."))}</p>
    ${W.table([W.ui("name"), W.ui("category"), W.ui("output"), W.ui("inputs"), W.ui("cost") + " (bn $)", W.ui("months"), W.ui("jobs")], I.buildings.map(row), { num: [4, 5, 6] })}`;
  }, G("santral madencilik fabrika elektrik enerji mal üretim", "power plant mine factory electricity energy goods production"));

  // =============================================================================================
  page("trade", "sys", "⇄", G("Ticaret", "Trade"), (W) => {
    const T = W.D.trade;
    const notes = Object.entries(T.notes);
    return `
    <h1>${W.p(G("Ticaret", "Trade"))}</h1>
    <p class="lead">${W.p(G("Gümrük vergileri, ihracat yasakları ve yaptırımlarla dünya piyasasında yerini belirle.", "Use tariffs, export bans and sanctions to shape your place in the world market."))}</p>
    ${W.h2("market", W.p(G("Dünya piyasası", "The world market")))}
    <p>${W.p(G(`${T.traded.length} mal dünya piyasasında alınıp satılır: ${T.traded.map((g) => W.good(g)).join(", ")}. Fiyatlar arz ve talebe göre her ay en çok %10 oynar; eksik mal fiyatı yükseltir, satılamayan mal indirimle elden çıkar.`, `${T.traded.length} goods are traded on the world market: ${T.traded.map((g) => W.good(g)).join(", ")}. Prices move by at most 10% a month with supply and demand; shortages raise prices and unsold goods are dumped at a discount.`))}</p>
    ${W.shot("03_turkiye_yakin.png", G("Ticaret ve ordu bilgileri üst çubukta; bölgeler haritada renklendirilir.", "Trade and army figures sit in the top bar; regions are colored on the map."))}
    ${W.h2("tools", W.p(G("Ticaret politikaları", "Trade policies")))}
    ${W.table([W.p(G("Araç", "Tool")), W.p(G("Ne yapar?", "What it does"))], notes.map(([k, v]) => [`<b>${W.esc(W.t(k))}</b>`, W.esc(W.t(v))]))}
    ${W.h2("sanctions", W.p(G("Yaptırımlar", "Sanctions")))}
    <p>${W.p(G("Bir ülkeye uygulanabilecek yaptırım düzeyleri:", "Sanction levels that can be applied to a country:"))} ${T.sanctions.map((s) => W.pill(W.t(s), true)).join(" ")}</p>
    ${li([
      W.p(G(`<b>Seçici yaptırım</b> yalnızca bazı malları keser: ithalat yasağı ${T.importBan.map((g) => W.good(g)).join(", ")}; ihracat yasağı ${T.exportBan.map((g) => W.good(g)).join(", ")}.`, `<b>Selective sanctions</b> cut only some goods: import ban on ${T.importBan.map((g) => W.good(g)).join(", ")}; export ban on ${T.exportBan.map((g) => W.good(g)).join(", ")}.`)),
      W.p(G("<b>Tam ambargo</b> bütün ticareti durdurur. Yaptırım uygulayan da kaybeder: ticareti kesilen taraf ilişkileri düşürür.", "A <b>full embargo</b> stops all trade. The sanctioning side loses too, and relations drop sharply.")),
    ])}
    ${W.h2("regions", W.p(G("Ticaret bölgeleri", "Trade regions")))}
    <p>${W.p(G("Ülkeler ticarette 9 bölgeye ayrılır:", "Countries are grouped into 9 trade regions:"))} ${T.regions.map((r) => W.pill(W.t(r))).join(" ")}</p>`;
  }, G("gümrük tarife ihracat ithalat yaptırım ambargo piyasa fiyat", "tariff customs export import sanction embargo market price"));

  // =============================================================================================
  page("politics", "sys", "⚖", G("İç siyaset", "Domestic politics"), (W) => {
    const Pp = W.D.politics;
    const axis = (v) => `<span class="bar" style="width:${Math.round((v + 1) * 25)}px;opacity:.9"></span> ${v > 0 ? "+" : ""}${v}`;
    return `
    <h1>${W.p(G("İç siyaset", "Domestic politics"))}</h1>
    <p class="lead">${W.p(G("Partiler, halk onayı, seçimler, ayrılıkçılık ve vasal devletler.", "Parties, approval, elections, separatism and vassal states."))}</p>
    ${W.h2("regimes", W.p(G("Rejim türleri", "Regime types")))}
    ${W.table([W.p(G("Rejim", "Regime")), W.p(G("Demokrasi endeksi", "Democracy index")), W.p(G("Seçim", "Elections"))], [
      [`<b>${W.p(G("Demokrasi", "Democracy"))}</b>`, "≥ 0,5", W.p(G(`Her ${Pp.electionYears.democracy} yılda bir`, `Every ${Pp.electionYears.democracy} years`))],
      [`<b>${W.p(G("Melez rejim", "Hybrid regime"))}</b>`, "0,25 – 0,5", W.p(G(`Her ${Pp.electionYears.hybrid} yılda bir; hâkim parti üstündür`, `Every ${Pp.electionYears.hybrid} years; the ruling party has the upper hand`))],
      [`<b>${W.p(G("Otoriter rejim", "Autocracy"))}</b>`, "< 0,25", W.p(G("Seçim yapılmaz", "No elections"))],
    ])}
    ${W.h2("approval", W.p(G("Halk onayı ve seçimler", "Approval and elections")))}
    ${li([
      W.p(G("<b>Halk onayı</b> işsizliğe, enflasyona, büyümeye, istikrara ve savaşa bağlıdır; onay istikrarı geri besler.", "<b>Approval</b> depends on unemployment, inflation, growth, stability and war, and feeds back into stability.")),
      W.p(G(`Seçimi kazanan parti(ler)in <b>gündemi</b>, bir sonraki seçime kadar politika kaymaları olarak uygulanır. Kazanan oy payı %${W.num(Pp.coalitionBelow * 100)}'ın altındaysa <b>koalisyon</b> kurulur.`, `The winning party's <b>agenda</b> is applied as policy shifts until the next election. If the winner's vote share is below ${W.num(Pp.coalitionBelow * 100)}%, a <b>coalition</b> forms.`)),
      W.p(G("Oyuncu şu eylemleri yapabilir (yılda bir): <b>popülist harcama</b> (GSYİH'nin %1'i), <b>erken seçim</b>, <b>muhalefeti bastırma</b>.", "You can take these actions (once a year): <b>populist spending</b> (1% of GDP), <b>early election</b>, <b>suppress opposition</b>.")),
    ])}
    ${W.h2("parties", W.p(G("Partiler", "Parties")))}
    <p>${W.p(G("İdeoloji üç eksende −1 ile +1 arasındadır; ülkelerin seçmen dağılımı bu eksenlerle eşleştirilir.", "Ideology sits between −1 and +1 on three axes; each country's electorate is matched against them."))}</p>
    ${W.table([W.p(G("Parti", "Party")), W.p(G("Ekonomi", "Economy")), W.p(G("Değerler", "Values")), W.p(G("Ulusalcılık", "Nationalism"))], Pp.parties.map((x) => ({ id: "p_" + x.id, cells: [`<span class="dot" style="background:${x.color}"></span><b>${W.esc(W.nm(x))}</b>`, axis(x.ideology[0]), axis(x.ideology[1]), axis(x.ideology[2])] })))}
    ${W.h2("sovereignty", W.p(G("Egemenlik: ayrılıkçılık, isyan, vasallık", "Sovereignty: separatism, revolt, vassals")))}
    ${li([
      W.p(G("<b>Ayrılıkçılık</b> eyalet düzeyindedir: ülkenin istikrarsızlığı, merkeze uzaklık ve yakın zamanda fetih bunu artırır; özerklik azaltır.", "<b>Separatism</b> is tracked per state: instability, distance from the capital and recent conquest raise it; autonomy lowers it.")),
      W.p(G("Eşik aşılınca bir bölge <b>isyan</b> eder. Sonuç: bastırılır, müzakereyle özerklik ya da fiilî bağımsızlık (tanınmamış bölgede üretim ve vergi sıfırdır).", "Past a threshold a region <b>revolts</b>. Outcomes: it is crushed, granted autonomy by negotiation, or becomes de facto independent (a unrecognised region produces and pays no tax).")),
      W.p(G("<b>Vasallık</b>: vasal yıllık GSYİH'sinin %1'ini haraç öder; erişim ve ticaret tamdır. Vasallaştırılacak ekonomi senin ekonominin en çok %30'u kadar olabilir; bağımsızlık isteği çok büyürse vasal kopar.", "<b>Vassalage</b>: a vassal pays 1% of its annual GDP as tribute; access and trade are full. A vassal's economy can be at most 30% of yours, and if its desire for independence grows too high it breaks away.")),
    ])}`;
  }, G("parti seçim onay istikrar isyan ayrılıkçılık vasal", "party election approval stability revolt separatism vassal"));

  // =============================================================================================
  page("research", "sys", "⚛", G("Araştırma", "Research"), (W) => {
    const R = W.D.research;
    const mk = (tch) => {
      const out = [];
      for (const [k, v] of Object.entries(tch.mods || {})) {
        const sign = v >= 0 ? "+" : "";
        const [kind, arg] = k.split(":");
        const lbl = kind === "output" ? W.p(G(W.building(arg) + " verimi", W.building(arg) + " output")) : ({ research_speed: G("Araştırma hızı", "Research speed"), air_strength: G("Hava gücü", "Air strength"), mil_strength: G("Kara gücü", "Land strength"), naval_strength: G("Deniz gücü", "Naval strength") }[kind] ? W.p({ research_speed: G("Araştırma hızı", "Research speed"), air_strength: G("Hava gücü", "Air strength"), mil_strength: G("Kara gücü", "Land strength"), naval_strength: G("Deniz gücü", "Naval strength") }[kind]) : k);
        out.push(`${lbl} ${sign}${W.num(v * 100, 1)}%`);
      }
      for (const e of tch.effects || []) {
        const lbl = W.t((W.D.eventStats[e.stat]) || e.stat);
        const v = e.op === "mul" ? (e.value - 1) * 100 : e.value * 100;
        out.push(`${W.esc(lbl)} ${v >= 0 ? "+" : ""}${W.num(v, 2)}%`);
      }
      return out;
    };
    const names = Object.fromEntries(R.techs.map((x) => [x.id, W.nm(x)]));
    return `
    <h1>${W.p(G("Araştırma", "Research"))}</h1>
    <p class="lead">${W.p(G(`${R.branches.length} daldan ${R.techs.length} teknoloji; ekonomini, ordunu ve bilimini geliştir.`, `${R.techs.length} technologies across ${R.branches.length} branches to grow your economy, army and science.`))}</p>
    ${W.h2("rules", W.p(G("Kurallar", "Rules")))}
    ${li([
      W.p(G("Her ülke aylık <b>araştırma puanı</b> üretir: GSYİH'nin karekökü × eğitim harcaması × bilim teknolojilerinin çarpanı. Puan, en çok " + R.slots + " paralel projeye eşit bölünür.", "Each country earns monthly <b>research points</b>: the square root of GDP × education spending × science-tech multipliers. Points are split equally across at most " + R.slots + " parallel projects.")),
      W.p(G("Teknoloji, büyük ekonomilerde yaygınlaştıkça <b>ucuzlar</b> (bilgi yayılımı; en büyük ekonomilerin hepsi biliyorsa %50'ye kadar indirim). Savaşta puan azalır.", "Technologies get <b>cheaper</b> as they spread in the largest economies (up to a 50% discount if all top economies have it). War reduces points.")),
      W.p(G("Bazı teknolojiler belirli bir yıldan önce araştırılamaz; kademe 5 teknolojiler gelecekte (2030'lar) açılır.", "Some technologies can't be researched before a given year; tier-5 techs arrive in the 2030s.")),
      W.p(G("Kademe başına puan maliyeti:", "Point cost per tier:")) + " " + R.tierCost.slice(1).map((c, i) => W.pill(`${i + 1}: ${W.num(c)}`, true)).join(" "),
    ])}
    ${R.branches.map((b) => {
      const techs = R.techs.filter((x) => x.branch === b.id);
      return `<div class="branchhead"><span class="dot" style="background:${b.color};width:14px;height:14px"></span><h3>${W.esc(W.nm(b))}</h3><span class="pill">${techs.length}</span></div>
      <div class="tree">${[1, 2, 3, 4, 5].map((tier) => `<div class="tcol"><div class="cap">${W.ui("tier")} ${tier}</div>${techs.filter((x) => x.tier === tier).map((x) => {
        const effs = mk(x);
        return `<div class="tech" id="${x.id}" style="border-left-color:${b.color}"><b>${W.esc(W.nm(x))}</b>${W.esc(W.lang === "tr" ? x.desc : x.en_desc || W.t(x.desc))}${effs.length ? `<span class="eff">${effs.join(" · ")}</span>` : ""}${x.req ? `<span class="req">↳ ${x.req.map((r) => W.esc(names[r] || r)).join(", ")}</span>` : ""}${x.year ? `<span class="req">⏳ ${x.year}</span>` : ""}</div>`;
      }).join("")}</div>`).join("")}</div>`;
    }).join("")}`;
  }, G("teknoloji ağaç araştırma puanı bilim", "technology tree research points science"));

  // =============================================================================================
  page("policies", "sys", "☰", G("Kontrol Paneli", "Control Panel"), (W) => {
    const L = W.D.policies;
    const tag = (x) => ({ slider: "slider", toggle: "toggle", action: "action", choice: "choice" }[x.kind]);
    return `
    <h1>${W.p(G("Kontrol Paneli", "Control Panel"))}</h1>
    <p class="lead">${W.p(G("Ülkeni yöneten tüm ayarlar tek yerde (kısayol: K).", "Every lever that runs your country in one place (hotkey: K)."))}</p>
    <p>${W.p(G(`${L.list.length} politika dört grupta toplanır. Kaydırıcılar değer aralığında, anahtarlar aç/kapa, eylemler tek seferlik komut, seçimler ise ayrık seçenek sunar.`, `${L.list.length} policies are organised in four groups. Sliders pick a value in a range, toggles switch on/off, actions are one-off commands, and choices offer discrete options.`))}</p>
    ${L.groups.map(([gid, gname, gdesc]) => `
      ${W.h2("g_" + gid, W.t(gname))}<p>${W.esc(W.t(gdesc))}</p>
      ${W.table([W.p(G("Politika", "Policy")), W.ui("section"), W.ui("kind"), W.p(G("Açıklama", "Description"))], L.list.filter((x) => x.group === gid).map((x) => ({ id: "po_" + x.id, cells: [`<b>${W.esc(W.t(x.label))}</b>`, W.esc(W.t(x.section)), W.esc(W.ui(tag(x))), x.kind === "choice" ? `${W.esc(W.t(x.description))}<br>${x.options.map((o) => W.pill(W.t(o[0]))).join(" ")}` : W.esc(W.t(x.description))] })))}`).join("")}`;
  }, G("politika kaydırıcı vergi harcama askerlik göç", "policy slider tax spending conscription immigration"));

  // =============================================================================================
  page("military", "war", "⚔", G("Ordu", "Military"), (W) => {
    const M = W.D.military, pr = M.params;
    const eq = Object.fromEntries(M.equipment.map((e) => [e.id, e]));
    return `
    <h1>${W.p(G("Ordu", "Military"))}</h1>
    <p class="lead">${W.p(G("Tümenleri kur, ekipmanı üret, cepheyi yönet.", "Raise divisions, produce equipment, command the front."))}</p>
    ${W.shot("05_ordu_paneli.png", G("Ordu paneli: insan gücü, ekipman stokları ve tümenler.", "Military panel: manpower, equipment stocks and divisions."))}
    ${W.h2("manpower", W.p(G("İnsan gücü ve askerlik kanunu", "Manpower and conscription law")))}
    <p>${W.p(G("Askerlik kanunu, askerlik çağındaki (20–39 yaş) erkeklerin silah altına alınabilecek payını belirler. İnsan gücü birkaç ayda bu tavana yaklaşır; başlangıçtakinden fazla asker iş gücünden çekilir ve üretimi düşürür. Barışta seferberlik toplumsal huzursuzluk yaratır.", "The conscription law sets the share of military-age men (20–39) who can be called up. Manpower approaches the ceiling within a few months; troops beyond the starting level are withdrawn from the labor force and reduce output. Mobilising in peacetime causes unrest."))}</p>
    ${W.table([W.ui("name"), W.p(G("Silah altına alınabilir pay", "Mobilisable share")), W.p(G("İstikrar etkisi", "Stability effect")), W.p(G("Açıklama", "Description"))], M.laws.map((l) => [`<b>${W.esc(W.t(l.name))}</b>`, W.pct(l.share, 0), l.stability ? "−" + W.pct(l.stability, 0) : "—", W.esc(W.t(l.description))]), { num: [1, 2] })}
    ${W.h2("equipment", W.p(G("Ekipman", "Equipment")))}
    <p>${W.p(G("Tümenler insan gücüne ek olarak ekipman ister. Ekipman, savunma bütçesinin tedarik payından üretilir ya da (isteğe bağlı) ithal edilir; Kontrol Paneli'ndeki üretim hatları oranları dağılımı belirler.", "Divisions need equipment as well as manpower. Equipment is produced from the procurement share of the defense budget or, optionally, imported; production lines in the Control Panel set the split."))}</p>
    ${W.table([W.ui("name"), W.ui("unit"), W.ui("price"), W.p(G("Açıklama", "Description"))], M.equipment.map((e) => ({ id: "e_" + e.id, cells: [`<b>${W.esc(W.t(e.name))}</b>`, W.esc(W.t(e.unit)), "$" + W.num(e.cost), W.esc(W.t(e.description))] })), { num: [2] })}
    ${W.h2("units", W.p(G("Kara birlikleri", "Land units")))}
    ${W.table([W.ui("name"), W.ui("men"), W.ui("equip"), W.p(G("Yumuşak", "Soft")), W.p(G("Zırhlı", "Hard")), W.p(G("Savunma", "Defense")), W.p(G("Atılım", "Breakthrough")), W.p(G("Hız", "Speed")), W.p(G("Moral", "Org")), W.p(G("Eğitim (gün)", "Training (days)"))], M.units.map((u) => ({ id: "u_" + u.id, cells: [`<b>${W.esc(W.t(u.name))}</b>`, W.num(u.men), Object.entries(u.equipment).map(([k, v]) => `${W.esc(W.t(eq[k].name))}: ${W.num(v)}`).join("<br>"), W.num(u.soft, 2), W.num(u.hard, 2), W.num(u.defense, 2), W.num(u.breakthrough, 2), W.num(u.speed, 0), W.num(u.org, 0), u.train_days] })), { num: [1, 3, 4, 5, 6, 7, 8, 9] })}
    <p>${W.p(G("<b>Yumuşak / zırhlı</b>: sırasıyla piyade ile zırhlı hedeflere verilen hasar katsayısı. <b>Atılım</b> saldırıda, <b>savunma</b> savunmada etkilidir. <b>Moral (org)</b> sıfıra yaklaşınca birlik geri çekilir.", "<b>Soft / hard</b>: damage multipliers against soft (infantry) and hard (armored) targets. <b>Breakthrough</b> helps attacks, <b>defense</b> helps defenders. When <b>organisation</b> nears zero a unit retreats."))}</p>
    ${W.h2("combat", W.p(G("Muharebe kuralları", "Combat rules")))}
    ${li([
      W.p(G(`Savunan tarafın muharebe katsayısı ×${pr.DEFENDER_BONUS}; her mevzilenme kademesi %${W.num(pr.ENTRENCH_BONUS * 100)} ekler (en çok ${pr.ENTRENCH_MAX} kademe).`, `Defenders get a ×${pr.DEFENDER_BONUS} combat multiplier; each entrenchment level adds ${W.num(pr.ENTRENCH_BONUS * 100)}% (up to ${pr.ENTRENCH_MAX} levels).`)),
      W.p(G(`Ekipman nesilleri ${pr.MAX_GENERATION}. nesile kadar gider: her nesil güce %${W.num(pr.GENERATION_POWER * 100)}, maliyete %${W.num(pr.GENERATION_COST * 100)} ekler; yeni nesil ${pr.RESEARCH_MONTHS} ayda araştırılır.`, `Equipment generations go up to generation ${pr.MAX_GENERATION}: each adds ${W.num(pr.GENERATION_POWER * 100)}% power and ${W.num(pr.GENERATION_COST * 100)}% cost; a new generation takes ${pr.RESEARCH_MONTHS} months to research.`)),
      W.p(G("Birlikler tedarik hattının uzunluğuna göre aşınır; zırhlı tümenler en çok lojistik ister.", "Units wear down along long supply lines; armored divisions need the most logistics.")),
      W.p(G(`Savaş maliyeti günlük: piyade $${W.num(pr.DAILY_WAR_COST.infantry)}, zırhlı $${W.num(pr.DAILY_WAR_COST.armored)}, topçu $${W.num(pr.DAILY_WAR_COST.artillery)}; asker başına yıllık personel gideri $${W.num(pr.PERSONNEL_COST)}.`, `Daily war cost: infantry $${W.num(pr.DAILY_WAR_COST.infantry)}, armored $${W.num(pr.DAILY_WAR_COST.armored)}, artillery $${W.num(pr.DAILY_WAR_COST.artillery)}; personnel cost per soldier per year $${W.num(pr.PERSONNEL_COST)}.`)),
    ])}
    ${W.h2("buildings", W.p(G("Askerî tesisler", "Military facilities")))}
    ${W.table([W.ui("name"), W.ui("cost") + " (bn $)", W.ui("months"), "Max", W.p(G("Açıklama", "Description"))], M.buildings.map((b) => ({ id: "b_" + b.id, cells: [`<b>${W.esc(W.t(b.name))}</b>`, W.money(b.cost), b.months, b.max, W.esc(W.t(b.description))] })), { num: [1, 2, 3] })}`;
  }, G("tümen ekipman askerlik tank piyade topçu muharebe", "division equipment conscription tank infantry artillery combat"));

  // =============================================================================================
  page("navy", "war", "⚓", G("Donanma", "Navy"), (W) => {
    const N = W.D.naval;
    const tech = { carrier: "nav_carrier" };
    const T = Object.fromEntries(W.D.research.techs.map((x) => [x.id, x]));
    return `
    <h1>${W.p(G("Donanma", "Navy"))}</h1>
    <p class="lead">${W.p(G("Boğazları tut, deniz yollarını koru, gerekirse çıkarma yap.", "Hold the straits, protect sea lanes, project power ashore."))}</p>
    <p>${W.p(G(`Donanma ayrı bir sayfadan (<kbd>D</kbd>) yönetilir. Gemiler tersanelerde sırayla inşa edilir (en çok ${N.params.MAX_QUEUE} gemilik kuyruk); harita deniz bölgelerine ve stratejik boğazlara bölünmüştür.`, `The navy is managed from its own page (<kbd>D</kbd>). Ships are built one after another at shipyards (queue of up to ${N.params.MAX_QUEUE}); the map is divided into sea zones and strategic straits.`))}</p>
    ${W.h2("ships", W.p(G("Gemi sınıfları", "Ship classes")))}
    ${W.table([W.ui("name"), W.ui("cost") + " (bn $)", W.ui("months"), W.ui("attack"), W.ui("hp"), W.p(G("Filodaki pay", "Fleet share")), W.p(G("Teknoloji", "Tech"))], N.ships.map((s) => ({ id: "s_" + s.id, cells: [`<b>${W.esc(W.nm(s))}</b>`, W.money(s.cost), s.months, s.attack, s.hp, W.pct(s.share, 0), s.needs_tech && T[s.needs_tech] ? `<a href="#/research/${s.needs_tech}">${W.esc(W.nm(T[s.needs_tech]))}</a>` : "—"] })), { num: [1, 2, 3, 4, 5] })}
    ${W.h2("straits", W.p(G("Stratejik boğazlar", "Strategic straits")))}
    <p>${N.straits.map((s) => W.pill(W.t(s), true)).join(" ")}</p>
    <p>${W.p(G("Boğazlar ve kanallar deniz bölgelerini birbirine bağlar; kontrol eden taraf ticaret ve hareket üzerinde baskı kurar.", "Straits and canals link the sea zones; whoever controls them can pressure trade and movement."))}</p>
    ${W.h2("seas", W.p(G("Deniz bölgeleri", "Sea zones")))}
    <p>${N.seas.map((s) => W.pill(W.nm(s))).join(" ")}</p>`;
  }, G("gemi denizaltı uçak gemisi boğaz deniz", "ship submarine carrier strait sea"));

  // =============================================================================================
  page("air", "war", "✈", G("Hava kuvvetleri", "Air force"), (W) => {
    const A = W.D.air, w = W.D.military.airWing, M = A.missions;
    const heat = (v) => `<td class="heat" style="background:color-mix(in srgb,var(--accent) ${Math.round(Math.min(v, 1.5) / 1.5 * 55)}%,transparent)">${W.num(v, 2)}</td>`;
    return `
    <h1>${W.p(G("Hava kuvvetleri", "Air force"))}</h1>
    <p class="lead">${W.p(G("Hava üstünlüğü olmadan kara harekâtı pahalıya patlar.", "Land operations are costly without air superiority."))}</p>
    ${W.h2("wings", W.p(G("Hava filoları", "Air wings")))}
    ${li([
      W.p(G(`Bir <b>hava filosu</b> ${w.aircraft} uçak ve ${W.num(w.men)} personelden oluşur; menzili ${W.num(w.range_km)} km, eğitimi ${w.train_days} gündür.`, `One <b>air wing</b> has ${w.aircraft} aircraft and ${W.num(w.men)} personnel; its range is ${W.num(w.range_km)} km and training takes ${w.train_days} days.`)),
      W.p(G(`Her <b>hava üssü</b> seviyesi ${W.D.military.params.WINGS_PER_AIRBASE} filo barındırır (üs en çok 3 seviye).`, `Each <b>air base</b> level houses ${W.D.military.params.WINGS_PER_AIRBASE} wings (up to 3 levels).`)),
      W.p(G("Filolar bir <b>görev</b> ve bir <b>uçak türü</b> ile atanır; görev ve tür birlikte etkinliği belirler.", "Wings are assigned a <b>mission</b> and an <b>aircraft type</b>; together they set effectiveness.")),
    ])}
    <h3>${W.p(G("Uçak türleri", "Aircraft types"))}</h3>
    ${W.table([W.ui("name"), W.p(G("Menzil çarpanı", "Range ×")), W.p(G("Açıklama", "Description"))], A.types.map((x) => [`<b>${W.esc(W.nm(x))}</b>`, "×" + W.num(x.range, 2), W.esc(W.t(x.description))]), { num: [1] })}
    ${W.h2("missions", W.p(G("Görevler", "Missions")))}
    ${W.table([W.ui("name"), W.p(G("Kara desteği ağırlığı", "Ground-support weight")), W.p(G("Açıklama", "Description"))], M.map((x) => ({ id: "m_" + x.id, cells: [`<b>${W.esc(W.nm(x))}</b>`, W.num(x.ground_weight, 2), W.esc(W.t(x.description))] })), { num: [1] })}
    <h3>${W.p(G("Tür × görev etkinliği", "Type × mission effectiveness"))}</h3>
    <div class="tbl"><table class="matrix"><thead><tr><th></th>${M.map((m) => `<th>${W.esc(W.nm(m))}</th>`).join("")}</tr></thead><tbody>${A.types.map((ty) => `<tr><td><b>${W.esc(W.nm(ty))}</b></td>${M.map((m) => heat(ty.eff[m.id])).join("")}</tr>`).join("")}</tbody></table></div>
    ${W.note(W.p(G(`Stratejik bombalama en çok %${W.num(A.params.BOMB_CAP * 100)} hasar verir; bastırma ${W.pct(A.params.SUPPRESS_MAX, 0)}'e, hat kesme ${W.pct(A.params.INTERDICT_CAP, 0)}'e kadar çıkar. Entegre hava savunması teknolojisi %${W.num(A.params.AA_BONUS * 100)} koruma sağlar.`, `Strategic bombing can destroy up to ${W.num(A.params.BOMB_CAP * 100)}% of a target; suppression caps at ${W.pct(A.params.SUPPRESS_MAX, 0)} and interdiction at ${W.pct(A.params.INTERDICT_CAP, 0)}. The integrated air defense tech gives ${W.num(A.params.AA_BONUS * 100)}% protection.`)))}`;
  }, G("hava uçak filo bombardıman avcı görev", "air aircraft wing bomber fighter mission"));

  // =============================================================================================
  page("peace", "war", "☮", G("Teslim ve barış", "Surrender & peace"), (W) => {
    const Z = W.D.peace;
    return `
    <h1>${W.p(G("Teslim ve barış konferansı", "Surrender & peace conference"))}</h1>
    <p class="lead">${W.p(G("Savaş, ülkenin toprağı işgal edilince biter; kazananlar masaya oturur.", "A war ends when a country's land is occupied; the winners sit at the table."))}</p>
    ${W.h2("surrender", W.p(G("Teslim olma", "Capitulation")))}
    <p>${W.p(G(`Bir ülke topraklarının <b>%${W.num(Z.CAPITULATION_SHARE * 100)}</b>'ini ya da <b>başkentini</b> kaybedip %${W.num(Z.CAPITULATION_CAPITAL_SHARE * 100)} oranını <b>${Z.CAPITULATION_DAYS} gün</b> boyunca işgal altında tutarsa teslim olur.`, `A country surrenders if it loses <b>${W.num(Z.CAPITULATION_SHARE * 100)}%</b> of its land — or its <b>capital</b> together with ${W.num(Z.CAPITULATION_CAPITAL_SHARE * 100)}% — and stays occupied for <b>${Z.CAPITULATION_DAYS} days</b>.`))}</p>
    ${W.h2("conference", W.p(G("Konferans", "The conference")))}
    ${li([
      W.p(G("O ülkeyle savaşan <b>tüm ülkeler</b> masaya oturur. Her galibin bütçesi, işgal ettiği il sayısı × " + Z.BUDGET_FACTOR + " kadardır; bir eyaleti talep etmek içindeki il sayısı kadar bütçe harcar.", "<b>Every country</b> at war with it sits at the table. Each winner's budget is the number of provinces it occupies × " + Z.BUDGET_FACTOR + "; claiming a state spends as much budget as it has provinces.")),
      W.p(G(`Oyuncu galipse önce kendi taleplerini seçer (${Z.CONFERENCE_PLAYER_DAYS} gün süre; otomatik dağıtım da var); kalanı yapay zekâ galipler işgal paylarına göre bölüşür (${Z.CONFERENCE_AI_DAYS} gün). Talep edilmeyen eyaletler yenilen ülkede kalır; ülke en az bir eyaletle kalır.`, `If you are a winner you choose first (${Z.CONFERENCE_PLAYER_DAYS} days; auto-allocation is available); AI winners split the rest by their occupation shares (${Z.CONFERENCE_AI_DAYS} days). Unclaimed states stay with the loser, which always keeps at least one state.`)),
      W.p(G(`Ek şartlar (bütçeden harcamaz): <b>tazminat</b> (mağlubun hazinesinin %${W.num(Z.REPARATIONS_SHARE * 100)}'i) ve <b>silahsızlandırma</b> (birliklerin %${W.num(Z.DISARM_SHARE * 100)}'i). Yapay zekâ galipler tazminat ister.`, `Extra terms (free of budget): <b>reparations</b> (${W.num(Z.REPARATIONS_SHARE * 100)}% of the loser's treasury) and <b>disarmament</b> (${W.num(Z.DISARM_SHARE * 100)}% of its units). AI winners demand reparations.`)),
    ])}
    ${W.h2("after", W.p(G("Sonrası", "Aftermath")))}
    ${li([
      W.p(G(`Mağlubun istikrarı %${W.num(Z.LOSER_STABILITY_LOSS * 100)} düşer, galibinki %${W.num(Z.WINNER_STABILITY_GAIN * 100)} artar. Alınan eyaletler ${Z.DIGEST_DAYS} gün boyunca galibin istikrarını düşürür (<b>sindirme</b>).`, `The loser's stability falls ${W.num(Z.LOSER_STABILITY_LOSS * 100)}% and the winner's rises ${W.num(Z.WINNER_STABILITY_GAIN * 100)}%. Taken states weigh on the winner's stability for ${Z.DIGEST_DAYS} days (<b>digestion</b>).`)),
      W.p(G(`${Z.WEARINESS_START_DAYS} günden uzun süren savaşta iki tarafın istikrarı günlük düşer (<b>savaş yorgunluğu</b>); istikrar hiçbir zaman %${W.num(Z.STABILITY_FLOOR * 100)}'in altına inmez.`, `In wars lasting longer than ${Z.WEARINESS_START_DAYS} days, both sides lose stability daily (<b>war weariness</b>); stability never drops below ${W.num(Z.STABILITY_FLOOR * 100)}%.`)),
      W.p(G("Konferans sonrası galipte <code>peace_winner</code>, mağlupta <code>peace_loser</code> bayrağı kalır; olaylar bunları kullanır.", "After the conference winners carry the <code>peace_winner</code> flag and losers <code>peace_loser</code>; events can react to them.")),
    ])}`;
  }, G("teslim barış konferans işgal tazminat silahsızlandırma", "surrender peace conference occupation reparations disarmament"));

  // =============================================================================================
  page("diplomacy", "world", "✉", G("Diplomasi", "Diplomacy"), (W) => {
    const Dp = W.D.diplomacy, pr = Dp.params;
    const lines = [
      ["IMPROVE_COOLDOWN_DAYS", G("İlişkiyi iyileştirme bekleme süresi", "Improve-relations cooldown"), "days"],
      ["WORSEN_COOLDOWN_DAYS", G("İlişkiyi bozma bekleme süresi", "Worsen-relations cooldown"), "days"],
      ["REJECT_COOLDOWN_DAYS", G("Reddedilen teklif sonrası bekleme", "Wait after a rejected offer"), "days"],
      ["ULTIMATUM_COOLDOWN_DAYS", G("Ültimatom bekleme süresi", "Ultimatum cooldown"), "days"],
      ["CASUS_BELLI_DAYS", G("Savaş gerekçesi (casus belli) geçerlilik süresi", "Casus belli validity"), "days"],
      ["OFFER_DAYS", G("Teklifin geçerlilik süresi", "Offer validity"), "days"],
      ["CALL_TO_ARMS_DAYS", G("Silaha çağrıya cevap süresi", "Call-to-arms response time"), "days"],
      ["MIN_WAR_DAYS_FOR_CEASEFIRE", G("Ateşkes için en az savaş süresi", "Minimum war length before ceasefire"), "days"],
    ];
    return `
    <h1>${W.p(G("Diplomasi", "Diplomacy"))}</h1>
    <p class="lead">${W.p(G("İlişkiler, güven, gerilim ve itibar; anlaşmalar bunları hem yansıtır hem değiştirir.", "Opinion, trust, tension and reputation: treaties both reflect and reshape them."))}</p>
    ${W.shot("06_diplomasi.png", G("Diplomasi paneli: itibar, yürürlükteki anlaşmalar ve son olaylar.", "Diplomacy panel: reputation, active treaties and recent events."))}
    ${W.h2("concepts", W.p(G("Temel kavramlar", "Core concepts")))}
    ${li([
      W.p(G(`<b>İlişki</b> (${pr.OPINION_MIN} ile +${pr.OPINION_MAX}), <b>güven</b> ve <b>gerilim</b> iki ülke arasında tutulur; zamanla sıfıra doğru sönümlenirler. Savaş ilişkiyi kalıcı biçimde çöker (taban ${Dp.params.BASE_WAR}).`, `<b>Opinion</b> (${pr.OPINION_MIN} to +${pr.OPINION_MAX}), <b>trust</b> and <b>tension</b> are tracked between every pair of countries and decay toward neutral. War crushes opinion (baseline ${Dp.params.BASE_WAR}).`)),
      W.p(G("<b>İtibar</b> (güvenilirlik) herkese karşı tek bir değerdir (0–100). Anlaşmayı bozmak, müttefiki terk etmek veya savunma çağrısını yanıtsız bırakmak itibarı düşürür; zamanla yavaşça toparlanır.", "<b>Reputation</b> (reliability) is a single 0–100 value toward everyone. Breaking treaties, abandoning allies or ignoring a call to arms lowers it; it recovers slowly.")),
      W.p(G("Aynı blokta olmak (+" + pr.BASE_SAME_BLOC + "), anlaşmalar, garantörlük ve yaptırımlar ilişkinin tabanını belirler.", "Being in the same bloc (+" + pr.BASE_SAME_BLOC + "), treaties, guarantees and sanctions set the baseline of opinion.")),
    ])}
    ${W.h2("treaties", W.p(G("Anlaşma türleri", "Treaty types")))}
    ${W.table([W.ui("name"), W.ui("duration"), W.p(G("İlişkiye katkı", "Opinion bonus")), W.ui("obligation"), W.ui("breach")], Dp.treaties.map((x) => ({ id: "t_" + x.id, cells: [`<b>${W.esc(W.t(x.name))}</b><br>${W.pill(x.directed ? W.ui("directed") : W.ui("mutual"))} ${x.proposable ? W.pill(W.ui("proposable"), true) : ""}<br><small>${W.esc(W.t(x.summary))}</small>`, x.months ? x.months + " " + W.ui("months_s") : W.ui("unlimited"), Dp.baseByTreaty[x.id] != null ? (Dp.baseByTreaty[x.id] > 0 ? "+" : "") + Dp.baseByTreaty[x.id] : "—", W.esc(W.t(x.obligation)), `${W.esc(W.t(x.breach))}${Dp.repBreach[x.id] ? `<br><small>${W.p(G("İtibar kaybı", "Reputation loss"))}: −${Dp.repBreach[x.id]}</small>` : ""}`] })))}
    ${W.h2("cooldowns", W.p(G("Süreler", "Timings")))}
    ${W.table([W.p(G("Kural", "Rule")), W.p(G("Süre", "Time"))], lines.map(([k, n]) => [W.esc(W.p(n)), `${pr[k]} ${W.p(G("gün", "days"))}`]), { num: [1] })}`;
  }, G("anlaşma ittifak itibar ilişki ültimatom casus belli", "treaty alliance reputation opinion ultimatum casus belli"));

  // =============================================================================================
  page("events", "world", "!", G("Olaylar", "Events"), (W) => {
    const E = W.D.events;
    const rows = E.map((e) => {
      const title = W.lang === "tr" ? e.title : e.en_title || W.t(e.title);
      const text = W.lang === "tr" ? e.text : e.en_text || W.t(e.text);
      const scope = e.scope === "world" ? W.ui("world") : e.scope === "any" ? W.ui("any") : e.scope;
      const opts = e.options.map((o) => `<li>${W.esc(W.lang === "tr" ? o.label : o.en || W.t(o.label))}</li>`).join("");
      return {
        key: title + " " + e.title + " " + e.en_title + " " + scope,
        sortv: [title, scope],
        cells: [`<details class="ev" id="ev_${e.id}" style="margin:0;border:0;background:none"><summary style="padding:0;border:0"><span>${W.esc(title)}</span></summary><div class="body" style="padding:8px 0 0"><p>${W.esc(text.replace("{country}", "…"))}</p><ul>${opts}</ul></div></details>`, W.pill(scope)],
      };
    });
    return `
    <h1>${W.p(G("Olaylar", "Events"))}</h1>
    <p class="lead">${W.p(G(`Oyunda ${E.length} olay var; hepsi data/events klasöründeki JSON dosyalarından okunur ve modlanabilir.`, `The game ships with ${E.length} events, all read from JSON files in data/events and fully moddable.`))}</p>
    ${W.h2("kinds", W.p(G("Üç tür olay", "Three kinds of events")))}
    ${W.table([W.p(G("Tür", "Kind")), W.p(G("Kime gelir?", "Who gets it?"))], [
      [`<b>${W.p(G("Ülkeye özel", "Country-specific"))}</b>`, W.p(G("Yalnızca belirtilen ülke(ler)e (ör. TUR: Marmara depremi).", "Only the listed country/countries (e.g. TUR: the Marmara earthquake)."))],
      [`<b>${W.p(G("Genel", "Generic"))}</b>`, W.p(G("Koşulları sağlayan her ülkeye (ör. borç krizi).", "Any country that meets the conditions (e.g. a debt crisis)."))],
      [`<b>${W.p(G("Dünya", "World"))}</b>`, W.p(G("Tüm dünyayı etkileyen olaylar.", "Events that affect the whole world."))],
    ])}
    <p>${W.p(G("Olaylar belirli aralıklarla (7 günde bir) koşullara göre kontrol edilir; varsayılan bekleme süresi 365 gündür. Her olayın seçenekleri farklı etkiler (hazine, istikrar, enflasyon beklentisi, bayraklar…) yaratır; yapay zekâ ülkeler seçenekleri ağırlıklarına göre seçer.", "Events are checked against their conditions every 7 days; the default cooldown is 365 days. Each option applies different effects (treasury, stability, inflation expectations, flags…); AI countries pick options by weight."))}</p>
    ${W.h2("list", W.p(G("Tüm olaylar", "All events")))}
    ${W.live("evlist", [W.p(G("Olay (tıkla: seçenekler)", "Event (click for options)")), W.ui("scope")], rows, { sort: 0, dir: 1, limit: 100 })}`;
  }, G("olay deprem kriz seçenek", "event earthquake crisis option"));

  // =============================================================================================
  page("countries", "world", "🌍", G("Ülkeler", "Countries"), (W) => {
    const rows = W.D.countries.map((c) => {
      const name = W.cname(c);
      return {
        key: name + " " + c.en + " " + c.tag + " " + (c.n || []).join(" "),
        sortv: [name, c.gdp, c.gdppc, c.pop, c.mil, c.growth, c.infl],
        cells: [`<span id="c_${c.tag}">${W.flag(c)}<b>${W.esc(name)}</b> <small>${c.tag}</small></span>`, W.compact(c.gdp, "$"), c.gdppc ? "$" + W.num(c.gdppc) : "—", W.compact(c.pop), c.mil ? W.num(c.mil) : "—", c.growth == null ? "—" : W.num(c.growth, 1) + "%", c.infl == null ? "—" : W.num(c.infl, 1) + "%"],
      };
    });
    return `
    <h1>${W.p(G("Ülkeler", "Countries"))}</h1>
    <p class="lead">${W.p(G(`${W.D.countries.length} ülkenin oyun başlangıcındaki verileri. Sütun başlığına tıklayarak sırala.`, `Starting data for ${W.D.countries.length} countries. Click a column header to sort.`))}</p>
    ${W.shot("07_dunya_gorunumu.png", G("Dünya görünümü: ülkeler renklerle ayrılır, eyalet sınırları görünür.", "World view: countries are color-coded and state borders are shown."))}
    ${W.live("cl", [W.ui("country"), W.ui("gdp"), W.ui("gdppc"), W.ui("pop"), W.ui("military"), W.ui("growth") + " (" + W.p(G("ort.", "avg.")) + ")", W.ui("infl")], rows, { sort: 1, dir: -1, num: [1, 2, 3, 4, 5, 6], limit: 300 })}
    ${W.note(W.p(G("Veriler Dünya Bankası, BM ve benzeri açık kaynaklardan derlenmiştir; bazı alanlar eksikse oyun tahmin kullanır. Bayraklar oyun dosyalarındandır.", "Data is compiled from World Bank, UN and similar open sources; where a field is missing the game uses estimates. Flags come from the game files.")))}`;
  }, G("ülke bayrak gsyih nüfus liste", "country flag gdp population list"));

  // =============================================================================================
  page("modding", "more", "🧩", G("Modlama", "Modding"), (W) => `
    <h1>${W.p(G("Modlama", "Modding"))}</h1>
    <p class="lead">${W.p(G("Modlar kod yazmadan, yalnızca JSON dosyalarıyla oyunun verisini değiştirir ya da genişletir.", "Mods change or extend the game's data with plain JSON files — no code required."))}</p>
    ${W.h2("install", W.p(G("Kurulum", "Installing")))}
    ${li([
      W.p(G("Ana menü → <b>Modlar</b> → <b>Mod klasörünü aç</b> (Windows'ta <code>%APPDATA%\\Godot\\app_userdata\\&lt;proje&gt;\\mods\\</code>).", "Main menu → <b>Mods</b> → <b>Open mod folder</b> (on Windows <code>%APPDATA%\\Godot\\app_userdata\\&lt;project&gt;\\mods\\</code>).")),
      W.p(G("Mod klasörünü <code>mods/&lt;mod_adı&gt;/</code> altına koy ve oyunu yeniden başlat. <b>Modlar</b> sayfasından modu açıp kapatabilirsin (yeniden başlatınca geçerli olur).", "Put the mod in <code>mods/&lt;mod_name&gt;/</code> and restart. Toggle it on the <b>Mods</b> page (takes effect after a restart).")),
      W.p(G("Bozuk mod yüzünden oyun açılmazsa <code>-- --no-mods</code> ile başlat; tüm modlar kapanır.", "If a broken mod stops the game from starting, launch with <code>-- --no-mods</code> to disable all mods.")),
    ])}
    ${W.h2("layout", W.p(G("Klasör yapısı", "Folder layout")))}
    <pre class="tbl" style="padding:14px 18px;margin:12px 0;overflow:auto"><code>mods/my_mod/
  mod.json          ${W.p(G("(isteğe bağlı) ad, sürüm, yapımcı, açıklama, öncelik", "(optional) name, version, author, description, priority"))}
  events/*.json     ${W.p(G("yeni / değiştirilmiş olaylar", "new / changed events"))}
  defs/&lt;file&gt;.json  ${W.p(G("data/defs üzerine yama: politikalar, birlikler, tesisler, anlaşmalar…", "patch over data/defs: policies, units, facilities, treaties…"))}
  db/&lt;file&gt;.json    ${W.p(G("data/db üzerine yama: ülke ekonomi / nüfus / askerî verisi, YZ kişilikleri", "patch over data/db: country economy / population / military data, AI personalities"))}
  lang/&lt;code&gt;.json ${W.p(G("çeviri eklemeleri: {\"Türkçe metin\": \"çeviri\"}", "translation additions: {\"Turkish text\": \"translation\"}"))}
  flags/&lt;TAG&gt;.png  ${W.p(G("bayrak değiştir / ekle", "replace / add a flag"))}</code></pre>
    ${W.h2("merge", W.p(G("Yamalar nasıl birleşir?", "How patches merge")))}
    ${li([
      W.p(G("Mod dosyası, oyunun aynı yoldaki dosyasının üzerine <b>derin birleştirilir</b>; yalnızca değiştirdiğin anahtarları yaz.", "A mod file is <b>deep-merged</b> over the game's file at the same path; write only the keys you change.")),
      W.p(G("Sözlükler özyinelemeli birleşir; sayılar, metinler ve <b>diziler</b> mod değeriyle değişir (diziler birleşmez).", "Dictionaries merge recursively; numbers, strings and <b>arrays</b> are replaced by the mod's value (arrays don't merge).")),
      W.p(G("Değeri <code>null</code> olan anahtar silinir.", "A key set to <code>null</code> is deleted.")),
      W.p(G("<code>priority</code> küçük olan önce yüklenir; sonra yüklenen önce yükleneni ezer.", "Lower <code>priority</code> loads first; later mods override earlier ones.")),
    ])}
    <p>${W.p(G("Örnek — <code>defs/diplomacy.json</code>:", "Example — <code>defs/diplomacy.json</code>:"))}</p>
    <pre class="tbl" style="padding:14px 18px"><code>{ "OPINION_DECAY": 0.06, "IMPROVE_COOLDOWN_DAYS": 30 }</code></pre>
    <p>${W.p(G("Örnek — <code>db/economy.json</code> (Türkiye'nin enflasyonu):", "Example — <code>db/economy.json</code> (Turkey's inflation):"))}</p>
    <pre class="tbl" style="padding:14px 18px"><code>{ "countries": { "TUR": { "inflation": 12.0 } } }</code></pre>
    ${W.h2("events", W.p(G("Olay ve çeviri", "Events and translations")))}
    ${li([
      W.p(G("Aynı <code>id</code>'li olay oyunun olayını <b>ezer</b>, yeni <code>id</code> yeni olay ekler. <code>_</code> ile başlayan dosyalar okunmaz.", "An event with an existing <code>id</code> <b>overrides</b> the game's event; a new <code>id</code> adds one. Files starting with <code>_</code> are ignored.")),
      W.p(G("Oyun metinleri Türkçe yazılır ve anahtar Türkçe metindir; <code>lang/en.json</code> içine <code>{\"Ulusal Festival\": \"National Festival\"}</code> gibi yazarak çevirirsin.", "Game text is authored in Turkish and the key is the Turkish string; translate with <code>lang/en.json</code> such as <code>{\"Ulusal Festival\": \"National Festival\"}</code>.")),
      W.p(G("Hatalı olay, etki ya da yama oyunu çökertmez; hatalı parça atlanır ve Modlar sayfasında dosya ve satırıyla uyarı gösterilir.", "A broken event, effect or patch never crashes the game; the bad part is skipped and the Mods page shows a warning with file and line.")),
    ])}
    ${W.tip(W.p(G("Her tanım dosyasındaki anahtarlar ve ne işe yaradıkları <code>data/defs/README.md</code> ve <code>data/events/README.md</code> dosyalarında anlatılır. Bu wikideki tüm tablolar o dosyalardan üretilir; bir modla değişen değerler oyunda geçerli olur.", "The keys of every definition file are documented in <code>data/defs/README.md</code> and <code>data/events/README.md</code>. Every table in this wiki is generated from those files; values changed by a mod apply in-game.")))}`
    , G("mod json yama klasör", "mod json patch folder"));

  window.WikiPages = P;
})();
