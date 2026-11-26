// Sangokushi III Style Tactical Grid Battle Engine
window.RTK3 = window.RTK3 || {};

window.RTK3.Battle = (function () {
  const COLS = 10;
  const ROWS = 7;

  const TERRAIN = {
    plain:  { id: 'plain',  name: '平地', n5Id: 'michi', cost: 1, def: 0,    fireBonus: 1.0, symbol: '·' },
    forest: { id: 'forest', name: '森林', n5Id: 'mori',  cost: 2, def: 0.22, fireBonus: 1.4, symbol: '♣' },
    hill:   { id: 'hill',   name: '山地', n5Id: 'yama',  cost: 2, def: 0.30, fireBonus: 0.9, symbol: '▲' },
    river:  { id: 'river',  name: '河川', n5Id: 'kawa',  cost: 3, def: -0.1, fireBonus: 0.3, symbol: '≈' },
    gate:   { id: 'gate',   name: '城門', n5Id: 'soto',  cost: 1, def: 0.35, fireBonus: 1.0, symbol: '⛩' },
    castle: { id: 'castle', name: '本陣', n5Id: 'naka',  cost: 1, def: 0.40, fireBonus: 0.8, symbol: '🏯' }
  };

  const WEATHERS = [
    { id: 'hare', name: '晴', n5Id: 'hare', fireMult: 1.0 },
    { id: 'kaze', name: '強風', n5Id: 'kaze', fireMult: 1.45 },
    { id: 'ame',  name: '雨', n5Id: 'ame',  fireMult: 0.35 }
  ];

  let state = null;
  let onCompleteCb = null;
  let onN5SeenCb = null;

  function generateMap(city) {
    const map = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        row.push('plain');
      }
      map.push(row);
    }

    // Castle & Gates on east/right side (cols 8-9)
    map[3][9] = 'castle';
    map[2][8] = 'gate';
    map[4][8] = 'gate';
    map[3][8] = 'plain';
    map[1][8] = 'hill';
    map[5][8] = 'hill';

    // Midfield procedural terrain based on city region
    const isWater = city.region === 'east' || city.region === 'south';
    const isMountain = city.region === 'west';

    for (let r = 0; r < ROWS; r++) {
      for (let c = 2; c <= 7; c++) {
        const roll = Math.random();
        if (isWater && c === 4 && r >= 1 && r <= 5 && r !== 3) {
          map[r][c] = 'river';
        } else if (isMountain && roll < 0.28) {
          map[r][c] = 'hill';
        } else if (roll < 0.16) {
          map[r][c] = 'forest';
        } else if (roll < 0.25) {
          map[r][c] = 'hill';
        } else if (roll < 0.31 && c >= 3 && c <= 6 && r !== 3) {
          map[r][c] = 'river';
        }
      }
    }
    // Ensure clear approach paths
    map[3][0] = 'plain';
    map[3][1] = 'plain';
    map[3][4] = 'plain';
    return map;
  }

  function start(opts) {
    // opts: { city, atkFaction, defFaction, atkUnits, defUnits, playerIsAtk, cityDef, onComplete, onN5Seen }
    onCompleteCb = opts.onComplete;
    onN5SeenCb = opts.onN5Seen;
    const weather = WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
    const map = generateMap(opts.city);

    const units = [];
    opts.atkUnits.forEach((u, idx) => {
      const row = [3, 1, 5, 2, 4][idx % 5];
      const col = idx < 3 ? 0 : 1;
      units.push({
        uid: 'atk_' + u.gen.id,
        side: 'atk',
        isPlayer: opts.playerIsAtk,
        gen: u.gen,
        troops: u.troops,
        maxTroops: u.troops,
        morale: u.morale || 80,
        move: u.gen.war >= 85 ? 4 : 3,
        r: row,
        c: col,
        acted: false,
        moved: false,
        fireUsed: 0
      });
    });

    opts.defUnits.forEach((u, idx) => {
      const spots = [
        [3, 9],
        [2, 8],
        [4, 8],
        [3, 7],
        [1, 7]
      ];
      const pos = spots[idx % spots.length];
      units.push({
        uid: 'def_' + u.gen.id,
        side: 'def',
        isPlayer: !opts.playerIsAtk,
        gen: u.gen,
        troops: u.troops,
        maxTroops: u.troops,
        morale: u.morale || 80,
        move: u.gen.war >= 85 ? 4 : 3,
        r: pos[0],
        c: pos[1],
        acted: false,
        moved: false,
        fireUsed: 0
      });
    });

    state = {
      city: opts.city,
      cityDef: opts.cityDef,
      atkFaction: opts.atkFaction,
      defFaction: opts.defFaction,
      playerIsAtk: opts.playerIsAtk,
      map,
      weather,
      turn: 1,
      maxTurns: 18,
      activeSide: 'atk', // atk moves first
      units,
      selectedUid: null,
      mode: 'idle', // 'idle' | 'move' | 'attack' | 'fire' | 'duel'
      reachable: [],
      attackTargets: [],
      logs: [`${opts.atkFaction.name}軍 攻向 ${opts.city.name}（${opts.defFaction ? opts.defFaction.name : '無主城'}）！天氣：${weather.name}`],
      n5QuizUsedThisBattle: false,
      n5BonusActive: false,
      over: false
    };

    if (onN5SeenCb) onN5SeenCb(['tenki', weather.n5Id, 'yama', 'kawa', 'mori', 'jikan']);
    openModal();
    startPhase('atk');
  }

  function openModal() {
    const modal = document.getElementById('battle-modal');
    modal.classList.remove('hidden');
    render();
  }

  function closeModal() {
    document.getElementById('battle-modal').classList.add('hidden');
  }

  function addLog(msg) {
    state.logs.unshift(msg);
    if (state.logs.length > 30) state.logs.pop();
  }

  function getAliveUnits(side) {
    return state.units.filter(u => u.troops > 0 && (!side || u.side === side));
  }

  function getUnitAt(r, c) {
    return state.units.find(u => u.troops > 0 && u.r === r && u.c === c);
  }

  function startPhase(side) {
    if (state.over) return;
    state.activeSide = side;
    state.selectedUid = null;
    state.mode = 'idle';
    state.reachable = [];
    state.attackTargets = [];

    getAliveUnits(side).forEach(u => {
      u.acted = false;
      u.moved = false;
    });

    const isPlayerTurn = (side === 'atk' && state.playerIsAtk) || (side === 'def' && !state.playerIsAtk);
    if (isPlayerTurn) {
      const first = getAliveUnits(side)[0];
      if (first) selectUnit(first.uid);
      render();
    } else {
      render();
      setTimeout(runAITurn, 380);
    }
  }

  function endPhase() {
    if (state.over) return;
    if (state.activeSide === 'atk') {
      startPhase('def');
    } else {
      state.turn += 1;
      if (state.turn > state.maxTurns) {
        finishBattle('def', '攻城日數耗盡，守軍成功固守城池！');
        return;
      }
      // Random small weather shift chance
      if (Math.random() < 0.2) {
        state.weather = WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
        addLog(`天氣變化為「${state.weather.name}」！`);
      }
      startPhase('atk');
    }
  }

  function computeReachable(unit) {
    const dist = Array.from({ length: ROWS }, () => Array(COLS).fill(Infinity));
    const queue = [{ r: unit.r, c: unit.c, cost: 0 }];
    dist[unit.r][unit.c] = 0;
    const res = [];

    while (queue.length > 0) {
      queue.sort((a, b) => a.cost - b.cost);
      const cur = queue.shift();
      if (cur.cost > dist[cur.r][cur.c]) continue;
      if (!(cur.r === unit.r && cur.c === unit.c) && !getUnitAt(cur.r, cur.c)) {
        res.push({ r: cur.r, c: cur.c });
      }
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of dirs) {
        const nr = cur.r + dr;
        const nc = cur.c + dc;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        const occ = getUnitAt(nr, nc);
        if (occ && occ.side !== unit.side) continue;
        const tId = state.map[nr][nc];
        let stepCost = TERRAIN[tId].cost;
        if (tId === 'river' && unit.gen.naval >= 80) stepCost = 1;
        const nCost = cur.cost + stepCost;
        if (nCost <= unit.move && nCost < dist[nr][nc]) {
          dist[nr][nc] = nCost;
          queue.push({ r: nr, c: nc, cost: nCost });
        }
      }
    }
    return res;
  }

  function findEnemiesInRange(unit, range) {
    return getAliveUnits(unit.side === 'atk' ? 'def' : 'atk').filter(e => {
      const d = Math.abs(e.r - unit.r) + Math.abs(e.c - unit.c);
      return d <= range;
    });
  }

  function selectUnit(uid) {
    const u = state.units.find(x => x.uid === uid && x.troops > 0);
    if (!u) return;
    state.selectedUid = uid;
    state.mode = 'idle';
    state.reachable = [];
    state.attackTargets = [];

    if (u.isPlayer && u.side === state.activeSide && !u.acted) {
      if (!u.moved) {
        state.mode = 'move';
        state.reachable = computeReachable(u);
      }
      state.attackTargets = findEnemiesInRange(u, 1);
    }
    render();
  }

  function performMove(unit, r, c) {
    unit.r = r;
    unit.c = c;
    unit.moved = true;
    window.RTK3.Audio.click();
    // Check if attacker captured the main castle!
    if (unit.side === 'atk' && state.map[r][c] === 'castle') {
      addLog(`🚩 ${unit.gen.name} 突入敵軍本陣！`);
      finishBattle('atk', `${unit.gen.name} 成功奪取本陣，攻陷 ${state.city.name}！`);
      return;
    }
    state.reachable = [];
    state.attackTargets = findEnemiesInRange(unit, 1);
    state.mode = state.attackTargets.length > 0 ? 'attack' : 'idle';
    render();
  }

  function performAttack(atk, def) {
    const defTerrain = TERRAIN[state.map[def.r][def.c]];
    const atkPower = (atk.gen.land * 0.6 + atk.gen.war * 0.4) * Math.sqrt(Math.max(200, atk.troops) / 1000);
    const defPower = (def.gen.land * 0.6 + def.gen.war * 0.4) * Math.sqrt(Math.max(200, def.troops) / 1000) * (1 + defTerrain.def);

    let mult = state.n5BonusActive && atk.isPlayer ? 1.25 : 1.0;
    if (atk.isPlayer) state.n5BonusActive = false;

    const dmgToDef = Math.round((280 + atkPower * 48) * mult * (0.85 + Math.random() * 0.3) / (1 + defTerrain.def * 0.5));
    const counterDmg = Math.round((130 + defPower * 22) * (0.8 + Math.random() * 0.3));

    def.troops = Math.max(0, def.troops - dmgToDef);
    atk.troops = Math.max(0, atk.troops - counterDmg);
    atk.acted = true;
    atk.moved = true;

    window.RTK3.Audio.clash();
    addLog(`⚔️ ${atk.gen.name} 攻擊 ${def.gen.name}！造成 ${dmgToDef} 傷害（反擊 ${counterDmg}）。`);

    if (def.troops === 0) {
      addLog(`💥 ${def.gen.name} 部隊潰散！`);
      def.morale = 0;
    }
    if (atk.troops === 0) {
      addLog(`💥 ${atk.gen.name} 部隊潰散！`);
    }

    checkBattleEnd();
  }

  function performFire(caster, target) {
    const tInfo = TERRAIN[state.map[target.r][target.c]];
    const successRate = Math.min(0.95, Math.max(0.25, (caster.gen.int - target.gen.int * 0.4) / 85) * state.weather.fireMult * (state.n5BonusActive && caster.isPlayer ? 1.25 : 1));
    if (caster.isPlayer) state.n5BonusActive = false;
    caster.fireUsed += 1;
    caster.acted = true;
    caster.moved = true;

    if (Math.random() <= successRate) {
      const dmg = Math.round((450 + caster.gen.int * 11) * tInfo.fireBonus * state.weather.fireMult);
      target.troops = Math.max(0, target.troops - dmg);
      target.morale = Math.max(20, target.morale - 15);
      window.RTK3.Audio.fire();
      addLog(`🔥 ${caster.gen.name} 施展火計命中 ${target.gen.name}！燒毀 ${dmg} 兵力！`);
      if (target.troops === 0) addLog(`💥 ${target.gen.name} 在烈火中全軍覆沒！`);
    } else {
      window.RTK3.Audio.chimeBad();
      addLog(`💨 ${caster.gen.name} 對 ${target.gen.name} 施展火計，但被識破了！`);
    }
    checkBattleEnd();
  }

  function checkBattleEnd() {
    if (state.over) return;
    const atkAlive = getAliveUnits('atk');
    const defAlive = getAliveUnits('def');
    if (defAlive.length === 0) {
      finishBattle('atk', `守軍全滅！${state.atkFaction.name}軍 攻佔了 ${state.city.name}！`);
    } else if (atkAlive.length === 0) {
      finishBattle('def', `攻方全滅！守軍成功守住 ${state.city.name}！`);
    } else {
      state.mode = 'idle';
      state.reachable = [];
      state.attackTargets = [];
      if (state.selectedUid) {
        const cur = state.units.find(u => u.uid === state.selectedUid);
        if (!cur || cur.troops === 0 || cur.acted) {
          const next = getAliveUnits(state.activeSide).find(u => !u.acted);
          if (next) selectUnit(next.uid);
        }
      }
      render();
    }
  }

  function finishBattle(winnerSide, reason) {
    if (state.over) return;
    state.over = true;
    window.RTK3.Audio.victory();
    addLog(`🏆 ${reason}`);
    render();

    const atkSurviving = getAliveUnits('atk').reduce((s, u) => s + u.troops, 0);
    const defSurviving = getAliveUnits('def').reduce((s, u) => s + u.troops, 0);

    setTimeout(() => {
      closeModal();
      if (onCompleteCb) {
        onCompleteCb({
          winnerSide,
          reason,
          atkUnits: state.units.filter(u => u.side === 'atk'),
          defUnits: state.units.filter(u => u.side === 'def'),
          atkSurviving,
          defSurviving
        });
      }
    }, 1150);
  }

  // Simple tactical AI for non-player side
  function runAITurn() {
    if (state.over) return;
    const units = getAliveUnits(state.activeSide).filter(u => !u.acted);
    if (units.length === 0) {
      endPhase();
      return;
    }

    const u = units[0];
    const enemies = getAliveUnits(state.activeSide === 'atk' ? 'def' : 'atk');
    if (enemies.length === 0) {
      checkBattleEnd();
      return;
    }

    // Find nearest enemy or castle (for atk)
    let targetGoal = enemies[0];
    let bestDist = Infinity;
    enemies.forEach(e => {
      const d = Math.abs(e.r - u.r) + Math.abs(e.c - u.c);
      if (d < bestDist) {
        bestDist = d;
        targetGoal = e;
      }
    });

    const reach = computeReachable(u);
    let bestMove = null;
    let bestScore = -Infinity;

    reach.forEach(cell => {
      let score = 0;
      const distToEnemy = Math.abs(cell.r - targetGoal.r) + Math.abs(cell.c - targetGoal.c);
      if (u.side === 'atk') {
        const distCastle = Math.abs(cell.r - 3) + Math.abs(cell.c - 9);
        score = -distToEnemy * 3 - distCastle * 1.5;
        if (state.map[cell.r][cell.c] === 'castle') score += 500;
      } else {
        // Defender prefers holding near castle/gates or attacking adjacent
        score = -distToEnemy * 2 + TERRAIN[state.map[cell.r][cell.c]].def * 12;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMove = cell;
      }
    });

    if (bestMove && bestDist > 1) {
      u.r = bestMove.r;
      u.c = bestMove.c;
      u.moved = true;
      if (u.side === 'atk' && state.map[u.r][u.c] === 'castle') {
        addLog(`🚩 ${u.gen.name} 突入本陣！`);
        finishBattle('atk', `${u.gen.name} 攻陷本陣！`);
        return;
      }
    }

    const adj = findEnemiesInRange(u, 1);
    if (adj.length > 0) {
      adj.sort((a, b) => a.troops - b.troops);
      performAttack(u, adj[0]);
    } else {
      const range2 = findEnemiesInRange(u, 2);
      if (range2.length > 0 && u.gen.int >= 75 && u.fireUsed < 2 && state.weather.id !== 'ame') {
        performFire(u, range2[0]);
      } else {
        u.acted = true;
        render();
      }
    }

    if (!state.over) {
      setTimeout(runAITurn, 340);
    }
  }

  // Duel minigame modal inside battle
  function openDuel(attacker, defender) {
    state.mode = 'duel';
    const overlay = document.getElementById('duel-overlay');
    overlay.classList.remove('hidden');

    let atkHp = 100;
    let defHp = 100;
    let round = 1;
    const duelLog = [`⚔️ ${attacker.gen.name}（武力 ${attacker.gen.war}）與 ${defender.gen.name}（武力 ${defender.gen.war}）展開一騎討ち！`];

    function renderDuel() {
      overlay.innerHTML = `
        <div class="duel-box panel-gold">
          <h3>⚔️ 一騎討ち（單挑決鬥）— 第 ${round} / 3 回合</h3>
          <div class="duel-fighters">
            <div class="duel-side">
              ${window.RTK3.renderPortraitSVG(attacker.gen, 72)}
              <div class="duel-name">${attacker.gen.name}（武 ${attacker.gen.war}）</div>
              <div class="hp-bar"><div class="hp-fill player" style="width:${atkHp}%"></div></div>
              <div class="hp-num">體力 ${atkHp}</div>
            </div>
            <div class="duel-vs">VS</div>
            <div class="duel-side">
              ${window.RTK3.renderPortraitSVG(defender.gen, 72)}
              <div class="duel-name">${defender.gen.name}（武 ${defender.gen.war}）</div>
              <div class="hp-bar"><div class="hp-fill enemy" style="width:${defHp}%"></div></div>
              <div class="hp-num">體力 ${defHp}</div>
            </div>
          </div>
          <div class="duel-log">${duelLog.slice(0, 3).map(l => `<div>${l}</div>`).join('')}</div>
          <div class="duel-actions">
            <button class="btn-rtk" data-duel="heavy">🔥 猛攻（勝防禦）</button>
            <button class="btn-rtk" data-duel="feint">⚡ 奇招（勝猛攻）</button>
            <button class="btn-rtk" data-duel="guard">🛡 防禦（勝奇招）</button>
          </div>
        </div>
      `;

      overlay.querySelectorAll('[data-duel]').forEach(btn => {
        btn.onclick = () => {
          const pMove = btn.dataset.duel;
          const moves = ['heavy', 'feint', 'guard'];
          const eMove = moves[Math.floor(Math.random() * 3)];
          const beats = { heavy: 'guard', feint: 'heavy', guard: 'feint' };
          const names = { heavy: '猛攻', feint: '奇招', guard: '防禦' };

          const warDiff = (attacker.gen.war - defender.gen.war) * 0.45;
          let pDmg = 0;
          let eDmg = 0;
          if (beats[pMove] === eMove) {
            eDmg = Math.max(18, Math.round(32 + warDiff + Math.random() * 12));
            duelLog.unshift(`你的「${names[pMove]}」壓制敵方「${names[eMove]}」！造成 ${eDmg} 傷害！`);
            window.RTK3.Audio.clash();
          } else if (beats[eMove] === pMove) {
            pDmg = Math.max(15, Math.round(28 - warDiff + Math.random() * 10));
            duelLog.unshift(`敵方「${names[eMove]}」克制你的「${names[pMove]}」！受到 ${pDmg} 傷害！`);
            window.RTK3.Audio.chimeBad();
          } else {
            eDmg = Math.max(10, Math.round(18 + warDiff * 0.5));
            pDmg = Math.max(10, Math.round(18 - warDiff * 0.5));
            duelLog.unshift(`雙方同出「${names[pMove]}」，刀劍交鋒！各損體力。`);
            window.RTK3.Audio.clash();
          }

          atkHp = Math.max(0, atkHp - pDmg);
          defHp = Math.max(0, defHp - eDmg);
          round += 1;

          if (atkHp <= 0 || defHp <= 0 || round > 3) {
            overlay.classList.add('hidden');
            attacker.acted = true;
            attacker.moved = true;
            if (defHp <= atkHp) {
              const loss = Math.round(defender.troops * 0.42);
              defender.troops = Math.max(0, defender.troops - loss);
              attacker.morale = Math.min(100, attacker.morale + 15);
              addLog(`🏆 單挑勝利！${attacker.gen.name} 擊敗 ${defender.gen.name}，敵軍潰損 ${loss} 兵！`);
              window.RTK3.Audio.victory();
            } else {
              const loss = Math.round(attacker.troops * 0.35);
              attacker.troops = Math.max(0, attacker.troops - loss);
              addLog(`💥 單挑落敗！${attacker.gen.name} 負傷退陣，損兵 ${loss}！`);
            }
            checkBattleEnd();
          } else {
            renderDuel();
          }
        };
      });
    }
    renderDuel();
  }

  function autoResolve() {
    if (state.over) return;
    let atkScore = getAliveUnits('atk').reduce((s, u) => s + u.troops * (0.7 + u.gen.land / 150 + u.gen.war / 200), 0);
    let defScore = getAliveUnits('def').reduce((s, u) => s + u.troops * (0.85 + u.gen.land / 140 + state.cityDef / 300), 0);
    if (atkScore > defScore * 1.05) {
      getAliveUnits('def').forEach(u => { u.troops = 0; });
      getAliveUnits('atk').forEach(u => { u.troops = Math.max(100, Math.round(u.troops * 0.68)); });
      finishBattle('atk', `自動戰鬥結果：${state.atkFaction.name}軍 擊破守軍，攻佔 ${state.city.name}！`);
    } else {
      getAliveUnits('atk').forEach(u => { u.troops = Math.round(u.troops * 0.25); });
      getAliveUnits('def').forEach(u => { u.troops = Math.max(100, Math.round(u.troops * 0.65)); });
      finishBattle('def', `自動戰鬥結果：守軍成功擊退 ${state.atkFaction.name}軍！`);
    }
  }

  function render() {
    if (!state) return;
    const n5 = window.RTK3.n5Tag;
    const header = document.getElementById('battle-header');
    header.innerHTML = `
      <div class="battle-title">
        <span>⚔️ ${state.city.name}攻防戰</span>
        <span class="badge">${n5('jikan', '日數')} ${state.turn}/${state.maxTurns}</span>
        <span class="badge">${n5('tenki', '天氣')}：${n5(state.weather.n5Id, state.weather.name)}</span>
      </div>
      <div class="battle-turn-badge">
        ${state.activeSide === 'atk' ? `攻方【${state.atkFaction.name}】行動` : `守方【${state.defFaction ? state.defFaction.name : '無主城'}】行動`}
        ${state.n5BonusActive ? '<span class="bonus-pill">✨ N5 軍師加成 +25%</span>' : ''}
      </div>
    `;

    // Grid
    const gridEl = document.getElementById('battle-grid');
    gridEl.innerHTML = '';
    const sel = state.units.find(u => u.uid === state.selectedUid);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const tId = state.map[r][c];
        const t = TERRAIN[tId];
        const unit = getUnitAt(r, c);
        const isReach = state.reachable.some(p => p.r === r && p.c === c);
        const isTarget = unit && ((state.mode === 'attack' && state.attackTargets.some(e => e.uid === unit.uid)) ||
                                   (state.mode === 'fire' && unit.side !== state.activeSide && Math.abs(unit.r - sel.r) + Math.abs(unit.c - sel.c) <= 2));

        const cell = document.createElement('div');
        cell.className = `b-cell t-${tId} ${isReach ? 'can-move' : ''} ${isTarget ? 'can-target' : ''} ${unit && unit.uid === state.selectedUid ? 'is-selected' : ''}`;
        cell.title = `${t.name}（防禦 ${Math.round(t.def * 100)}%，移動消耗 ${t.cost}）`;

        let unitHtml = '';
        if (unit) {
          const color = unit.side === 'atk' ? state.atkFaction.color : (state.defFaction ? state.defFaction.color : '#666');
          unitHtml = `
            <div class="b-unit ${unit.acted ? 'acted' : ''}" style="border-color:${color}; background:${color}cc">
              <div class="b-uname">${unit.gen.name.slice(0, 2)}</div>
              <div class="b-utroops">${unit.troops}</div>
            </div>
          `;
        }
        cell.innerHTML = `<span class="t-sym">${t.symbol}</span>${unitHtml}`;
        cell.onclick = () => onCellClick(r, c);
        gridEl.appendChild(cell);
      }
    }

    // Sidebar unit & commands
    const ctrlEl = document.getElementById('battle-controls');
    const isPlayerTurn = (state.activeSide === 'atk' && state.playerIsAtk) || (state.activeSide === 'def' && !state.playerIsAtk);

    let unitPanel = '<div class="empty-note">點選己方部隊執行指令</div>';
    if (sel) {
      const tInfo = TERRAIN[state.map[sel.r][sel.c]];
      unitPanel = `
        <div class="b-unit-card">
          ${window.RTK3.renderPortraitSVG(sel.gen, 56)}
          <div>
            <div class="b-card-name">${sel.gen.name} <small>(${sel.gen.kana})</small></div>
            <div class="b-card-stats">兵力 ${sel.troops} | 武 ${sel.gen.war} 知 ${sel.gen.int} 陸 ${sel.gen.land}</div>
            <div class="b-card-terrain">地形：${n5(tInfo.n5Id, tInfo.name)}</div>
          </div>
        </div>
      `;
    }

    const canAct = isPlayerTurn && sel && sel.isPlayer && !sel.acted && !state.over;
    const adjEnemies = sel ? findEnemiesInRange(sel, 1) : [];
    const fireEnemies = sel ? findEnemiesInRange(sel, 2) : [];

    ctrlEl.innerHTML = `
      ${unitPanel}
      <div class="b-cmd-grid">
        <button class="btn-rtk" id="b-btn-move" ${canAct && !sel.moved ? '' : 'disabled'}>🏃 移動 ${n5('iku', '', true)}</button>
        <button class="btn-rtk" id="b-btn-atk" ${canAct && adjEnemies.length > 0 ? '' : 'disabled'}>⚔️ 攻擊 ${n5('tsuyoi', '', true)}</button>
        <button class="btn-rtk" id="b-btn-fire" ${canAct && fireEnemies.length > 0 && sel.fireUsed < 2 ? '' : 'disabled'}>🔥 火計 ${n5('tsukau', '', true)}</button>
        <button class="btn-rtk" id="b-btn-duel" ${canAct && adjEnemies.length > 0 ? '' : 'disabled'}>🤺 單挑</button>
        <button class="btn-rtk" id="b-btn-wait" ${canAct ? '' : 'disabled'}>🛡 待機 ${n5('matsu', '', true)}</button>
        <button class="btn-rtk btn-accent" id="b-btn-quiz" ${isPlayerTurn && !state.n5QuizUsedThisBattle ? '' : 'disabled'}>🎓 N5 軍師策</button>
      </div>
      <div class="b-phase-row">
        <button class="btn-rtk" id="b-btn-end" ${isPlayerTurn && !state.over ? '' : 'disabled'}>⏭ 結束本軍行動 ${n5('owaru', '', true)}</button>
        <button class="btn-rtk" id="b-btn-auto" ${!state.over ? '' : 'disabled'}>⚡ 自動戰鬥</button>
      </div>
      <div class="b-terrain-legend">
        ${n5('yama', '山▲')} ${n5('mori', '森♣')} ${n5('kawa', '川≈')} ${n5('michi', '道·')}
      </div>
      <div class="b-log-box">${state.logs.map(l => `<div>${l}</div>`).join('')}</div>
    `;

    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.onclick = fn;
    };
    bind('b-btn-move', () => { state.mode = 'move'; state.reachable = computeReachable(sel); render(); });
    bind('b-btn-atk', () => { state.mode = 'attack'; state.attackTargets = adjEnemies; render(); });
    bind('b-btn-fire', () => { state.mode = 'fire'; render(); });
    bind('b-btn-duel', () => { if (adjEnemies[0]) openDuel(sel, adjEnemies[0]); });
    bind('b-btn-wait', () => { sel.acted = true; sel.moved = true; checkBattleEnd(); });
    bind('b-btn-end', () => { window.RTK3.Audio.confirm(); endPhase(); });
    bind('b-btn-auto', () => autoResolve());
    bind('b-btn-quiz', () => {
      if (window.RTK3.openQuickQuiz) {
        window.RTK3.openQuickQuiz(['yama', 'kawa', 'mori', 'tenki', 'hare', 'ame', 'kaze', 'tsukau', 'matsu', 'iku'], (ok) => {
          state.n5QuizUsedThisBattle = true;
          if (ok) {
            state.n5BonusActive = true;
            addLog('🎓 軍師策成功！下次攻擊/火計威力與命中 +25%！');
          }
          render();
        });
      }
    });
  }

  function onCellClick(r, c) {
    if (!state || state.over) return;
    const isPlayerTurn = (state.activeSide === 'atk' && state.playerIsAtk) || (state.activeSide === 'def' && !state.playerIsAtk);
    if (!isPlayerTurn) return;

    const sel = state.units.find(u => u.uid === state.selectedUid);
    const clickedUnit = getUnitAt(r, c);

    if (state.mode === 'fire' && sel && clickedUnit && clickedUnit.side !== sel.side) {
      const dist = Math.abs(clickedUnit.r - sel.r) + Math.abs(clickedUnit.c - sel.c);
      if (dist <= 2) {
        performFire(sel, clickedUnit);
        return;
      }
    }

    if (sel && !sel.acted && clickedUnit && clickedUnit.side !== sel.side) {
      const dist = Math.abs(clickedUnit.r - sel.r) + Math.abs(clickedUnit.c - sel.c);
      if (dist === 1) {
        performAttack(sel, clickedUnit);
        return;
      }
    }

    if (state.mode === 'move' && sel && !sel.moved && state.reachable.some(p => p.r === r && p.c === c)) {
      performMove(sel, r, c);
      return;
    }

    if (clickedUnit) {
      selectUnit(clickedUnit.uid);
    }
  }

  return { start };
})();
