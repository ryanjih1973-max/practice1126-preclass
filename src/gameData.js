// Historical Scenarios, Cities, Factions, and Generals in Sangokushi III style
window.RTK3 = window.RTK3 || {};

window.RTK3.FACTIONS = {
  cao: { id: 'cao', name: '曹操', color: '#2b5cab', light: '#5c8ee6', banner: '曹', desc: '治世之能臣，亂世之奸雄。人材濟濟，善於治國與用兵。' },
  liu: { id: 'liu', name: '劉備', color: '#2e8b57', light: '#52c484', banner: '劉', desc: '漢室宗親，仁德廣被。擁有關羽、張飛等萬人敵猛將。' },
  sun_jian: { id: 'sun_jian', name: '孫堅', color: '#b83232', light: '#e85d5d', banner: '孫', desc: '江東猛虎，水戰與機動力出眾，雄踞江南。' },
  sun_ce: { id: 'sun_ce', name: '孫策', color: '#b83232', light: '#e85d5d', banner: '孫', desc: '江東小霸王，勇猛果敢，與周瑜攜手開創江東基業。' },
  sun_quan: { id: 'sun_quan', name: '孫權', color: '#b83232', light: '#e85d5d', banner: '孫', desc: '坐斷東南，善任賢能，守成與水軍實力極強。' },
  dong: { id: 'dong', name: '董卓', color: '#6b326b', light: '#a85aa8', banner: '董', desc: '掌控洛陽與長安，兵多糧足，更有天下無雙呂布助陣。' },
  yuan: { id: 'yuan', name: '袁紹', color: '#b5891b', light: '#e0b742', banner: '袁', desc: '四世三公，名震河北，地盤廣大、資源豐厚。' },
  lubu: { id: 'lubu', name: '呂布', color: '#7a2948', light: '#c94c7a', banner: '呂', desc: '飛將軍呂布，武力天下第一，駐軍徐州虎視中原。' },
  biao: { id: 'biao', name: '劉表', color: '#4d6f82', light: '#7aa5bd', banner: '表', desc: '據守荊州要衝，富庶安穩，水陸交通樞紐。' },
  ma: { id: 'ma', name: '馬騰', color: '#8c5a2b', light: '#c4864b', banner: '馬', desc: '西涼名門，民風剽悍，鐵騎馳騁關西。' },
  zhang: { id: 'zhang', name: '劉璋', color: '#5b7040', light: '#8aa865', banner: '璋', desc: '益州天府之國，易守難攻，糧草極為充足。' }
};

