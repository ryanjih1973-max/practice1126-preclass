// Main Sangokushi III Strategy Engine, Map Canvas, Domestic/Diplomacy/Military Loops, and N5 Learning UI
window.RTK3 = window.RTK3 || {};

(function () {
  const { FACTIONS, CITIES_TEMPLATE, GENERALS_TEMPLATE, SCENARIOS, N5_VOCAB, N5_BY_ID, MONTH_JP, getSeasonByMonth, n5Tag, generateQuizQuestion, Audio, speakJP, renderPortraitSVG } = window.RTK3;

  const SAVE_KEY = 'rtk3_n5_save_v1';

  let game = null;
  let selectedCityId = null;
  let activeCmdTab = 'domestic';
  let n5Mastered = new Set();
  let n5Seen = new Set();

  // Load persisted N5 progress
  try {
    const savedN5 = JSON.parse(localStorage.getItem('rtk3_n5_progress') || '{}');
    if (Array.isArray(savedN5.mastered)) n5Mastered = new Set(savedN5.mastered);
    if (Array.isArray(savedN5.seen)) n5Seen = new Set(savedN5.seen);
  } catch (e) {}

  function saveN5Progress() {
    try {
      localStorage.setItem('rtk3_n5_progress', JSON.stringify({
        mastered: Array.from(n5Mastered),
        seen: Array.from(n5Seen)
      }));
    } catch (e) {}
  }

  function markN5Seen(ids) {
    if (!ids) return;
    ids.forEach(id => { if (N5_BY_ID[id]) n5Seen.add(id); });
    saveN5Progress();
  }

  // Expose quick quiz for battle module
  window.RTK3.openQuickQuiz = function (preferredIds, onResult) {
    openQuizModal(preferredIds, onResult);
  };

  // === Initialization & Scenario Selection ===
  function init() {
    renderScenarioScreen();
    setupGlobalN5Delegates();
  }

  function renderScenarioScreen() {
    document.getElementById('title-screen').classList.remove('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('victory-screen').classList.add('hidden');

    const scenList = document.getElementById('scenario-list');
    const rulerList = document.getElementById('ruler-list');
    let chosenScen = SCENARIOS[0];
    let chosenRuler = chosenScen.playableRulers[0];

    const hasSave = !!localStorage.getItem(SAVE_KEY);
    const loadBtn = document.getElementById('btn-continue-save');
    loadBtn.style.display = hasSave ? 'inline-flex' : 'none';
    loadBtn.onclick = () => {
      try {
        const raw = JSON.parse(localStorage.getItem(SAVE_KEY));
        if (raw && raw.cities) {
          game = raw;
          selectedCityId = game.cities.find(c => c.owner === game.playerFactionId)?.id || game.cities[0].id;
          enterMainGame();
          addLog('📂 已讀取上次的天下統一進度。');
        }
      } catch (e) {
        alert('存檔讀取失敗');
      }
    };

    function drawScenarios() {
      scenList.innerHTML = SCENARIOS.map(s => `
        <div class="scen-card ${s.id === chosenScen.id ? 'active' : ''}" data-scen="${s.id}">
          <div class="scen-year">${s.title}</div>
          <div class="scen-jp">${s.jpTitle}</div>
          <div class="scen-desc">${s.subtitle}</div>
          <div class="scen-diff">${s.difficultyInfo}</div>
        </div>
      `).join('');

      scenList.querySelectorAll('[data-scen]').forEach(el => {
        el.onclick = () => {
          Audio.click();
          chosenScen = SCENARIOS.find(s => s.id === el.dataset.scen);
          chosenRuler = chosenScen.playableRulers[0];
          drawScenarios();
          drawRulers();
        };
      });
    }

    function drawRulers() {
      rulerList.innerHTML = chosenScen.playableRulers.map(fid => {
        const fac = FACTIONS[fid];
        const rulerGenId = Object.entries(chosenScen.citySetup)
          .filter(([, setup]) => setup.owner === fid)
          .flatMap(([, setup]) => setup.gens)[0];
        const gen = GENERALS_TEMPLATE.find(g => g.id === rulerGenId) || GENERALS_TEMPLATE[0];
        const cityCount = Object.values(chosenScen.citySetup).filter(s => s.owner === fid).length;
        const totalTroops = Object.values(chosenScen.citySetup).filter(s => s.owner === fid).reduce((a, b) => a + b.troops, 0);

        return `
          <div class="ruler-card ${fid === chosenRuler ? 'active' : ''}" data-ruler="${fid}" style="border-left: 5px solid ${fac.color}">
            ${renderPortraitSVG(gen, 58)}
            <div class="ruler-info">
              <div class="ruler-name">${fac.name} <small>(${gen.kana})</small></div>
              <div class="ruler-stats">城池 ${cityCount} | 總兵力 ${totalTroops}</div>
              <div class="ruler-desc">${fac.desc}</div>
            </div>
          </div>
        `;
      }).join('');

      rulerList.querySelectorAll('[data-ruler]').forEach(el => {
        el.onclick = () => {
          Audio.click();
          chosenRuler = el.dataset.ruler;
          drawRulers();
        };
      });
    }

    document.getElementById('btn-start-game').onclick = () => {
      Audio.confirm();
      startNewGame(chosenScen, chosenRuler);
    };

    drawScenarios();
    drawRulers();
  }

  function pickMonthlyWordId(prevId = null) {
    const pool = N5_VOCAB.filter(w => w.id !== prevId);
    return pool[Math.floor(Math.random() * pool.length)].id;
  }

  function startNewGame(scenario, playerFactionId) {
    const generals = {};
    GENERALS_TEMPLATE.forEach(g => {
      generals[g.id] = {
        ...g,
        loyalty: 92,
        acted: false,
        troops: 0
      };
    });

    const cities = CITIES_TEMPLATE.map(ct => {
      const setup = scenario.citySetup[ct.id];
      const freeIds = (scenario.freeGenerals && scenario.freeGenerals[ct.id]) || [];
      return {
        ...ct,
        owner: setup ? setup.owner : null,
        gold: setup ? setup.gold : 900,
        food: setup ? setup.food : 1500,
        troops: setup ? setup.troops : 2200,
        pop: ct.basePop,
        dev: ct.baseDev,
        com: ct.baseCom,
        flood: 60,
        def: ct.baseDef,
        loyalty: 75,
        morale: 75,
        gens: setup ? [...setup.gens] : [],
        freeGens: [...freeIds]
      };
    });

    const firstWordId = pickMonthlyWordId();
    game = {
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      year: scenario.year,
      month: scenario.month,
      turn: 1,
      playerFactionId,
      cities,
      generals,
      alliances: {}, // key: sorted "f1|f2" -> remaining months
      n5BoostTurns: 0,
      n5QuizDoneTurn: false,
      monthlyWordId: firstWordId,
      logs: [
        `📜 ${scenario.title} 劇本開始！主公「${FACTIONS[playerFactionId].name}」立志統一天下！`,
        `📖 今月之言葉：${N5_BY_ID[firstWordId].kanji}（${N5_BY_ID[firstWordId].kana}）＝ ${N5_BY_ID[firstWordId].meaning}。`,
        `💡 提示：點擊任何有日文假名標註的按鈕或詞彙，可聽發音；「私塾測驗」答對可領取軍資金！`
      ]
    };

    selectedCityId = cities.find(c => c.owner === playerFactionId).id;
    markN5Seen(['nen', 'gatsu', 'haru', 'natsu', 'aki', 'fuyu', 'kuni', 'machi', 'okane', 'tabemono', 'shigoto', 'iku', 'miru', 'hanasu', 'yasumu', 'kotoba', 'benkyou', firstWordId]);
    enterMainGame();
  }

  function enterMainGame() {
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('victory-screen').classList.add('hidden');
    renderAll();
  }

  function saveGame() {
    if (!game) return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(game));
      Audio.confirm();
      addLog('💾 遊戲進度已儲存至本機瀏覽器。');
      renderLogs();
    } catch (e) {}
  }

  function addLog(msg) {
    if (!game) return;
    game.logs.unshift(`[${game.year}年${game.month}月] ${msg}`);
    if (game.logs.length > 50) game.logs.pop();
  }

  // === Helpers ===
  function getCity(id) {
    return game.cities.find(c => c.id === id);
  }

  function getFactionCities(fid) {
    return game.cities.filter(c => c.owner === fid);
  }

  function getAliveFactions() {
    const set = new Set();
    game.cities.forEach(c => { if (c.owner) set.add(c.owner); });
    return Array.from(set);
  }

  function allianceKey(f1, f2) {
    return [f1, f2].sort().join('|');
  }

  function isAllied(f1, f2) {
    if (!f1 || !f2 || f1 === f2) return false;
    return (game.alliances[allianceKey(f1, f2)] || 0) > 0;
  }

  function getReadyGenerals(city) {
    return city.gens.map(id => game.generals[id]).filter(g => g && !g.acted);
  }

  function getBestGeneral(city, stat) {
    const ready = getReadyGenerals(city);
    if (ready.length === 0) return null;
    return [...ready].sort((a, b) => b[stat] - a[stat])[0];
  }

  // === Top HUD & Global Controls ===
  function renderTopBar() {
    const mInfo = MONTH_JP[game.month - 1];
    const season = getSeasonByMonth(game.month);
    const pCities = getFactionCities(game.playerFactionId);
    const totalGold = pCities.reduce((s, c) => s + c.gold, 0);
    const totalFood = pCities.reduce((s, c) => s + c.food, 0);
    const totalTroops = pCities.reduce((s, c) => s + c.troops, 0);
    const fac = FACTIONS[game.playerFactionId];

    document.getElementById('hud-bar').innerHTML = `
      <div class="hud-left">
        <span class="faction-badge" style="background:${fac.color}">${fac.banner}</span>
        <div class="hud-title">
          <strong>${fac.name}軍</strong>
          <span class="hud-sub">${game.scenarioTitle}</span>
        </div>
        <div class="hud-pill" title="N5: 年 (ねん) / 月 (がつ)">
          📅 ${game.year}${n5Tag('nen', '', true)}
          <span class="n5-chip" data-n5="gatsu"><ruby>${mInfo.kanji}<rt>${mInfo.kana}</rt></ruby></span>
          (${n5Tag(season.n5Id, season.zh)})
        </div>
      </div>
      <div class="hud-center">
        <div class="hud-stat">${n5Tag('machi', '領城')} <strong>${pCities.length}/${game.cities.length}</strong></div>
        <div class="hud-stat">${n5Tag('okane', '總金')} <strong>${totalGold}</strong></div>
        <div class="hud-stat">${n5Tag('tabemono', '總糧')} <strong>${totalFood}</strong></div>
        <div class="hud-stat">${n5Tag('hito', '總兵')} <strong>${totalTroops}</strong></div>
        ${game.n5BoostTurns > 0 ? '<div class="bonus-pill">✨ N5 效率 +25%</div>' : ''}
      </div>
      <div class="hud-right">
        <button class="btn-rtk btn-sm btn-accent" id="btn-n5-quiz">🏫 私塾測驗 ${n5Tag('benkyou', '', true)} ${game.n5QuizDoneTurn ? '(練習)' : '(+軍資)'}</button>
        <button class="btn-rtk btn-sm" id="btn-n5-book">📖 N5圖鑑 (${n5Mastered.size}/${N5_VOCAB.length})</button>
        <button class="btn-rtk btn-sm" id="btn-save">💾 存檔 ${n5Tag('kaku', '', true)}</button>
        <button class="btn-rtk btn-sm" id="btn-mute">${Audio.isMuted() ? '🔇 靜音' : '🔊 音效'} ${n5Tag('oto', '', true)}</button>
        <button class="btn-rtk btn-sm" id="btn-restart">🏠 劇本</button>
      </div>
    `;

    document.getElementById('btn-n5-quiz').onclick = () => openShijukuModal();
    document.getElementById('btn-n5-book').onclick = () => openWordbookModal();
    document.getElementById('btn-save').onclick = saveGame;
    document.getElementById('btn-mute').onclick = () => { Audio.toggleMute(); renderTopBar(); };
    document.getElementById('btn-restart').onclick = () => {
      if (confirm('確定返回劇本選擇畫面？（未存檔進度將遺失）')) renderScenarioScreen();
    };
  }

  function renderMonthlyWordPanel() {
    const box = document.getElementById('monthly-word-panel');
    if (!box || !game) return;
    if (!game.monthlyWordId || !N5_BY_ID[game.monthlyWordId]) {
      game.monthlyWordId = pickMonthlyWordId();
    }
    const w = N5_BY_ID[game.monthlyWordId];
    const mInfo = MONTH_JP[game.month - 1];
    const isMastered = n5Mastered.has(w.id);

    box.innerHTML = `
      <div class="mw-head">
        <span class="mw-badge">📅 今月之言葉（${mInfo.kanji}・${n5Tag('kotoba', '', true)}）</span>
        <div class="mw-btns">
          <button class="btn-rtk btn-sm" id="btn-mw-speak">🔊 讀音</button>
          <button class="btn-rtk btn-sm" id="btn-mw-master">${isMastered ? '✅ 已熟記' : '⭐ 標記熟記'}</button>
          <button class="btn-rtk btn-sm" id="btn-mw-next" title="換一個單字">🔄 換詞</button>
        </div>
      </div>
      <div class="mw-main">
        <div class="mw-word">
          <ruby>${w.kanji}<rt>${w.kana}</rt></ruby>
          <span class="mw-romaji">(${w.romaji})</span>
        </div>
        <div class="mw-meaning">
          <strong>${w.meaning}</strong>
          <span class="mw-tag">${w.pos} · 介面：${w.uiTag}</span>
        </div>
      </div>
      <div class="mw-example">
        <span>例：${w.example} <small>（${w.exMean}）</small></span>
        <button class="btn-link" id="btn-mw-ex-speak" title="朗讀例句">🔊</button>
      </div>
    `;

    document.getElementById('btn-mw-speak').onclick = () => speakJP(w.kana);
    document.getElementById('btn-mw-ex-speak').onclick = () => speakJP(w.example);
    document.getElementById('btn-mw-master').onclick = () => {
      n5Mastered.add(w.id);
      n5Seen.add(w.id);
      saveN5Progress();
      Audio.chimeOk();
      renderMonthlyWordPanel();
      renderTopBar();
    };
    document.getElementById('btn-mw-next').onclick = () => {
      Audio.click();
      game.monthlyWordId = pickMonthlyWordId(w.id);
      markN5Seen([game.monthlyWordId]);
      renderMonthlyWordPanel();
    };
  }

  // === Canvas Map Rendering ===
  function renderMap() {
    const canvas = document.getElementById('china-map');
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Background parchment-dark antique map
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#1e2736');
    grad.addColorStop(1, '#141b26');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Subtle map grid lines
    ctx.strokeStyle = 'rgba(200, 168, 75, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 80; x < W; x += 80) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 80; y < H; y += 80) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Stylized Yellow River (黄河) & Yangtze River (長江)
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(62, 130, 185, 0.42)';
    ctx.lineWidth = 10;
    // Yellow River
    ctx.beginPath();
    ctx.moveTo(70, 140);
    ctx.quadraticCurveTo(210, 195, 290, 210);
    ctx.quadraticCurveTo(410, 215, 515, 195);
    ctx.quadraticCurveTo(640, 175, 780, 130);
    ctx.stroke();

    // Yangtze River
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(140, 520);
    ctx.quadraticCurveTo(320, 480, 465, 450);
    ctx.quadraticCurveTo(620, 430, 770, 395);
    ctx.quadraticCurveTo(860, 390, 945, 405);
    ctx.stroke();

    // Coastline / Sea on East
    ctx.fillStyle = 'rgba(30, 72, 112, 0.35)';
    ctx.beginPath();
    ctx.moveTo(860, 0);
    ctx.lineTo(1000, 0);
    ctx.lineTo(1000, 640);
    ctx.lineTo(790, 640);
    ctx.quadraticCurveTo(910, 510, 910, 390);
    ctx.quadraticCurveTo(840, 240, 770, 130);
    ctx.quadraticCurveTo(820, 60, 860, 0);
    ctx.fill();

    // Roads between cities
    const drawn = new Set();
    game.cities.forEach(c => {
      c.neighbors.forEach(nid => {
        const key = [c.id, nid].sort().join('-');
        if (drawn.has(key)) return;
        drawn.add(key);
        const nb = getCity(nid);
        if (!nb) return;
        ctx.strokeStyle = 'rgba(218, 185, 112, 0.38)';
        ctx.lineWidth = 3;
        ctx.setLineDash([7, 5]);
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    });

    // Highlight neighbors of selected city
    const selCity = getCity(selectedCityId);
    if (selCity) {
      selCity.neighbors.forEach(nid => {
        const nb = getCity(nid);
        ctx.strokeStyle = 'rgba(255, 215, 90, 0.65)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(selCity.x, selCity.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();
      });
    }

    // Draw cities
    game.cities.forEach(c => {
      const fac = c.owner ? FACTIONS[c.owner] : null;
      const color = fac ? fac.color : '#5a6270';
      const isSelected = c.id === selectedCityId;
      const isPlayer = c.owner === game.playerFactionId;

      if (isSelected) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, 26, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffd15c';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Castle square
      ctx.fillStyle = color;
      ctx.strokeStyle = isPlayer ? '#ffd15c' : '#d5d8e0';
      ctx.lineWidth = isPlayer ? 2.5 : 1.5;
      ctx.fillRect(c.x - 16, c.y - 16, 32, 32);
      ctx.strokeRect(c.x - 16, c.y - 16, 32, 32);

      // Faction banner char
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px "Noto Serif TC", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(fac ? fac.banner : '空', c.x, c.y + 1);

      // City label & troops
      ctx.fillStyle = 'rgba(12, 16, 24, 0.85)';
      ctx.fillRect(c.x - 38, c.y + 20, 76, 30);
      ctx.strokeStyle = 'rgba(200, 168, 75, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(c.x - 38, c.y + 20, 76, 30);

      ctx.fillStyle = isSelected ? '#ffd15c' : '#f2ede2';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(c.name, c.x, c.y + 29);

      ctx.fillStyle = '#a8d5ff';
      ctx.font = '10px monospace';
      ctx.fillText(`兵${c.troops}`, c.x, c.y + 42);
    });
  }

  function setupMapClick() {
    const canvas = document.getElementById('china-map');
    canvas.onclick = (e) => {
      if (!game) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      let hit = null;
      let bestD = 34;
      game.cities.forEach(c => {
        const d = Math.hypot(c.x - mx, c.y - my);
        if (d < bestD) {
          bestD = d;
          hit = c;
        }
      });
      if (hit) {
        Audio.click();
        selectedCityId = hit.id;
        renderAll();
      }
    };
  }

  // === City Inspector & Command Panel ===
  function renderCityPanel() {
    const city = getCity(selectedCityId);
    if (!city) return;
    const fac = city.owner ? FACTIONS[city.owner] : null;
    const isPlayer = city.owner === game.playerFactionId;
    const allied = isAllied(city.owner, game.playerFactionId);

    const readyCount = getReadyGenerals(city).length;
    const ownerTag = fac
      ? `<span class="owner-pill" style="background:${fac.color}">${fac.name}${isPlayer ? '（我軍）' : allied ? '（同盟）' : '（敵軍）'}</span>`
      : `<span class="owner-pill" style="background:#555">空白城池</span>`;

    const cityGens = city.gens.map(id => game.generals[id]).filter(Boolean);

    document.getElementById('city-panel').innerHTML = `
      <div class="city-head">
        <div>
          <h3>${city.name} <small>(${city.kana})</small></h3>
          <div class="city-sub">${city.terrain} · ${ownerTag}</div>
        </div>
        <div class="ready-badge">${isPlayer ? `可行動將領：${readyCount}/${cityGens.length}` : '他國都市'}</div>
      </div>

      <div class="city-stats-grid">
        <div class="stat-box">${n5Tag('okane', '金')}<span>${city.gold}</span></div>
        <div class="stat-box">${n5Tag('tabemono', '糧')}<span>${city.food}</span></div>
        <div class="stat-box">${n5Tag('hito', '兵力')}<span>${city.troops}</span></div>
        <div class="stat-box">${n5Tag('ooi', '人口')}<span>${(city.pop / 10000).toFixed(1)}万</span></div>
        <div class="stat-box">${n5Tag('tsukuru', '開墾')}<span>${city.dev}</span></div>
        <div class="stat-box">${n5Tag('mise', '商業')}<span>${city.com}</span></div>
        <div class="stat-box">${n5Tag('kawa', '治水')}<span>${city.flood}</span></div>
        <div class="stat-box">${n5Tag(city.def >= 65 ? 'takai' : 'hikui', '城防')}<span>${city.def}</span></div>
        <div class="stat-box">${n5Tag(city.loyalty >= 65 ? 'ii' : 'abunai', '民忠')}<span>${city.loyalty}</span></div>
        <div class="stat-box">${n5Tag(city.morale >= 70 ? 'tsuyoi' : 'yowai', '士氣')}<span>${city.morale}</span></div>
      </div>

      <div class="section-label">${n5Tag('namae', '駐守武將')} (${cityGens.length}) ${city.freeGens.length > 0 && isPlayer ? `<span class="free-hint">· 在野可探索</span>` : ''}</div>
      <div class="gen-list">
        ${cityGens.length === 0 ? '<div class="empty-note">城中無武將</div>' : cityGens.map(g => `
          <div class="gen-row ${g.acted ? 'gen-acted' : ''}">
            ${renderPortraitSVG(g, 38)}
            <div class="gen-meta">
              <div class="gen-name">${g.name} <small>${g.kana}</small> ${g.acted ? '<span class="tag-done">已動</span>' : '<span class="tag-ready">待命</span>'}</div>
              <div class="gen-nums">陸${g.land} 水${g.naval} 武${g.war} 知${g.int} 政${g.pol} 魅${g.charm}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderCommandPanel() {
    const city = getCity(selectedCityId);
    const isPlayer = city && city.owner === game.playerFactionId;
    const readyGens = isPlayer ? getReadyGenerals(city) : [];
    const hasReady = readyGens.length > 0;

    const tabsHtml = `
      <div class="cmd-tabs">
        <button class="cmd-tab ${activeCmdTab === 'domestic' ? 'active' : ''}" data-tab="domestic">🏛 內政 ${n5Tag('shigoto', '', true)}</button>
        <button class="cmd-tab ${activeCmdTab === 'military' ? 'active' : ''}" data-tab="military">⚔️ 軍事 ${n5Tag('iku', '', true)}</button>
        <button class="cmd-tab ${activeCmdTab === 'diplomacy' ? 'active' : ''}" data-tab="diplomacy">📜 人事外交 ${n5Tag('hanasu', '', true)}</button>
      </div>
    `;

    let bodyHtml = '';
    if (!isPlayer) {
      bodyHtml = `
        <div class="cmd-notice">
          目前選中的是「${city.name}」（非我軍城池）。請點選地圖上標有【${FACTIONS[game.playerFactionId].banner}】的我軍城池來下達指令，或從鄰近我軍城池發動「出征」。
        </div>
      `;
    } else if (activeCmdTab === 'domestic') {
      bodyHtml = `
        <div class="cmd-grid">
          <button class="btn-rtk" data-cmd="dev" ${hasReady ? '' : 'disabled'}>🌾 開墾（金100）${n5Tag('tsukuru', '', true)}</button>
          <button class="btn-rtk" data-cmd="com" ${hasReady ? '' : 'disabled'}>🪙 商業（金100）${n5Tag('mise', '', true)}</button>
          <button class="btn-rtk" data-cmd="flood" ${hasReady ? '' : 'disabled'}>🌊 治水（金100）${n5Tag('kawa', '', true)}</button>
          <button class="btn-rtk" data-cmd="def" ${hasReady ? '' : 'disabled'}>🧱 補修城牆（金100）${n5Tag('tatemono', '', true)}</button>
          <button class="btn-rtk" data-cmd="buyFood" ${hasReady ? '' : 'disabled'}>🍚 買糧（金150→糧320）${n5Tag('kau', '', true)}</button>
          <button class="btn-rtk" data-cmd="charity" ${hasReady ? '' : 'disabled'}>🎁 施捨民心（糧200）${n5Tag('ageru', '', true)}</button>
        </div>
      `;
    } else if (activeCmdTab === 'military') {
      bodyHtml = `
        <div class="cmd-grid">
          <button class="btn-rtk" data-cmd="draft" ${hasReady ? '' : 'disabled'}>🪖 徵兵（金200→兵800）${n5Tag('kau', '', true)}</button>
          <button class="btn-rtk" data-cmd="train" ${hasReady ? '' : 'disabled'}>🏋️ 訓練士氣（金80）${n5Tag('tsuyoi', '', true)}</button>
          <button class="btn-rtk btn-war" data-cmd="attack" ${hasReady && city.troops >= 800 ? '' : 'disabled'}>🚩 出征攻城 ${n5Tag('iku', '', true)}</button>
          <button class="btn-rtk" data-cmd="transport" ${hasReady ? '' : 'disabled'}>🐎 物資輸送 ${n5Tag('michi', '', true)}</button>
        </div>
      `;
    } else {
      bodyHtml = `
        <div class="cmd-grid">
          <button class="btn-rtk" data-cmd="search" ${hasReady ? '' : 'disabled'}>🔍 探索人才/財寶 ${n5Tag('miru', '', true)}</button>
          <button class="btn-rtk" data-cmd="recruit" ${hasReady ? '' : 'disabled'}>🤝 登用在野武將 ${n5Tag('hairu', '', true)}</button>
          <button class="btn-rtk" data-cmd="ally" ${hasReady ? '' : 'disabled'}>🕊 外交同盟（金300）${n5Tag('tomodachi', '', true)}</button>
          <button class="btn-rtk" data-cmd="spy" ${hasReady ? '' : 'disabled'}>👁 偵察鄰城（金80）${n5Tag('miru', '', true)}</button>
          <button class="btn-rtk btn-accent" data-cmd="shijuku" style="grid-column: span 2;">🏫 前往私塾測驗（答對贈軍資金！）${n5Tag('benkyou', '', true)}</button>
        </div>
      `;
    }

    document.getElementById('command-panel').innerHTML = `
      ${tabsHtml}
      <div class="cmd-body">${bodyHtml}</div>
      <div class="end-turn-wrap">
        <button class="btn-rtk btn-end-turn" id="btn-end-turn">🌙 結束本月回合 ${n5Tag('yasumu', '', true)} / ${n5Tag('owaru', '', true)}</button>
      </div>
    `;

    document.querySelectorAll('.cmd-tab').forEach(b => {
      b.onclick = () => {
        Audio.click();
        activeCmdTab = b.dataset.tab;
        renderCommandPanel();
      };
    });

    document.querySelectorAll('[data-cmd]').forEach(b => {
      b.onclick = () => executeCommand(b.dataset.cmd);
    });

    document.getElementById('btn-end-turn').onclick = endTurn;
  }

  // === Domestic, Military & Diplomacy Execution ===
  function executeCommand(cmd) {
    const city = getCity(selectedCityId);
    if (!city || city.owner !== game.playerFactionId) return;
    const boost = game.n5BoostTurns > 0 ? 1.25 : 1.0;

    if (cmd === 'dev' || cmd === 'com' || cmd === 'flood' || cmd === 'def') {
      if (city.gold < 100) return alert('軍資金不足 100！');
      const gen = getBestGeneral(city, cmd === 'def' ? 'war' : 'pol');
      if (!gen) return;
      gen.acted = true;
      city.gold -= 100;
      const statVal = cmd === 'def' ? gen.war : gen.pol;
      const gain = Math.round((4 + statVal / 16) * boost);
      if (cmd === 'dev') { city.dev = Math.min(100, city.dev + gain); addLog(`🌾 ${gen.name} 在 ${city.name} 開墾農田，開墾度 +${gain}（目前 ${city.dev}）。`); }
      if (cmd === 'com') { city.com = Math.min(100, city.com + gain); addLog(`🪙 ${gen.name} 振興 ${city.name} 商業，商業度 +${gain}（目前 ${city.com}）。`); }
      if (cmd === 'flood') { city.flood = Math.min(100, city.flood + gain); addLog(`🌊 ${gen.name} 修築 ${city.name} 堤防，治水 +${gain}（目前 ${city.flood}）。`); }
      if (cmd === 'def') { city.def = Math.min(100, city.def + gain); addLog(`🧱 ${gen.name} 加固 ${city.name} 城防，防禦 +${gain}（目前 ${city.def}）。`); }
      Audio.coin();
      renderAll();
    } else if (cmd === 'buyFood') {
      if (city.gold < 150) return alert('軍資金不足 150！');
      const gen = getBestGeneral(city, 'pol');
      gen.acted = true;
      city.gold -= 150;
      const foodGain = Math.round(320 * boost);
      city.food += foodGain;
      Audio.coin();
      addLog(`🍚 ${gen.name} 購入兵糧 ${foodGain} 石。`);
      renderAll();
    } else if (cmd === 'charity') {
      if (city.food < 200) return alert('兵糧不足 200！');
      const gen = getBestGeneral(city, 'charm');
      gen.acted = true;
      city.food -= 200;
      const loyGain = Math.round(10 * boost);
      city.loyalty = Math.min(100, city.loyalty + loyGain);
      Audio.confirm();
      addLog(`🎁 ${gen.name} 施捨糧食安撫百姓，${city.name} 民忠 +${loyGain}！`);
      renderAll();
    } else if (cmd === 'draft') {
      if (city.gold < 200) return alert('軍資金不足 200！');
      if (city.pop < 20000) return alert('城鎮人口過少，無法徵兵！');
      const gen = getBestGeneral(city, 'charm');
      gen.acted = true;
      city.gold -= 200;
      const troopsGain = Math.round((650 + gen.charm * 3) * boost);
      city.troops += troopsGain;
      city.pop = Math.max(15000, city.pop - troopsGain * 2);
      city.morale = Math.max(40, city.morale - 4);
      Audio.drum();
      addLog(`🪖 ${gen.name} 募集新兵 ${troopsGain} 人！`);
      renderAll();
    } else if (cmd === 'train') {
      if (city.gold < 80) return alert('軍資金不足 80！');
      const gen = getBestGeneral(city, 'war');
      gen.acted = true;
      city.gold -= 80;
      const moraleGain = Math.round((8 + gen.land / 18) * boost);
      city.morale = Math.min(100, city.morale + moraleGain);
      Audio.drum();
      addLog(`🏋️ ${gen.name} 操練軍隊，士氣提升 +${moraleGain}（目前 ${city.morale}）！`);
      renderAll();
    } else if (cmd === 'search') {
      const gen = getBestGeneral(city, 'int');
      gen.acted = true;
      if (city.freeGens.length > 0 && Math.random() < 0.72) {
        const foundId = city.freeGens[0];
        const foundGen = game.generals[foundId];
        Audio.chimeOk();
        addLog(`🔍 ${gen.name} 探訪民間，發現隱居名士「${foundGen.name}」（知${foundGen.int}/武${foundGen.war}）！可使用「登用」延攬。`);
      } else {
        const goldBonus = 120 + Math.floor(Math.random() * 140);
        city.gold += goldBonus;
        Audio.coin();
        addLog(`🔍 ${gen.name} 巡視地方，尋獲隱匿軍資 金 ${goldBonus}！`);
      }
      renderAll();
    } else if (cmd === 'recruit') {
      if (city.freeGens.length === 0) return alert('本城目前無在野武將可登用（可先「探索」或查看其他城池）。');
      const gen = getBestGeneral(city, 'charm');
      gen.acted = true;
      const targetId = city.freeGens[0];
      const target = game.generals[targetId];
      const chance = Math.min(0.95, (gen.charm + 25) / 115 * boost);
      if (Math.random() <= chance) {
        city.freeGens.shift();
        city.gens.push(targetId);
        target.acted = true;
        Audio.victory();
        addLog(`🤝 ${gen.name} 誠意邀請「${target.name}」加入我軍！`);
      } else {
        Audio.chimeBad();
        addLog(`😔 ${gen.name} 前往登用「${target.name}」，但對方暫未出仕。`);
      }
      renderAll();
    } else if (cmd === 'spy') {
      if (city.gold < 80) return alert('軍資金不足 80！');
      const targets = city.neighbors.map(getCity).filter(c => c.owner !== game.playerFactionId);
      if (targets.length === 0) return alert('鄰近無敵對城池。');
      const gen = getBestGeneral(city, 'int');
      gen.acted = true;
      city.gold -= 80;
      const info = targets.map(t => `${t.name}(兵${t.troops}/防${t.def}/將${t.gens.length})`).join('、');
      Audio.confirm();
      addLog(`👁 ${gen.name} 派出細作偵察鄰城：${info}`);
      renderAll();
    } else if (cmd === 'ally') {
      if (city.gold < 300) return alert('外交需要軍資金 300！');
      openTargetSelectModal('外交同盟（締結 6 個月停戰）', '選擇要派使者交涉的鄰近勢力：',
        getAliveFactions().filter(fid => fid !== game.playerFactionId && !isAllied(fid, game.playerFactionId))
          .map(fid => ({ id: fid, label: `${FACTIONS[fid].name}軍`, sub: `領城 ${getFactionCities(fid).length} 座` })),
        (fid) => {
          const gen = getBestGeneral(city, 'charm');
          gen.acted = true;
          city.gold -= 300;
          if (Math.random() < (gen.charm + 20) / 115) {
            game.alliances[allianceKey(game.playerFactionId, fid)] = 6;
            Audio.chimeOk();
            addLog(`🕊 ${gen.name} 出使成功，與 ${FACTIONS[fid].name} 締結 6 個月同盟！`);
          } else {
            Audio.chimeBad();
            addLog(`❌ ${FACTIONS[fid].name} 拒絕了我方的同盟提議。`);
          }
          renderAll();
        });
    } else if (cmd === 'transport') {
      const friendlies = city.neighbors.map(getCity).filter(c => c.owner === game.playerFactionId);
      if (friendlies.length === 0) return alert('鄰近沒有我軍城池可輸送物資！');
      openTargetSelectModal('物資輸送', `從 ${city.name} 輸送部分軍資至鄰近我軍城池：`,
        friendlies.map(f => ({ id: f.id, label: `${f.name}`, sub: `現有 兵${f.troops} 金${f.gold} 糧${f.food}` })),
        (targetId) => {
          const gen = getBestGeneral(city, 'pol');
          gen.acted = true;
          const dest = getCity(targetId);
          const sendGold = Math.floor(city.gold * 0.4);
          const sendFood = Math.floor(city.food * 0.4);
          const sendTroops = Math.floor(city.troops * 0.4);
          city.gold -= sendGold; dest.gold += sendGold;
          city.food -= sendFood; dest.food += sendFood;
          city.troops -= sendTroops; dest.troops += sendTroops;
          Audio.confirm();
          addLog(`🐎 ${gen.name} 將 金${sendGold}・糧${sendFood}・兵${sendTroops} 運抵 ${dest.name}！`);
          renderAll();
        });
    } else if (cmd === 'attack') {
      openAttackLaunchModal(city);
    } else if (cmd === 'shijuku') {
      openShijukuModal();
    }
  }

  function getDirN5(fromCity, toCity) {
    const dx = toCity.x - fromCity.x;
    const dy = toCity.y - fromCity.y;
    if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'higashi' : 'nishi';
    return dy > 0 ? 'minami' : 'kita';
  }

  function openAttackLaunchModal(fromCity) {
    const targets = fromCity.neighbors.map(getCity).filter(c => c.owner !== game.playerFactionId && !isAllied(fromCity.owner, c.owner));
    if (targets.length === 0) return alert('鄰近沒有可攻打的敵對或空白城池（若為同盟請待同盟期滿）。');
    const readyGens = getReadyGenerals(fromCity);
    if (readyGens.length === 0) return alert('城內沒有可出陣的待命武將！');

    const modal = document.getElementById('action-modal');
    modal.classList.remove('hidden');

    let chosenTargetId = targets[0].id;
    let chosenGenIds = readyGens.slice(0, Math.min(3, readyGens.length)).map(g => g.id);
    let sendTroops = Math.min(fromCity.troops - 300, Math.max(1000, Math.round(fromCity.troops * 0.75)));
    if (sendTroops < 500) sendTroops = fromCity.troops;

    function draw() {
      const target = getCity(chosenTargetId);
      const dirId = getDirN5(fromCity, target);
      modal.innerHTML = `
        <div class="modal-box panel-gold">
          <h3>🚩 出征編組 — 從 ${fromCity.name} 出發 ${n5Tag('iku', '', true)}</h3>
          <div class="form-sec">
            <label>1. 選擇進攻目標（方角：${n5Tag(dirId, N5_BY_ID[dirId].meaning)}）</label>
            <div class="target-pills">
              ${targets.map(t => {
                const dId = getDirN5(fromCity, t);
                const own = t.owner ? FACTIONS[t.owner].name : '空白城';
                return `<button class="btn-rtk ${t.id === chosenTargetId ? 'btn-accent' : ''}" data-tid="${t.id}">${t.name}（${own}·兵${t.troops}）${n5Tag(dId, '', true)}</button>`;
              }).join('')}
            </div>
          </div>
          <div class="form-sec">
            <label>2. 選擇出陣武將（最多 4 名）</label>
            <div class="gen-pick-list">
              ${readyGens.map(g => {
                const picked = chosenGenIds.includes(g.id);
                return `<label class="gen-pick ${picked ? 'picked' : ''}">
                  <input type="checkbox" value="${g.id}" ${picked ? 'checked' : ''}/>
                  <span>${g.name} (陸${g.land} 武${g.war} 知${g.int})</span>
                </label>`;
              }).join('')}
            </div>
          </div>
          <div class="form-sec">
            <label>3. 出陣兵力：<strong id="lbl-troops">${sendTroops}</strong> / 城內總兵 ${fromCity.troops}（留守 ${fromCity.troops - sendTroops}）</label>
            <input type="range" id="rng-troops" min="500" max="${fromCity.troops}" step="100" value="${sendTroops}" style="width:100%"/>
          </div>
          <div class="modal-actions">
            <button class="btn-rtk btn-war" id="btn-launch-battle">🥁 全軍出擊！</button>
            <button class="btn-rtk" id="btn-cancel-modal">取消</button>
          </div>
        </div>
      `;

      modal.querySelectorAll('[data-tid]').forEach(b => {
        b.onclick = () => { chosenTargetId = b.dataset.tid; draw(); };
      });
      modal.querySelectorAll('.gen-pick input').forEach(chk => {
        chk.onchange = () => {
          const val = chk.value;
          if (chk.checked) {
            if (chosenGenIds.length >= 4) { chk.checked = false; return; }
            chosenGenIds.push(val);
          } else {
            chosenGenIds = chosenGenIds.filter(x => x !== val);
          }
          draw();
        };
      });
      const rng = document.getElementById('rng-troops');
      rng.oninput = () => {
        sendTroops = parseInt(rng.value, 10);
        document.getElementById('lbl-troops').textContent = sendTroops;
      };
      document.getElementById('btn-cancel-modal').onclick = () => modal.classList.add('hidden');
      document.getElementById('btn-launch-battle').onclick = () => {
        if (chosenGenIds.length === 0) return alert('至少需指派一名武將！');
        if (fromCity.food < 300) return alert('兵糧不足 300，無法出征！');
        modal.classList.add('hidden');
        fromCity.food -= 300;
        fromCity.troops -= sendTroops;
        chosenGenIds.forEach(gid => { game.generals[gid].acted = true; });
        launchBattle(fromCity, getCity(chosenTargetId), chosenGenIds, sendTroops, true);
      };
    }
    draw();
  }

  function launchBattle(fromCity, toCity, atkGenIds, atkTroops, playerIsAtk) {
    Audio.drum();
    const perUnit = Math.floor(atkTroops / atkGenIds.length);
    const atkUnits = atkGenIds.map((id, i) => ({
      gen: game.generals[id],
      troops: i === 0 ? atkTroops - perUnit * (atkGenIds.length - 1) : perUnit,
      morale: fromCity.morale
    }));

    let defGenIds = [...toCity.gens];
    if (defGenIds.length === 0) {
      // Garrison commander for empty city
      defGenIds = ['garrison'];
    }
    const defUnits = defGenIds.slice(0, 4).map((id, i, arr) => {
      const gen = game.generals[id] || { id: 'garrison', name: `${toCity.name}守將`, kana: 'しゅしょう', land: 55, naval: 50, war: 56, int: 50, pol: 45, charm: 50, p: { skin: '#d8ab82', hair: '#222', beard: 'short', helm: 'iron', armor: '#666', bg: '#222' } };
      const share = Math.floor(toCity.troops / arr.length);
      return {
        gen,
        troops: i === 0 ? Math.max(300, toCity.troops - share * (arr.length - 1)) : Math.max(300, share),
        morale: toCity.morale
      };
    });

    const atkFaction = FACTIONS[fromCity.owner];
    const defFaction = toCity.owner ? FACTIONS[toCity.owner] : null;

    window.RTK3.Battle.start({
      city: toCity,
      cityDef: toCity.def,
      atkFaction,
      defFaction,
      atkUnits,
      defUnits,
      playerIsAtk,
      onN5Seen: markN5Seen,
      onComplete: (res) => {
        if (res.winnerSide === 'atk') {
          const oldOwner = toCity.owner;
          // Move attacking generals into captured city
          fromCity.gens = fromCity.gens.filter(id => !atkGenIds.includes(id));
          // Surviving defenders flee to another friendly city or become captured/free
          const otherFriendly = oldOwner ? getFactionCities(oldOwner).find(c => c.id !== toCity.id) : null;
          toCity.gens.forEach(dgid => {
            if (otherFriendly) {
              otherFriendly.gens.push(dgid);
            } else {
              toCity.freeGens.push(dgid);
            }
          });
          toCity.owner = fromCity.owner;
          toCity.gens = [...atkGenIds];
          toCity.troops = Math.max(400, res.atkSurviving);
          toCity.def = Math.max(30, toCity.def - 15);
          addLog(`🚩 ${atkFaction.name}軍 攻陷 ${toCity.name}！`);
          selectedCityId = toCity.id;
        } else {
          // Attackers retreat to fromCity with survivors
          fromCity.troops += res.atkSurviving;
          toCity.troops = Math.max(200, res.defSurviving);
          addLog(`🛡 ${toCity.name} 守軍成功擊退 ${atkFaction.name}軍！`);
        }
        checkVictoryOrDefeat();
        renderAll();
      }
    });
  }

  // === End Turn, Economy, Events & AI ===
  function endTurn() {
    if (!game) return;
    Audio.confirm();

    // Advance calendar
    game.month += 1;
    if (game.month > 12) {
      game.month = 1;
      game.year += 1;
    }
    game.turn += 1;
    game.n5BoostTurns = 0;
    game.n5QuizDoneTurn = false;
    game.monthlyWordId = pickMonthlyWordId(game.monthlyWordId);
    const mw = N5_BY_ID[game.monthlyWordId];
    if (mw) {
      markN5Seen([mw.id]);
      addLog(`📖 今月之言葉更新：${mw.kanji}（${mw.kana}）＝ ${mw.meaning}`);
    }

    // Reset all generals acted state
    Object.values(game.generals).forEach(g => { g.acted = false; });

    // Decay alliances
    Object.keys(game.alliances).forEach(k => {
      game.alliances[k] -= 1;
      if (game.alliances[k] <= 0) delete game.alliances[k];
    });

    // Monthly food upkeep & seasonal taxes/harvest
    const isTaxMonth = [1, 4, 7, 10].includes(game.month);
    const isHarvestMonth = game.month === 9 || game.month === 10;

    game.cities.forEach(c => {
      // Food consumption by troops
      const upkeep = Math.round(c.troops * 0.045);
      c.food = Math.max(0, c.food - upkeep);
      if (c.food === 0 && c.troops > 500) {
        c.troops = Math.max(500, Math.round(c.troops * 0.9));
        c.morale = Math.max(20, c.morale - 10);
        if (c.owner === game.playerFactionId) addLog(`⚠️ ${c.name} 兵糧耗盡（食べ物 少ない），士兵流失！`);
      }
      if (isTaxMonth && c.owner) {
        const tax = Math.round(80 + c.com * 4.5 + (c.pop / 10000) * 14);
        c.gold += tax;
      }
      if (isHarvestMonth && c.owner) {
        const crop = Math.round(250 + c.dev * 12 + c.flood * 4);
        c.food += crop;
      }
    });

    if (isTaxMonth) addLog(`💰 季稅結算完成（もらう），各城獲得商業稅收！`);
    if (isHarvestMonth) addLog(`🌾 秋收季節到來（秋 あき），各城收穫大量兵糧！`);

    // AI Turn Logic (sequential & clean)
    runAITurns();
  }

  function runAITurns() {
    const aiFactions = getAliveFactions().filter(fid => fid !== game.playerFactionId);
    let pendingPlayerDefense = null;

    aiFactions.forEach(fid => {
      const fCities = getFactionCities(fid);
      fCities.forEach(c => {
        // Domestic AI
        if (c.gold >= 160) {
          if (c.dev < 75 && Math.random() < 0.45) { c.gold -= 100; c.dev += 4; }
          else if (c.com < 75 && Math.random() < 0.45) { c.gold -= 100; c.com += 4; }
          else if (c.troops < 9000) { c.gold -= 150; c.troops += 550; }
        }
        if (c.food < 800 && c.gold >= 150) { c.gold -= 150; c.food += 300; }
        // Free general auto-recruit chance
        if (c.freeGens.length > 0 && Math.random() < 0.22) {
          const gid = c.freeGens.shift();
          c.gens.push(gid);
        }
      });

      // Offensive AI (limit 1 attack per turn globally so player isn't overwhelmed)
      if (!pendingPlayerDefense && Math.random() < 0.38) {
        for (const c of fCities) {
          if (c.troops < 5500 || c.gens.length < 2 || c.food < 600) continue;
          const targets = c.neighbors.map(getCity).filter(t => t.owner !== fid && !isAllied(fid, t.owner));
          const weakTarget = targets.find(t => c.troops > t.troops * 1.35);
          if (weakTarget) {
            const sendTroops = Math.round(c.troops * 0.65);
            const atkGens = c.gens.slice(0, Math.min(3, c.gens.length - 1));
            if (atkGens.length === 0) continue;
            c.troops -= sendTroops;
            c.food -= 300;

            if (weakTarget.owner === game.playerFactionId) {
              pendingPlayerDefense = { from: c, to: weakTarget, atkGens, sendTroops };
              break;
            } else {
              // AI vs AI quick resolve
              const atkScore = sendTroops * 1.05;
              const defScore = weakTarget.troops * (1 + weakTarget.def / 220);
              if (atkScore > defScore) {
                c.gens = c.gens.filter(id => !atkGens.includes(id));
                const oldOwner = weakTarget.owner;
                const retreat = oldOwner ? getFactionCities(oldOwner).find(x => x.id !== weakTarget.id) : null;
                weakTarget.gens.forEach(g => { if (retreat) retreat.gens.push(g); else weakTarget.freeGens.push(g); });
                weakTarget.owner = fid;
                weakTarget.gens = [...atkGens];
                weakTarget.troops = Math.round(sendTroops * 0.65);
                addLog(`⚔️ ${FACTIONS[fid].name}軍 攻克了 ${weakTarget.name}！`);
              } else {
                c.troops += Math.round(sendTroops * 0.35);
                weakTarget.troops = Math.max(400, Math.round(weakTarget.troops * 0.7));
              }
              break;
            }
          }
        }
      }
    });

    if (pendingPlayerDefense) {
      addLog(`🚨 緊急軍報！${FACTIONS[pendingPlayerDefense.from.owner].name}軍 從 ${pendingPlayerDefense.from.name} 進犯我軍 ${pendingPlayerDefense.to.name}！`);
      renderAll();
      setTimeout(() => {
        launchBattle(pendingPlayerDefense.from, pendingPlayerDefense.to, pendingPlayerDefense.atkGens, pendingPlayerDefense.sendTroops, false);
      }, 450);
    } else {
      checkVictoryOrDefeat();
      renderAll();
    }
  }

  function checkVictoryOrDefeat() {
    const pCities = getFactionCities(game.playerFactionId);
    if (pCities.length === game.cities.length) {
      showEndScreen(true);
    } else if (pCities.length === 0) {
      showEndScreen(false);
    }
  }

  function showEndScreen(isWin) {
    document.getElementById('game-screen').classList.add('hidden');
    const scr = document.getElementById('victory-screen');
    scr.classList.remove('hidden');
    Audio.victory();
    const fac = FACTIONS[game.playerFactionId];
    scr.innerHTML = `
      <div class="victory-card panel-gold">
        <h1>${isWin ? '🏆 天下統一（てんかとういつ）！' : '💀 霸業夢碎…'}</h1>
        <p class="vic-sub">
          ${isWin
            ? `西元 ${game.year} 年 ${game.month} 月，主公 <strong>${fac.name}</strong> 平定四海，終結亂世，統一天下！`
            : `西元 ${game.year} 年 ${game.month} 月，${fac.name}軍 失去所有城池，遺憾退出歷史舞台。`}
        </p>
        <div class="vic-stats">
          <div>經歷回合：${game.turn} 個月</div>
          <div>掌握 N5 詞彙：${n5Mastered.size} / ${N5_VOCAB.length}</div>
        </div>
        <button class="btn-rtk btn-accent" id="btn-vic-home">返回劇本畫面</button>
      </div>
    `;
    document.getElementById('btn-vic-home').onclick = renderScenarioScreen;
  }

  // === Helper Modals (Target Select, N5 Word Popover, N5 Wordbook, N5 Quiz) ===
  function openTargetSelectModal(title, desc, items, onPick) {
    const modal = document.getElementById('action-modal');
    modal.classList.remove('hidden');
    modal.innerHTML = `
      <div class="modal-box panel-gold">
        <h3>${title}</h3>
        <p>${desc}</p>
        <div class="pick-list">
          ${items.map(it => `
            <button class="btn-rtk pick-item" data-pick="${it.id}">
              <strong>${it.label}</strong> <small>${it.sub}</small>
            </button>
          `).join('')}
        </div>
        <div class="modal-actions"><button class="btn-rtk" id="btn-pick-cancel">取消</button></div>
      </div>
    `;
    modal.querySelectorAll('[data-pick]').forEach(b => {
      b.onclick = () => { modal.classList.add('hidden'); onPick(b.dataset.pick); };
    });
    document.getElementById('btn-pick-cancel').onclick = () => modal.classList.add('hidden');
  }

  function setupGlobalN5Delegates() {
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-n5]');
      if (!chip) return;
      const id = chip.dataset.n5;
      if (N5_BY_ID[id]) {
        e.stopPropagation();
        showN5Card(id);
      }
    });
  }

  function showN5Card(id) {
    const w = N5_BY_ID[id];
    if (!w) return;
    n5Seen.add(id);
    saveN5Progress();
    speakJP(w.kana);

    const card = document.getElementById('n5-toast-card');
    card.classList.remove('hidden');
    card.innerHTML = `
      <div class="n5-card-head">
        <span class="n5-badge">JLPT N5 · ${w.category}</span>
        <button class="btn-close-sm" id="btn-close-n5-card">✕</button>
      </div>
      <div class="n5-card-word">
        <span class="n5-big">${w.kanji}</span>
        <span class="n5-kana">【${w.kana}】 ${w.romaji}</span>
        <button class="btn-rtk btn-sm" id="btn-speak-word">🔊 發音</button>
      </div>
      <div class="n5-card-mean">意思：<strong>${w.meaning}</strong>（介面對應：${w.uiTag}）</div>
      <div class="n5-card-ex">
        <div>例句：${w.example} <button class="btn-link" id="btn-speak-ex">🔊</button></div>
        <div class="ex-zh">${w.exMean}</div>
      </div>
    `;
    document.getElementById('btn-close-n5-card').onclick = () => card.classList.add('hidden');
    document.getElementById('btn-speak-word').onclick = () => speakJP(w.kana);
    document.getElementById('btn-speak-ex').onclick = () => speakJP(w.example);
  }

  function openWordbookModal() {
    const modal = document.getElementById('action-modal');
    modal.classList.remove('hidden');
    const categories = ['全部', ...Array.from(new Set(N5_VOCAB.map(w => w.category)))];
    let currentCat = '全部';

    function drawBook() {
      const list = currentCat === '全部' ? N5_VOCAB : N5_VOCAB.filter(w => w.category === currentCat);
      modal.innerHTML = `
        <div class="modal-box modal-wide panel-gold">
          <div class="modal-head-row">
            <h3>📖 三國志 N5 介面詞彙圖鑑（已掌握 ${n5Mastered.size} / ${N5_VOCAB.length}）</h3>
            <button class="btn-rtk btn-sm" id="btn-book-close">關閉</button>
          </div>
          <div class="cat-tabs">
            ${categories.map(c => `<button class="btn-rtk btn-sm ${c === currentCat ? 'btn-accent' : ''}" data-cat="${c}">${c}</button>`).join('')}
          </div>
          <div class="wordbook-grid">
            ${list.map(w => `
              <div class="wb-item ${n5Mastered.has(w.id) ? 'mastered' : ''}">
                <div class="wb-top">
                  <strong>${w.kanji}</strong> <small>${w.kana} (${w.romaji})</small>
                  <button class="btn-link wb-spk" data-spk="${w.kana}">🔊</button>
                </div>
                <div class="wb-mean">${w.meaning} · <span class="wb-tag">${w.uiTag}</span></div>
                <div class="wb-ex">${w.example}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      modal.querySelectorAll('[data-cat]').forEach(b => {
        b.onclick = () => { currentCat = b.dataset.cat; drawBook(); };
      });
      modal.querySelectorAll('[data-spk]').forEach(b => {
        b.onclick = () => speakJP(b.dataset.spk);
      });
      document.getElementById('btn-book-close').onclick = () => modal.classList.add('hidden');
    }
    drawBook();
  }

  function openQuizModal(preferredIds, onResult) {
    const q = generateQuizQuestion(preferredIds);
    const modal = document.getElementById('action-modal');
    modal.classList.remove('hidden');
    speakJP(q.vocab.kana);

    modal.innerHTML = `
      <div class="modal-box panel-gold">
        <h3>🎓 軍師的日語 N5 問答</h3>
        <div class="quiz-prompt">${q.promptHtml} <button class="btn-rtk btn-sm" id="btn-quiz-spk">🔊 再聽一次</button></div>
        <div class="quiz-options">
          ${q.options.map(o => `<button class="btn-rtk quiz-opt" data-oid="${o.id}"><strong>${o.label}</strong> <small>${o.sub}</small></button>`).join('')}
        </div>
        <div id="quiz-feedback" class="quiz-feedback"></div>
      </div>
    `;

    document.getElementById('btn-quiz-spk').onclick = () => speakJP(q.vocab.kana);
    modal.querySelectorAll('.quiz-opt').forEach(btn => {
      btn.onclick = () => {
        const picked = btn.dataset.oid;
        const ok = picked === q.vocab.id;
        n5Seen.add(q.vocab.id);
        if (ok) {
          n5Mastered.add(q.vocab.id);
          Audio.chimeOk();
        } else {
          Audio.chimeBad();
        }
        saveN5Progress();

        const fb = document.getElementById('quiz-feedback');
        fb.innerHTML = ok
          ? `<div class="ok-msg">⭕ 答對了！「${q.vocab.kanji}（${q.vocab.kana}）」＝ ${q.vocab.meaning}！<br><small>${q.vocab.example}（${q.vocab.exMean}）</small></div>`
          : `<div class="bad-msg">❌ 可惜！正確答案是「${q.vocab.kanji}（${q.vocab.kana}）」＝ ${q.vocab.meaning}。<br><small>${q.vocab.example}（${q.vocab.exMean}）</small></div>`;

        setTimeout(() => {
          modal.classList.add('hidden');
          if (onResult) onResult(ok);
        }, 1250);
      };
    });
  }

  // === Shijuku (私塾) 3-Question Exam with Military Gold Reward ===
  function openShijukuModal() {
    const modal = document.getElementById('action-modal');
    modal.classList.remove('hidden');

    const isRewardRun = !game.n5QuizDoneTurn;
    const totalQ = 3;
    const rewardPerCorrect = 150;
    const perfectBonus = 200;
    const targetCity = (getCity(selectedCityId)?.owner === game.playerFactionId ? getCity(selectedCityId) : getFactionCities(game.playerFactionId)[0]);
    const preferred = [game.monthlyWordId, 'okane', 'tabemono', 'shigoto', 'tsukuru', 'kau', 'iku', 'miru', 'hanasu', 'yasumu', 'kotoba', 'benkyou', 'mise', 'tatemono'];

    let qIdx = 0;
    let correctCount = 0;
    let earnedGold = 0;
    let locked = false;
    let currentQ = generateQuizQuestion(preferred);

    function renderStep() {
      speakJP(currentQ.vocab.kana);
      modal.innerHTML = `
        <div class="modal-box panel-gold">
          <div class="modal-head-row">
            <h3>🏫 三國私塾（<ruby>勉強<rt>べんきょう</rt></ruby>）— 第 ${qIdx + 1} / ${totalQ} 題</h3>
            <span class="badge">${isRewardRun ? '💰 正式測驗（贈軍資金）' : '📝 自由練習模式'}</span>
          </div>
          <div class="shijuku-sub">
            ${isRewardRun
              ? `每答對 1 題贈送 <strong>${targetCity ? targetCity.name : ''}軍資金 金 +${rewardPerCorrect}</strong>，全對再加碼 <strong>金 +${perfectBonus} 與本回合內政效率 +25%</strong>！`
              : `本月軍資金獎勵已領取，此為自由練習（不另贈軍資）。`}
          </div>
          <div class="quiz-prompt">
            ${currentQ.promptHtml}
            <button class="btn-rtk btn-sm" id="btn-sj-spk">🔊 聽讀音</button>
          </div>
          <div class="quiz-options">
            ${currentQ.options.map(o => `<button class="btn-rtk quiz-opt" data-oid="${o.id}"><strong>${o.label}</strong> <small>${o.sub}</small></button>`).join('')}
          </div>
          <div id="sj-feedback" class="quiz-feedback"></div>
          <div class="modal-actions">
            <span class="sj-score">目前答對：${correctCount} 題${isRewardRun ? `（累計軍資 +${earnedGold}）` : ''}</span>
            <button class="btn-rtk btn-sm" id="btn-sj-close">暫時離開</button>
          </div>
        </div>
      `;

      document.getElementById('btn-sj-spk').onclick = () => speakJP(currentQ.vocab.kana);
      document.getElementById('btn-sj-close').onclick = () => modal.classList.add('hidden');

      modal.querySelectorAll('.quiz-opt').forEach(btn => {
        btn.onclick = () => {
          if (locked) return;
          locked = true;
          const ok = btn.dataset.oid === currentQ.vocab.id;
          n5Seen.add(currentQ.vocab.id);
          if (ok) {
            n5Mastered.add(currentQ.vocab.id);
            correctCount += 1;
            if (isRewardRun) earnedGold += rewardPerCorrect;
            Audio.chimeOk();
          } else {
            Audio.chimeBad();
          }
          saveN5Progress();

          const fb = document.getElementById('sj-feedback');
          fb.innerHTML = ok
            ? `<div class="ok-msg">⭕ 答對了！「${currentQ.vocab.kanji}（${currentQ.vocab.kana}）」＝ ${currentQ.vocab.meaning}${isRewardRun ? `（軍資金 +${rewardPerCorrect}！）` : ''}<br><small>${currentQ.vocab.example}（${currentQ.vocab.exMean}）</small></div>`
            : `<div class="bad-msg">❌ 可惜！正確答案是「${currentQ.vocab.kanji}（${currentQ.vocab.kana}）」＝ ${currentQ.vocab.meaning}。<br><small>${currentQ.vocab.example}（${currentQ.vocab.exMean}）</small></div>`;

          setTimeout(() => {
            qIdx += 1;
            if (qIdx < totalQ) {
              locked = false;
              currentQ = generateQuizQuestion();
              renderStep();
            } else {
              finishShijuku();
            }
          }, 1150);
        };
      });
    }

    function finishShijuku() {
      let totalReward = earnedGold;
      let bonusText = '';
      if (isRewardRun) {
        game.n5QuizDoneTurn = true;
        if (correctCount === totalQ) {
          totalReward += perfectBonus;
          game.n5BoostTurns = 1;
          bonusText = '🎊 滿分全對！額外獲得 金 +200 與本回合內政效率 +25%！';
        }
        if (targetCity && totalReward > 0) {
          targetCity.gold += totalReward;
          Audio.coin();
          addLog(`🏫 私塾測驗答對 ${correctCount}/${totalQ} 題，獲得軍資金 金 ${totalReward} 撥入 ${targetCity.name}！`);
        } else {
          addLog(`🏫 私塾測驗結束（答對 ${correctCount}/${totalQ} 題）。`);
        }
      }

      modal.innerHTML = `
        <div class="modal-box panel-gold" style="text-align:center;">
          <h3>🏫 私塾結業成績單</h3>
          <div style="font-size:22px; color:#ffe39c; margin:10px 0;">答對 ${correctCount} / ${totalQ} 題</div>
          ${isRewardRun
            ? `<div style="font-size:15px; color:#84f5b2; margin-bottom:8px;">撥付軍資金（<ruby>お金<rt>おかね</rt></ruby>）：<strong>+${totalReward} 金</strong>（入庫：${targetCity ? targetCity.name : '-'}）</div>`
            : `<div style="color:#aeb9cc; margin-bottom:8px;">自由練習完成！已累積掌握 ${n5Mastered.size} / ${N5_VOCAB.length} 個 N5 詞彙。</div>`}
          ${bonusText ? `<div class="ok-msg" style="margin-bottom:10px;">${bonusText}</div>` : ''}
          <button class="btn-rtk btn-accent" id="btn-sj-done">返回軍政</button>
        </div>
      `;
      document.getElementById('btn-sj-done').onclick = () => {
        modal.classList.add('hidden');
        renderAll();
      };
    }

    renderStep();
  }

  function renderLogs() {
    const box = document.getElementById('strategy-log');
    if (!box || !game) return;
    box.innerHTML = game.logs.map(l => `<div class="log-line">${l}</div>`).join('');
  }

  function renderAll() {
    if (!game) return;
    renderTopBar();
    renderMap();
    renderMonthlyWordPanel();
    renderCityPanel();
    renderCommandPanel();
    renderLogs();
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupMapClick();
    init();
  });
})();