// 14 strategic cities with normalized canvas coords (0..1000 x 0..640)
window.RTK3.CITIES_TEMPLATE = [
  { id: 'xiliang', name: '西涼', kana: 'せいりょう', x: 120, y: 165, terrain: '西域高原', region: 'west', neighbors: ['changan', 'hanzhong'], basePop: 95000, baseDev: 42, baseCom: 38, baseDef: 62 },
  { id: 'changan', name: '長安', kana: 'ちょうあん', x: 270, y: 245, terrain: '關中大城', region: 'west', neighbors: ['xiliang', 'luoyang', 'hanzhong', 'nanyang'], basePop: 210000, baseDev: 68, baseCom: 66, baseDef: 82 },
  { id: 'luoyang', name: '洛陽', kana: 'らくよう', x: 425, y: 240, terrain: '中原帝都', region: 'center', neighbors: ['changan', 'ye', 'xuchang', 'nanyang'], basePop: 260000, baseDev: 75, baseCom: 78, baseDef: 85 },
  { id: 'ye', name: '鄴', kana: 'ぎょう', x: 525, y: 155, terrain: '河北重鎮', region: 'north', neighbors: ['luoyang', 'ji', 'xuchang', 'xuzhou'], basePop: 195000, baseDev: 72, baseCom: 70, baseDef: 76 },
  { id: 'ji', name: '薊', kana: 'けい', x: 645, y: 85, terrain: '幽州邊城', region: 'north', neighbors: ['ye'], basePop: 135000, baseDev: 55, baseCom: 52, baseDef: 66 },
  { id: 'xuchang', name: '許昌', kana: 'きょしょう', x: 530, y: 275, terrain: '中原平川', region: 'center', neighbors: ['luoyang', 'ye', 'xuzhou', 'shouchun', 'nanyang'], basePop: 185000, baseDev: 70, baseCom: 72, baseDef: 74 },
  { id: 'xuzhou', name: '徐州', kana: 'じょしゅう', x: 685, y: 245, terrain: '淮北要衝', region: 'east', neighbors: ['ye', 'xuchang', 'shouchun', 'jianye'], basePop: 165000, baseDev: 64, baseCom: 65, baseDef: 68 },
  { id: 'shouchun', name: '壽春', kana: 'じゅしゅん', x: 655, y: 345, terrain: '淮南水鄉', region: 'east', neighbors: ['xuchang', 'xuzhou', 'jianye', 'jiangxia'], basePop: 155000, baseDev: 62, baseCom: 64, baseDef: 72 },
  { id: 'jianye', name: '建業', kana: 'けんぎょう', x: 790, y: 385, terrain: '江南大都', region: 'east', neighbors: ['xuzhou', 'shouchun', 'wu', 'jiangxia'], basePop: 215000, baseDev: 73, baseCom: 76, baseDef: 78 },
  { id: 'wu', name: '吳', kana: 'ご', x: 865, y: 465, terrain: '江東水城', region: 'east', neighbors: ['jianye', 'changsha'], basePop: 150000, baseDev: 65, baseCom: 74, baseDef: 66 },
  { id: 'nanyang', name: '南陽', kana: 'なんよう', x: 425, y: 340, terrain: '荊北門戶', region: 'center', neighbors: ['changan', 'luoyang', 'xuchang', 'xiangyang'], basePop: 145000, baseDev: 58, baseCom: 56, baseDef: 65 },
  { id: 'xiangyang', name: '襄陽', kana: 'じょうよう', x: 455, y: 425, terrain: '荊州名城', region: 'south', neighbors: ['nanyang', 'jiangxia', 'changsha', 'chengdu'], basePop: 180000, baseDev: 68, baseCom: 67, baseDef: 80 },
  { id: 'jiangxia', name: '江夏', kana: 'こうか', x: 605, y: 445, terrain: '長江要塞', region: 'south', neighbors: ['shouchun', 'jianye', 'xiangyang', 'changsha'], basePop: 150000, baseDev: 60, baseCom: 62, baseDef: 72 },
  { id: 'changsha', name: '長沙', kana: 'ちょうさ', x: 565, y: 545, terrain: '荊南重鎮', region: 'south', neighbors: ['xiangyang', 'jiangxia', 'wu'], basePop: 135000, baseDev: 58, baseCom: 59, baseDef: 64 },
  { id: 'hanzhong', name: '漢中', kana: 'かんちゅう', x: 255, y: 355, terrain: '秦嶺關隘', region: 'west', neighbors: ['xiliang', 'changan', 'chengdu'], basePop: 120000, baseDev: 56, baseCom: 50, baseDef: 82 },
  { id: 'chengdu', name: '成都', kana: 'せいと', x: 195, y: 485, terrain: '天府之國', region: 'west', neighbors: ['hanzhong', 'xiangyang'], basePop: 220000, baseDev: 78, baseCom: 75, baseDef: 84 }
];

// Historical Generals: [id, name, kana, factionHint, land, naval, war, int, pol, charm, portraitSpec]
// portraitSpec: { skin, hair, beard, helm, armor, style }
window.RTK3.GENERALS_TEMPLATE = [
  // Cao Cao faction
  { id: 'caocao', name: '曹操', kana: 'そうそう', land: 89, naval: 74, war: 72, int: 93, pol: 95, charm: 94, p: { skin: '#e8c4a0', hair: '#1d1d24', beard: 'goatee', helm: 'crown', armor: '#254a8a', bg: '#162848' } },
  { id: 'xiahoudun', name: '夏侯惇', kana: 'かこうとん', land: 90, naval: 62, war: 91, int: 63, pol: 70, charm: 81, p: { skin: '#d8ab82', hair: '#222', beard: 'short', helm: 'band', armor: '#2b5cab', bg: '#1a2f52', eyepatch: true } },
  { id: 'xiahouyuan', name: '夏侯淵', kana: 'かこうえん', land: 88, naval: 55, war: 90, int: 58, pol: 62, charm: 76, p: { skin: '#d9ac83', hair: '#25252b', beard: 'full', helm: 'iron', armor: '#2b5cab', bg: '#1a2f52' } },
  { id: 'xunyu', name: '荀彧', kana: 'じゅんいく', land: 52, naval: 45, war: 25, int: 95, pol: 98, charm: 93, p: { skin: '#f0d4b8', hair: '#1a1a22', beard: 'neat', helm: 'scholar', armor: '#345e9e', bg: '#182b4a' } },
  { id: 'guojia', name: '郭嘉', kana: 'かくか', land: 65, naval: 58, war: 28, int: 97, pol: 86, charm: 84, p: { skin: '#f2d9c2', hair: '#222', beard: 'none', helm: 'scholar', armor: '#3b67ad', bg: '#1a3054' } },
  { id: 'zhangliao', name: '張遼', kana: 'ちょうりょう', land: 94, naval: 72, war: 92, int: 79, pol: 74, charm: 87, p: { skin: '#dfba95', hair: '#1c1c24', beard: 'goatee', helm: 'plume', armor: '#234b91', bg: '#15294d' } },
  { id: 'xuhuang', name: '徐晃', kana: 'じょこう', land: 89, naval: 60, war: 90, int: 71, pol: 64, charm: 78, p: { skin: '#d6a97f', hair: '#222', beard: 'long', helm: 'turban', armor: '#2a559e', bg: '#172d52' } },
  { id: 'xuchu', name: '許褚', kana: 'きょちょ', land: 83, naval: 40, war: 96, int: 38, pol: 32, charm: 65, p: { skin: '#d19e73', hair: '#1a1a1a', beard: 'wild', helm: 'band', armor: '#1f427a', bg: '#142645' } },
  { id: 'simayi', name: '司馬懿', kana: 'しばい', land: 91, naval: 70, war: 63, int: 96, pol: 94, charm: 82, p: { skin: '#eed0b4', hair: '#2b2b33', beard: 'neat', helm: 'crown', armor: '#304e85', bg: '#192947' } },

  // Liu Bei faction
  { id: 'liubei', name: '劉備', kana: 'りゅうび', land: 74, naval: 62, war: 73, int: 78, pol: 85, charm: 98, p: { skin: '#ebd0b3', hair: '#1c1c22', beard: 'neat', helm: 'crown', armor: '#257046', bg: '#143b25' } },
  { id: 'guanyu', name: '關羽', kana: 'かんう', land: 96, naval: 82, war: 97, int: 79, pol: 72, charm: 94, p: { skin: '#d47e6a', hair: '#18181f', beard: 'long', helm: 'turban', armor: '#26784b', bg: '#133d26' } },
  { id: 'zhangfei', name: '張飛', kana: 'ちょうひ', land: 88, naval: 55, war: 98, int: 42, pol: 35, charm: 68, p: { skin: '#c98e6b', hair: '#15151a', beard: 'wild', helm: 'band', armor: '#1f633e', bg: '#103320' } },
  { id: 'zhaoyun', name: '趙雲', kana: 'ちょううん', land: 93, naval: 70, war: 96, int: 77, pol: 72, charm: 91, p: { skin: '#edd2b7', hair: '#1e1e26', beard: 'none', helm: 'plume', armor: '#3a9464', bg: '#17452c' } },
  { id: 'zhugeliang', name: '諸葛亮', kana: 'しょかつりょう', land: 92, naval: 86, war: 38, int: 100, pol: 97, charm: 95, p: { skin: '#f3dcc4', hair: '#202028', beard: 'neat', helm: 'scholar', armor: '#2e8b57', bg: '#144028' } },
  { id: 'huangzhong', name: '黃忠', kana: 'こうちゅう', land: 87, naval: 58, war: 93, int: 62, pol: 55, charm: 80, p: { skin: '#dec0a0', hair: '#c9cdd4', beard: 'white', helm: 'iron', armor: '#2a7d4e', bg: '#143b25' } },
  { id: 'weiyan', name: '魏延', kana: 'ぎえん', land: 86, naval: 50, war: 91, int: 69, pol: 51, charm: 58, p: { skin: '#d4a37b', hair: '#1c1c22', beard: 'short', helm: 'iron', armor: '#236e44', bg: '#113320' } },
  { id: 'jianyou', name: '簡雍', kana: 'かんよう', land: 44, naval: 42, war: 35, int: 74, pol: 81, charm: 79, p: { skin: '#ebd0b5', hair: '#25252d', beard: 'goatee', helm: 'scholar', armor: '#318054', bg: '#163b26' } },

  // Sun family faction
  { id: 'sunjian', name: '孫堅', kana: 'そんけん', land: 91, naval: 88, war: 92, int: 73, pol: 75, charm: 89, p: { skin: '#dfb893', hair: '#1c1c24', beard: 'full', helm: 'plume', armor: '#a82c2c', bg: '#4a1414' } },
  { id: 'sunce', name: '孫策', kana: 'そんさく', land: 92, naval: 89, war: 94, int: 74, pol: 76, charm: 92, p: { skin: '#ebd0b4', hair: '#1c1c24', beard: 'none', helm: 'plume', armor: '#b83232', bg: '#521515' } },
  { id: 'sunquan', name: '孫權', kana: 'そんけん', land: 78, naval: 86, war: 70, int: 83, pol: 90, charm: 94, p: { skin: '#ebd0b4', hair: '#2e1f1c', beard: 'goatee', helm: 'crown', armor: '#a82c2c', bg: '#4a1414' } },
  { id: 'zhouyu', name: '周瑜', kana: 'しゅうゆ', land: 90, naval: 98, war: 72, int: 96, pol: 88, charm: 95, p: { skin: '#f3d9c0', hair: '#1b1b22', beard: 'none', helm: 'scholar', armor: '#c73c3c', bg: '#541919' } },
  { id: 'taishici', name: '太史慈', kana: 'たいしじ', land: 89, naval: 82, war: 94, int: 68, pol: 61, charm: 84, p: { skin: '#deb690', hair: '#1a1a22', beard: 'short', helm: 'iron', armor: '#a12a2a', bg: '#471212' } },
  { id: 'ganning', name: '甘寧', kana: 'かんねい', land: 85, naval: 95, war: 94, int: 71, pol: 48, charm: 78, p: { skin: '#d8ab82', hair: '#202028', beard: 'short', helm: 'band', armor: '#b83232', bg: '#4f1515' } },
  { id: 'lusu', name: '魯肅', kana: 'ろしゅく', land: 65, naval: 80, war: 49, int: 89, pol: 92, charm: 90, p: { skin: '#ecd1b6', hair: '#22222a', beard: 'neat', helm: 'scholar', armor: '#9c2d2d', bg: '#421414' } },
  { id: 'huanggai', name: '黃蓋', kana: 'こうがい', land: 82, naval: 91, war: 84, int: 72, pol: 68, charm: 81, p: { skin: '#d4a67d', hair: '#b8bec7', beard: 'white', helm: 'iron', armor: '#962828', bg: '#421212' } },
  { id: 'lumeng', name: '呂蒙', kana: 'りょもう', land: 88, naval: 92, war: 81, int: 89, pol: 82, charm: 83, p: { skin: '#e2bd98', hair: '#1e1e26', beard: 'goatee', helm: 'iron', armor: '#a82c2c', bg: '#4a1414' } },

  // Dong Zhuo & Lu Bu
  { id: 'dongzhuo', name: '董卓', kana: 'とうたく', land: 79, naval: 40, war: 84, int: 65, pol: 52, charm: 35, p: { skin: '#d9a480', hair: '#242024', beard: 'wild', helm: 'crown', armor: '#6b326b', bg: '#321633' } },
  { id: 'lubu', name: '呂布', kana: 'りょふ', land: 94, naval: 45, war: 100, int: 36, pol: 28, charm: 55, p: { skin: '#e6c09a', hair: '#1a1a22', beard: 'none', helm: 'lubu', armor: '#7a2948', bg: '#3b1122' } },
  { id: 'liru', name: '李儒', kana: 'りじゅ', land: 62, naval: 40, war: 29, int: 91, pol: 84, charm: 42, p: { skin: '#e8ccb0', hair: '#202026', beard: 'goatee', helm: 'scholar', armor: '#5e2b5e', bg: '#2c132e' } },
  { id: 'huaxiong', name: '華雄', kana: 'かゆう', land: 81, naval: 38, war: 91, int: 46, pol: 36, charm: 58, p: { skin: '#cf9b72', hair: '#1a1a20', beard: 'full', helm: 'iron', armor: '#6b326b', bg: '#301530' } },
  { id: 'jiaxu', name: '賈詡', kana: 'かく', land: 78, naval: 55, war: 42, int: 96, pol: 87, charm: 66, p: { skin: '#e6c8ab', hair: '#2b2b33', beard: 'neat', helm: 'scholar', armor: '#59335c', bg: '#28162b' } },
  { id: 'gaoshun', name: '高順', kana: 'こうじゅん', land: 88, naval: 45, war: 86, int: 64, pol: 62, charm: 77, p: { skin: '#dbb48e', hair: '#1b1b22', beard: 'short', helm: 'iron', armor: '#7a2948', bg: '#381220' } },
  { id: 'chengong', name: '陳宮', kana: 'ちんきゅう', land: 74, naval: 50, war: 45, int: 89, pol: 85, charm: 74, p: { skin: '#ebd0b3', hair: '#202028', beard: 'goatee', helm: 'scholar', armor: '#7a2948', bg: '#381220' } },

  // Yuan Shao
  { id: 'yuanshao', name: '袁紹', kana: 'えんしょう', land: 78, naval: 62, war: 69, int: 74, pol: 82, charm: 88, p: { skin: '#ebd0b5', hair: '#1e1e24', beard: 'neat', helm: 'crown', armor: '#a67d17', bg: '#453408' } },
  { id: 'yanliang', name: '顏良', kana: 'がんりょう', land: 84, naval: 48, war: 94, int: 44, pol: 38, charm: 65, p: { skin: '#d8ab82', hair: '#1b1b22', beard: 'full', helm: 'iron', armor: '#9e7616', bg: '#423108' } },
  { id: 'wenchou', name: '文醜', kana: 'ぶんしゅう', land: 83, naval: 46, war: 93, int: 42, pol: 36, charm: 63, p: { skin: '#d4a379', hair: '#1b1b22', beard: 'wild', helm: 'iron', armor: '#967015', bg: '#3d2d07' } },
  { id: 'tianfeng', name: '田豐', kana: 'でんほう', land: 64, naval: 48, war: 34, int: 92, pol: 89, charm: 76, p: { skin: '#edd2b7', hair: '#24242b', beard: 'neat', helm: 'scholar', armor: '#9c781c', bg: '#3d2f0a' } },
  { id: 'zhanghe', name: '張郃', kana: 'ちょうこう', land: 90, naval: 60, war: 89, int: 78, pol: 72, charm: 80, p: { skin: '#e2bd98', hair: '#1d1d24', beard: 'goatee', helm: 'plume', armor: '#b5891b', bg: '#47360a' } },

  // Ma Teng, Liu Biao, Liu Zhang & Free Officers
  { id: 'mateng', name: '馬騰', kana: 'ばとう', land: 87, naval: 38, war: 88, int: 62, pol: 68, charm: 85, p: { skin: '#d9ae84', hair: '#242228', beard: 'full', helm: 'plume', armor: '#8c5a2b', bg: '#3b2511' } },
  { id: 'machao', name: '馬超', kana: 'ばちょう', land: 92, naval: 44, war: 97, int: 58, pol: 52, charm: 86, p: { skin: '#edd2b7', hair: '#1d1d24', beard: 'none', helm: 'plume', armor: '#a16a35', bg: '#422a13' } },
  { id: 'pangde', name: '龐德', kana: 'ほうとく', land: 88, naval: 45, war: 93, int: 63, pol: 54, charm: 76, p: { skin: '#d6a67c', hair: '#1d1d24', beard: 'short', helm: 'iron', armor: '#805328', bg: '#36220f' } },
  { id: 'liubiao', name: '劉表', kana: 'りゅうひょう', land: 60, naval: 72, war: 52, int: 76, pol: 84, charm: 86, p: { skin: '#ebd0b3', hair: '#3a3a42', beard: 'neat', helm: 'crown', armor: '#4d6f82', bg: '#1e2e38' } },
  { id: 'huangzu', name: '黃祖', kana: 'こうそ', land: 70, naval: 78, war: 72, int: 59, pol: 55, charm: 60, p: { skin: '#d6aa82', hair: '#25252b', beard: 'short', helm: 'iron', armor: '#456475', bg: '#1c2b33' } },
  { id: 'kuaiyue', name: '蒯越', kana: 'かいえつ', land: 58, naval: 64, war: 35, int: 85, pol: 86, charm: 77, p: { skin: '#ecd1b6', hair: '#25252d', beard: 'goatee', helm: 'scholar', armor: '#4d6f82', bg: '#1e2e38' } },
  { id: 'liuzhang', name: '劉璋', kana: 'りゅうしょう', land: 48, naval: 42, war: 39, int: 60, pol: 72, charm: 75, p: { skin: '#eed3b8', hair: '#24242b', beard: 'neat', helm: 'crown', armor: '#5b7040', bg: '#252e1a' } },
  { id: 'zhangren', name: '張任', kana: 'ちょうじん', land: 86, naval: 50, war: 84, int: 78, pol: 68, charm: 80, p: { skin: '#dfb790', hair: '#1d1d24', beard: 'short', helm: 'iron', armor: '#5b7040', bg: '#252e1a' } },
  { id: 'fazheng', name: '法正', kana: 'ほうせい', land: 74, naval: 52, war: 44, int: 93, pol: 85, charm: 68, p: { skin: '#ebd0b4', hair: '#202028', beard: 'goatee', helm: 'scholar', armor: '#5b7040', bg: '#252e1a' } },
  { id: 'dianwei', name: '典韋', kana: 'てんい', land: 85, naval: 42, war: 96, int: 39, pol: 31, charm: 66, p: { skin: '#ce9970', hair: '#1a1a20', beard: 'short', helm: 'band', armor: '#2b5cab', bg: '#162848' } },
  { id: 'pangtong', name: '龐統', kana: 'ほうとう', land: 82, naval: 76, war: 36, int: 96, pol: 89, charm: 76, p: { skin: '#d8ab82', hair: '#25252c', beard: 'goatee', helm: 'scholar', armor: '#2e8b57', bg: '#143b25' } },
  { id: 'xushu', name: '徐庶', kana: 'じょしょ', land: 84, naval: 66, war: 68, int: 92, pol: 83, charm: 84, p: { skin: '#ebd0b4', hair: '#202028', beard: 'neat', helm: 'scholar', armor: '#2e8b57', bg: '#143b25' } },
  { id: 'ganfuren', name: '甘寧', kana: 'かんねい', skip: true }
].filter(g => !g.skip);

// Three classic Sangokushi III scenarios
window.RTK3.SCENARIOS = [
  {
    id: '189',
    year: 189,
    month: 9,
    title: '189年 董卓專橫',
    jpTitle: '董卓専横（反董卓連合）',
    subtitle: '董卓挾天子據洛陽・長安，群雄並起討伐暴政！',
    difficultyInfo: '推薦新手：曹操・孫堅・袁紹 / 挑戰：劉備',
    playableRulers: ['cao', 'liu', 'sun_jian', 'dong', 'yuan', 'ma', 'biao'],
    citySetup: {
      luoyang: { owner: 'dong', gold: 2800, food: 4200, troops: 14000, gens: ['dongzhuo', 'lubu', 'liru', 'huaxiong'] },
      changan: { owner: 'dong', gold: 2200, food: 3500, troops: 10000, gens: ['jiaxu', 'gaoshun'] },
      xiliang: { owner: 'ma', gold: 1400, food: 2400, troops: 8500, gens: ['mateng', 'machao', 'pangde'] },
      ye: { owner: 'yuan', gold: 2400, food: 3400, troops: 11000, gens: ['yuanshao', 'yanliang', 'wenchou', 'tianfeng'] },
      ji: { owner: 'yuan', gold: 1500, food: 2200, troops: 6500, gens: ['zhanghe'] },
      xuchang: { owner: 'cao', gold: 1900, food: 2800, troops: 9000, gens: ['caocao', 'xiahoudun', 'xiahouyuan', 'xunyu'] },
      xuzhou: { owner: 'liu', gold: 1300, food: 2100, troops: 6800, gens: ['liubei', 'guanyu', 'zhangfei', 'jianyou'] },
      jianye: { owner: 'sun_jian', gold: 1800, food: 2700, troops: 8800, gens: ['sunjian', 'sunce', 'huanggai'] },
      wu: { owner: 'sun_jian', gold: 1400, food: 2200, troops: 5800, gens: ['zhouyu', 'taishici'] },
      xiangyang: { owner: 'biao', gold: 1800, food: 2900, troops: 8200, gens: ['liubiao', 'huangzu', 'kuaiyue'] },
      chengdu: { owner: 'zhang', gold: 2100, food: 3600, troops: 8500, gens: ['liuzhang', 'zhangren', 'fazheng'] }
    },
    freeGenerals: {
      xuchang: ['guojia', 'dianwei'],
      ye: ['zhaoyun'],
      nanyang: ['zhugeliang', 'huangzhong'],
      shouchun: ['zhangliao', 'chengong'],
      jiangxia: ['ganning', 'lusu'],
      xiangyang: ['pangtong', 'xushu'],
      luoyang: ['xuhuang', 'simayi'],
      changan: ['xuchu'],
      wu: ['sunquan', 'lumeng'],
      hanzhong: ['weiyan']
    }
  },
  {
    id: '194',
    year: 194,
    month: 4,
    title: '194年 群雄割據',
    jpTitle: '群雄割拠',
    subtitle: '董卓伏誅後群雄紛爭，曹操迎天子、呂布襲徐州、小霸王平江東！',
    difficultyInfo: '經典亂戰：曹操・劉備・孫策・呂布',
    playableRulers: ['cao', 'liu', 'sun_ce', 'lubu', 'yuan', 'biao', 'ma'],
    citySetup: {
      xuchang: { owner: 'cao', gold: 2400, food: 3600, troops: 12000, gens: ['caocao', 'xiahoudun', 'xiahouyuan', 'xunyu', 'guojia', 'dianwei'] },
      luoyang: { owner: 'cao', gold: 1800, food: 2800, troops: 8500, gens: ['xuhuang', 'xuchu'] },
      ye: { owner: 'yuan', gold: 2800, food: 4000, troops: 14000, gens: ['yuanshao', 'yanliang', 'wenchou', 'tianfeng', 'zhanghe'] },
      ji: { owner: 'yuan', gold: 1500, food: 2400, troops: 7000, gens: ['zhaoyun'] },
      xuzhou: { owner: 'lubu', gold: 1600, food: 2400, troops: 10500, gens: ['lubu', 'zhangliao', 'gaoshun', 'chengong'] },
      nanyang: { owner: 'liu', gold: 1400, food: 2200, troops: 7200, gens: ['liubei', 'guanyu', 'zhangfei', 'jianyou'] },
      jianye: { owner: 'sun_ce', gold: 2000, food: 3000, troops: 9800, gens: ['sunce', 'zhouyu', 'taishici', 'huanggai'] },
      wu: { owner: 'sun_ce', gold: 1600, food: 2500, troops: 6800, gens: ['sunquan', 'lusu', 'lumeng'] },
      xiangyang: { owner: 'biao', gold: 2000, food: 3200, troops: 9000, gens: ['liubiao', 'huangzu', 'kuaiyue'] },
      xiliang: { owner: 'ma', gold: 1600, food: 2500, troops: 9200, gens: ['mateng', 'machao', 'pangde'] },
      changan: { owner: 'ma', gold: 1400, food: 2200, troops: 6800, gens: ['jiaxu'] },
      chengdu: { owner: 'zhang', gold: 2200, food: 3800, troops: 9500, gens: ['liuzhang', 'zhangren', 'fazheng'] }
    },
    freeGenerals: {
      xiangyang: ['zhugeliang', 'pangtong', 'xushu'],
      changsha: ['huangzhong', 'weiyan'],
      jiangxia: ['ganning'],
      luoyang: ['simayi']
    }
  },
  {
    id: '207',
    year: 207,
    month: 10,
    title: '207年 三顧茅廬',
    jpTitle: '三顧の礼（赤壁前夜）',
    subtitle: '曹操統一北方虎視南下，劉備得臥龍孔明、孫權據江東抗衡！',
    difficultyInfo: '三強鼎立：曹操（霸權）・劉備（逆襲）・孫權（江東）',
    playableRulers: ['cao', 'liu', 'sun_quan', 'biao', 'zhang', 'ma'],
    citySetup: {
      ye: { owner: 'cao', gold: 3000, food: 4500, troops: 15000, gens: ['caocao', 'zhangliao', 'zhanghe', 'guojia'] },
      ji: { owner: 'cao', gold: 1800, food: 2600, troops: 7500, gens: ['xuhuang'] },
      xuchang: { owner: 'cao', gold: 2600, food: 4000, troops: 13000, gens: ['xunyu', 'simayi', 'xuchu', 'jiaxu'] },
      luoyang: { owner: 'cao', gold: 2200, food: 3200, troops: 10000, gens: ['xiahoudun', 'xiahouyuan'] },
      changan: { owner: 'cao', gold: 1800, food: 2800, troops: 8500, gens: ['liru'] },
      xuzhou: { owner: 'cao', gold: 1700, food: 2600, troops: 8000, gens: ['chengong'] },
      nanyang: { owner: 'liu', gold: 1600, food: 2600, troops: 8200, gens: ['liubei', 'guanyu', 'zhangfei', 'zhaoyun', 'zhugeliang', 'xushu'] },
      jianye: { owner: 'sun_quan', gold: 2500, food: 3800, troops: 12000, gens: ['sunquan', 'zhouyu', 'lusu', 'taishici'] },
      wu: { owner: 'sun_quan', gold: 1800, food: 2800, troops: 7500, gens: ['lumeng', 'huanggai'] },
      jiangxia: { owner: 'sun_quan', gold: 1600, food: 2500, troops: 8000, gens: ['ganning'] },
      xiangyang: { owner: 'biao', gold: 2000, food: 3200, troops: 9000, gens: ['liubiao', 'huangzu', 'kuaiyue'] },
      changsha: { owner: 'biao', gold: 1300, food: 2200, troops: 6500, gens: ['huangzhong', 'weiyan'] },
      chengdu: { owner: 'zhang', gold: 2400, food: 4200, troops: 10500, gens: ['liuzhang', 'zhangren', 'fazheng'] },
      xiliang: { owner: 'ma', gold: 1700, food: 2700, troops: 9500, gens: ['mateng', 'machao', 'pangde'] }
    },
    freeGenerals: {
      xiangyang: ['pangtong']
    }
  }
];
