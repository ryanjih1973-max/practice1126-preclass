// Historical Factions, 46 Cities (1200x760 map), and 3 Scenarios (distributing all 311 generals)
window.RTK3 = window.RTK3 || {};

window.RTK3.FACTIONS = {
  cao:        { id: 'cao',        name: '曹操',   color: '#2b5cab', light: '#5c8ee6', banner: '曹', desc: '治世之能臣，亂世之奸雄。人材濟濟，善於治國與用兵。' },
  liu:        { id: 'liu',        name: '劉備',   color: '#2e8b57', light: '#52c484', banner: '劉', desc: '漢室宗親，仁德廣被。擁有關羽、張飛等萬人敵猛將。' },
  sun_jian:   { id: 'sun_jian',   name: '孫堅',   color: '#b83232', light: '#e85d5d', banner: '孫', desc: '江東猛虎，水戰與機動力出眾，雄踞長沙與江南。' },
  sun_ce:     { id: 'sun_ce',     name: '孫策',   color: '#b83232', light: '#e85d5d', banner: '孫', desc: '江東小霸王，勇猛果敢，與周瑜攜手開創江東基業。' },
  sun_quan:   { id: 'sun_quan',   name: '孫權',   color: '#b83232', light: '#e85d5d', banner: '孫', desc: '坐斷東南，善任賢能，守成與水軍實力極強。' },
  dong:       { id: 'dong',       name: '董卓',   color: '#6b326b', light: '#a85aa8', banner: '董', desc: '掌控洛陽與長安，兵多糧足，更有天下無雙呂布助陣。' },
  yuan:       { id: 'yuan',       name: '袁紹',   color: '#b5891b', light: '#e0b742', banner: '袁', desc: '四世三公，名震河北，地盤廣大、資源豐厚。' },
  yuanshu:    { id: 'yuanshu',    name: '袁術',   color: '#9e6b2b', light: '#d49a4a', banner: '術', desc: '據守南陽／壽春，兵糧雄厚，野心勃勃。' },
  lubu:       { id: 'lubu',       name: '呂布',   color: '#7a2948', light: '#c94c7a', banner: '呂', desc: '飛將軍呂布，武力天下第一，駐軍徐州虎視中原。' },
  biao:       { id: 'biao',       name: '劉表',   color: '#4d6f82', light: '#7aa5bd', banner: '表', desc: '據守荊州要衝，富庶安穩，水陸交通樞紐。' },
  ma:         { id: 'ma',         name: '馬騰',   color: '#8c5a2b', light: '#c4864b', banner: '馬', desc: '西涼名門，民風剽悍，鐵騎馳騁關西。' },
  zhang:      { id: 'zhang',      name: '劉璋',   color: '#5b7040', light: '#8aa865', banner: '璋', desc: '益州天府之國，易守難攻，糧草極為充足。' },
  gongsunzan: { id: 'gongsunzan', name: '公孫瓚', color: '#56687a', light: '#8aa0b8', banner: '瓚', desc: '白馬義從名震幽州，騎兵突擊力出眾。' },
  gongsundu:  { id: 'gongsundu',  name: '公孫度', color: '#505b66', light: '#7d8c9c', banner: '度', desc: '雄踞遼東襄平，偏安一隅待時而動。' },
  taoqian:    { id: 'taoqian',    name: '陶謙',   color: '#4c7356', light: '#78ab85', banner: '陶', desc: '徐州牧，仁厚愛民，徐州物產豐饒。' },
  kongrong:   { id: 'kongrong',   name: '孔融',   color: '#46617a', light: '#7195b8', banner: '孔', desc: '北海名儒，文教昌盛，禮賢下士。' },
  liuyao:     { id: 'liuyao',     name: '劉繇',   color: '#6d5c43', light: '#9e8867', banner: '繇', desc: '揚州刺史，據守建業，扼守長江下游。' },
  wanglang:   { id: 'wanglang',   name: '王朗',   color: '#5a5070', light: '#897ba6', banner: '王', desc: '會稽太守，江東南部門戶，財賦充裕。' },
  zhanglu:    { id: 'zhanglu',    name: '張魯',   color: '#6f6542', light: '#a19465', banner: '魯', desc: '漢中五斗米道教主，據秦嶺天險守成。' },
  shixie:     { id: 'shixie',     name: '士燮',   color: '#3c6e6a', light: '#65a39e', banner: '士', desc: '交趾名門，遠處南方，安穩發展內政。' },
  menghuo:    { id: 'menghuo',    name: '孟獲',   color: '#8a3d24', light: '#bf6040', banner: '孟', desc: '南中蠻王，勇猛善戰，據建寧群山。' }
};

// 46 Historical Cities across China on a 1200 x 760 canvas
window.RTK3.CITIES_TEMPLATE = [
  // North & Northeast (1-11)
  { id: 'xiangping', name: '襄平', kana: 'しょうへい', x: 1110, y: 78,  terrain: '遼東邊城', region: 'north', neighbors: ['beiping'], basePop: 110000, baseDev: 48, baseCom: 46, baseDef: 68 },
  { id: 'beiping',   name: '北平', kana: 'ほくへい',   x: 965,  y: 105, terrain: '幽州重鎮', region: 'north', neighbors: ['xiangping', 'ji', 'nanpi'], basePop: 145000, baseDev: 56, baseCom: 54, baseDef: 72 },
  { id: 'ji',        name: '薊',   kana: 'けい',       x: 840,  y: 112, terrain: '幽州首府', region: 'north', neighbors: ['beiping', 'dai', 'nanpi', 'ye'], basePop: 165000, baseDev: 60, baseCom: 58, baseDef: 72 },
  { id: 'dai',       name: '代',   kana: 'だい',       x: 715,  y: 102, terrain: '塞北軍鎮', region: 'north', neighbors: ['ji', 'jinyang'], basePop: 105000, baseDev: 45, baseCom: 42, baseDef: 66 },
  { id: 'jinyang',   name: '晉陽', kana: 'しんよう',   x: 625,  y: 170, terrain: '并州要塞', region: 'north', neighbors: ['dai', 'ye', 'luoyang', 'changan'], basePop: 155000, baseDev: 58, baseCom: 54, baseDef: 78 },
  { id: 'nanpi',     name: '南皮', kana: 'なんぴ',     x: 895,  y: 185, terrain: '渤海名城', region: 'north', neighbors: ['beiping', 'ji', 'ye', 'pingyuan'], basePop: 175000, baseDev: 66, baseCom: 64, baseDef: 72 },
  { id: 'ye',        name: '鄴',   kana: 'ぎょう',     x: 750,  y: 215, terrain: '冀州大都', region: 'north', neighbors: ['ji', 'jinyang', 'nanpi', 'pingyuan', 'puyang', 'luoyang'], basePop: 235000, baseDev: 76, baseCom: 74, baseDef: 82 },
  { id: 'pingyuan',  name: '平原', kana: 'へいげん',   x: 880,  y: 250, terrain: '河北平川', region: 'north', neighbors: ['nanpi', 'ye', 'beihai', 'puyang'], basePop: 160000, baseDev: 64, baseCom: 62, baseDef: 66 },
  { id: 'beihai',    name: '北海', kana: 'ほっかい',   x: 1015, y: 245, terrain: '青州海港', region: 'east',  neighbors: ['pingyuan', 'xiapi'], basePop: 165000, baseDev: 65, baseCom: 68, baseDef: 65 },
  { id: 'puyang',    name: '濮陽', kana: 'ぼくよう',   x: 785,  y: 295, terrain: '兗州要衝', region: 'center', neighbors: ['ye', 'pingyuan', 'chenliu', 'xiaopei'], basePop: 170000, baseDev: 66, baseCom: 65, baseDef: 70 },
  { id: 'chenliu',   name: '陳留', kana: 'ちんりゅう', x: 690,  y: 318, terrain: '中原四戰', region: 'center', neighbors: ['puyang', 'luoyang', 'xuchang', 'xiaopei'], basePop: 180000, baseDev: 68, baseCom: 70, baseDef: 70 },

  // Central Plains & Guanzhong & Liangzhou (12-24)
  { id: 'luoyang',   name: '洛陽', kana: 'らくよう',   x: 560,  y: 288, terrain: '中原帝都', region: 'center', neighbors: ['jinyang', 'ye', 'chenliu', 'xuchang', 'wan', 'hongnong'], basePop: 280000, baseDev: 78, baseCom: 82, baseDef: 86 },
  { id: 'hongnong',  name: '弘農', kana: 'こうのう',   x: 455,  y: 280, terrain: '函谷關隘', region: 'west',   neighbors: ['luoyang', 'changan', 'wan'], basePop: 135000, baseDev: 55, baseCom: 52, baseDef: 80 },
  { id: 'changan',   name: '長安', kana: 'ちょうあん', x: 350,  y: 278, terrain: '關中帝都', region: 'west',   neighbors: ['jinyang', 'hongnong', 'anding', 'tianshui', 'hanzhong'], basePop: 245000, baseDev: 72, baseCom: 70, baseDef: 84 },
  { id: 'anding',    name: '安定', kana: 'あんてい',   x: 270,  y: 210, terrain: '關西邊防', region: 'west',   neighbors: ['changan', 'tianshui', 'xiliang'], basePop: 120000, baseDev: 50, baseCom: 46, baseDef: 72 },
  { id: 'tianshui',  name: '天水', kana: 'てんすい',   x: 215,  y: 295, terrain: '隴右雄關', region: 'west',   neighbors: ['changan', 'anding', 'xiliang', 'hanzhong', 'zitong'], basePop: 140000, baseDev: 56, baseCom: 52, baseDef: 76 },
  { id: 'xiliang',   name: '西涼', kana: 'せいりょう', x: 115,  y: 175, terrain: '西域高原', region: 'west',   neighbors: ['anding', 'tianshui'], basePop: 115000, baseDev: 46, baseCom: 42, baseDef: 68 },
  { id: 'xuchang',   name: '許昌', kana: 'きょしょう', x: 645,  y: 372, terrain: '中原平川', region: 'center', neighbors: ['luoyang', 'chenliu', 'runan', 'wan', 'xinye'], basePop: 210000, baseDev: 74, baseCom: 75, baseDef: 76 },
  { id: 'runan',     name: '汝南', kana: 'じょなん',   x: 725,  y: 412, terrain: '豫州富邑', region: 'center', neighbors: ['xuchang', 'xiaopei', 'shouchun', 'xinye'], basePop: 165000, baseDev: 66, baseCom: 64, baseDef: 66 },
  { id: 'wan',       name: '宛',   kana: 'えん',       x: 530,  y: 370, terrain: '南陽重鎮', region: 'center', neighbors: ['luoyang', 'hongnong', 'xuchang', 'xinye', 'shangyong'], basePop: 175000, baseDev: 65, baseCom: 64, baseDef: 72 },
  { id: 'xinye',     name: '新野', kana: 'しんや',     x: 560,  y: 432, terrain: '荊北前哨', region: 'center', neighbors: ['xuchang', 'runan', 'wan', 'xiangyang'], basePop: 125000, baseDev: 54, baseCom: 52, baseDef: 62 },
  { id: 'xiaopei',   name: '小沛', kana: 'しょうはい', x: 835,  y: 350, terrain: '徐州門戶', region: 'east',   neighbors: ['puyang', 'chenliu', 'runan', 'xiapi', 'shouchun'], basePop: 145000, baseDev: 60, baseCom: 58, baseDef: 66 },
  { id: 'xiapi',     name: '下邳', kana: 'かひ',       x: 955,  y: 345, terrain: '徐州首府', region: 'east',   neighbors: ['beihai', 'xiaopei', 'shouchun', 'jianye'], basePop: 190000, baseDev: 68, baseCom: 70, baseDef: 74 },
  { id: 'shouchun',  name: '壽春', kana: 'じゅしゅん', x: 855,  y: 428, terrain: '淮南要塞', region: 'east',   neighbors: ['runan', 'xiaopei', 'xiapi', 'lujiang', 'jianye'], basePop: 185000, baseDev: 66, baseCom: 68, baseDef: 76 },

  // Jiangdong & East (25-31)
  { id: 'lujiang',   name: '廬江', kana: 'ろこう',     x: 825,  y: 495, terrain: '江淮水鄉', region: 'east',   neighbors: ['shouchun', 'jianye', 'chaisang', 'jiangxia'], basePop: 155000, baseDev: 62, baseCom: 64, baseDef: 68 },
  { id: 'jianye',    name: '建業', kana: 'けんぎょう', x: 965,  y: 458, terrain: '江南大都', region: 'east',   neighbors: ['xiapi', 'shouchun', 'lujiang', 'wu', 'chaisang'], basePop: 245000, baseDev: 76, baseCom: 80, baseDef: 80 },
  { id: 'wu',        name: '吳',   kana: 'ご',         x: 1065, y: 472, terrain: '江東水城', region: 'east',   neighbors: ['jianye', 'kuaiji'], basePop: 175000, baseDev: 68, baseCom: 78, baseDef: 68 },
  { id: 'kuaiji',    name: '會稽', kana: 'かいけい',   x: 1065, y: 548, terrain: '越地名郡', region: 'east',   neighbors: ['wu', 'jianan', 'yuzhang'], basePop: 160000, baseDev: 64, baseCom: 70, baseDef: 66 },
  { id: 'chaisang',  name: '柴桑', kana: 'さいそう',   x: 845,  y: 560, terrain: '長江水寨', region: 'east',   neighbors: ['lujiang', 'jianye', 'yuzhang', 'jiangxia'], basePop: 150000, baseDev: 60, baseCom: 64, baseDef: 74 },
  { id: 'yuzhang',   name: '豫章', kana: 'よしょう',   x: 870,  y: 635, terrain: '贛江重鎮', region: 'east',   neighbors: ['chaisang', 'kuaiji', 'jianan', 'changsha', 'guiyang'], basePop: 145000, baseDev: 60, baseCom: 62, baseDef: 66 },
  { id: 'jianan',    name: '建安', kana: 'けんあん',   x: 1015, y: 638, terrain: '閩越山城', region: 'east',   neighbors: ['kuaiji', 'yuzhang'], basePop: 115000, baseDev: 50, baseCom: 54, baseDef: 68 },

  // Jingzhou (32-38)
  { id: 'xiangyang', name: '襄陽', kana: 'じょうよう', x: 565,  y: 498, terrain: '荊州首府', region: 'south',  neighbors: ['xinye', 'shangyong', 'jiangxia', 'jiangling'], basePop: 215000, baseDev: 72, baseCom: 72, baseDef: 82 },
  { id: 'jiangxia',  name: '江夏', kana: 'こうか',     x: 715,  y: 515, terrain: '漢水江防', region: 'south',  neighbors: ['lujiang', 'chaisang', 'xiangyang', 'jiangling', 'changsha'], basePop: 170000, baseDev: 64, baseCom: 66, baseDef: 74 },
  { id: 'jiangling', name: '江陵', kana: 'こうりょう', x: 590,  y: 565, terrain: '荊南大城', region: 'south',  neighbors: ['xiangyang', 'jiangxia', 'yongan', 'wuling', 'changsha'], basePop: 195000, baseDev: 68, baseCom: 68, baseDef: 78 },
  { id: 'wuling',    name: '武陵', kana: 'ぶりょう',   x: 545,  y: 632, terrain: '五溪山城', region: 'south',  neighbors: ['jiangling', 'changsha', 'lingling', 'jiangzhou'], basePop: 120000, baseDev: 52, baseCom: 50, baseDef: 66 },
  { id: 'changsha',  name: '長沙', kana: 'ちょうさ',   x: 705,  y: 615, terrain: '湘江名鎮', region: 'south',  neighbors: ['jiangxia', 'jiangling', 'wuling', 'yuzhang', 'lingling', 'guiyang'], basePop: 165000, baseDev: 64, baseCom: 66, baseDef: 68 },
  { id: 'lingling',  name: '零陵', kana: 'れいりょう', x: 615,  y: 692, terrain: '瀟湘南郡', region: 'south',  neighbors: ['wuling', 'changsha', 'guiyang', 'jiaozhi'], basePop: 120000, baseDev: 54, baseCom: 52, baseDef: 64 },
  { id: 'guiyang',   name: '桂陽', kana: 'けいよう',   x: 750,  y: 695, terrain: '嶺南門戶', region: 'south',  neighbors: ['changsha', 'lingling', 'yuzhang', 'jiaozhi'], basePop: 115000, baseDev: 52, baseCom: 54, baseDef: 62 },

  // Bashu, Hanzhong, Nanzhong & Jiaozhou (39-46)
  { id: 'shangyong', name: '上庸', kana: 'じょうよう', x: 435,  y: 425, terrain: '漢東山城', region: 'west',   neighbors: ['wan', 'xiangyang', 'hanzhong'], basePop: 105000, baseDev: 48, baseCom: 44, baseDef: 74 },
  { id: 'hanzhong',  name: '漢中', kana: 'かんちゅう', x: 315,  y: 405, terrain: '秦嶺天險', region: 'west',   neighbors: ['changan', 'tianshui', 'shangyong', 'zitong', 'yongan'], basePop: 155000, baseDev: 62, baseCom: 56, baseDef: 84 },
  { id: 'zitong',    name: '梓潼', kana: 'しとう',     x: 225,  y: 472, terrain: '劍閣關隘', region: 'west',   neighbors: ['tianshui', 'hanzhong', 'chengdu'], basePop: 135000, baseDev: 58, baseCom: 54, baseDef: 82 },
  { id: 'chengdu',   name: '成都', kana: 'せいと',     x: 175,  y: 558, terrain: '天府之國', region: 'west',   neighbors: ['zitong', 'jiangzhou', 'jianning'], basePop: 260000, baseDev: 82, baseCom: 78, baseDef: 84 },
  { id: 'yongan',    name: '永安', kana: 'えいあん',   x: 425,  y: 530, terrain: '三峽白帝', region: 'west',   neighbors: ['hanzhong', 'jiangling', 'jiangzhou'], basePop: 130000, baseDev: 54, baseCom: 52, baseDef: 82 },
  { id: 'jiangzhou', name: '江州', kana: 'こうしゅう', x: 315,  y: 595, terrain: '巴郡水都', region: 'west',   neighbors: ['chengdu', 'yongan', 'wuling', 'jianning'], basePop: 155000, baseDev: 62, baseCom: 60, baseDef: 74 },
  { id: 'jianning',  name: '建寧', kana: 'けんねい',   x: 215,  y: 682, terrain: '南中蠻嶺', region: 'west',   neighbors: ['chengdu', 'jiangzhou', 'jiaozhi'], basePop: 110000, baseDev: 46, baseCom: 42, baseDef: 72 },
  { id: 'jiaozhi',   name: '交趾', kana: 'こうし',     x: 455,  y: 715, terrain: '南海重鎮', region: 'south',  neighbors: ['jianning', 'lingling', 'guiyang'], basePop: 130000, baseDev: 56, baseCom: 62, baseDef: 64 }
];

// Default home city for unassigned generals of each camp so all 311 generals appear in every scenario
const HOME_CITY_BY_CAMP = {
  cao: ['xuchang', 'chenliu', 'luoyang', 'puyang', 'ye', 'runan'],
  liu: ['xiaopei', 'xinye', 'chengdu', 'jiangling', 'hanzhong', 'zitong'],
  sun: ['jianye', 'wu', 'chaisang', 'kuaiji', 'yuzhang', 'lujiang'],
  yuan: ['ye', 'nanpi', 'pingyuan', 'shouchun', 'jinyang'],
  dong: ['luoyang', 'changan', 'hongnong', 'anding'],
  lubu: ['xiapi', 'xiaopei', 'puyang'],
  ma: ['xiliang', 'tianshui', 'anding'],
  biao: ['xiangyang', 'jiangxia', 'jiangling', 'changsha'],
  zhang: ['chengdu', 'zitong', 'jiangzhou', 'yongan'],
  gongsun: ['beiping', 'xiangping', 'ji', 'dai'],
  tao: ['xiapi', 'xiaopei'],
  kong: ['beihai'],
  liuyao: ['jianye', 'chaisang'],
  wanglang: ['kuaiji', 'wu'],
  zhanglu: ['hanzhong', 'shangyong'],
  shixie: ['jiaozhi', 'guiyang'],
  meng: ['jianning', 'wuling'],
  free: ['xiangyang', 'luoyang', 'beihai', 'chengdu', 'jianye']
};

window.RTK3.SCENARIOS = [
  {
    id: '189',
    year: 189,
    month: 9,
    title: '189年 董卓專橫',
    jpTitle: '董卓専横（反董卓連合）',
    subtitle: '董卓挾天子據司隸・關中，十八路諸侯群起討伐暴政！46城311將群雄並起！',
    difficultyInfo: '推薦：曹操・孫堅・袁紹 / 挑戰：劉備・孔融・孟獲',
    playableRulers: ['cao', 'liu', 'sun_jian', 'dong', 'yuan', 'ma', 'biao', 'gongsunzan', 'taoqian', 'kongrong', 'zhang', 'shixie'],
    citySetup: {
      luoyang:   { owner: 'dong', gold: 3200, food: 4800, troops: 15000, gens: ['dongzhuo', 'lubu', 'liru', 'huaxiong', 'xurong', 'dongmin'] },
      hongnong:  { owner: 'dong', gold: 2000, food: 3200, troops: 9000,  gens: ['lijue', 'guosi', 'fanchou', 'huzhen'] },
      changan:   { owner: 'dong', gold: 2600, food: 4000, troops: 11000, gens: ['jiaxu', 'zhangji_dz', 'niufu', 'gaoshun'] },
      anding:    { owner: 'dong', gold: 1500, food: 2400, troops: 6500,  gens: ['zhangxiu', 'zhangliao'] },
      xiliang:   { owner: 'ma', gold: 1600, food: 2600, troops: 9000, gens: ['mateng', 'machao', 'pangde', 'hansui'] },
      tianshui:  { owner: 'ma', gold: 1300, food: 2200, troops: 6500, gens: ['chengyi', 'yanxing', 'maxiu'] },
      beiping:   { owner: 'gongsunzan', gold: 1700, food: 2600, troops: 9000, gens: ['gongsunzan', 'gongsunyue', 'zhaoyun', 'tiankai', 'yankang'] },
      xiangping: { owner: 'gongsundu', gold: 1400, food: 2200, troops: 6200, gens: ['gongsundu', 'gongsun_kang'] },
      ye:        { owner: 'yuan', gold: 2600, food: 3800, troops: 12000, gens: ['yuanshao', 'yanliang', 'wenchou', 'tianfeng', 'jushou'] },
      nanpi:     { owner: 'yuan', gold: 1800, food: 2700, troops: 8000,  gens: ['yuantan', 'shenpei', 'pangji', 'zhanghe'] },
      pingyuan:  { owner: 'liu', gold: 1400, food: 2200, troops: 6800, gens: ['liubei', 'guanyu', 'zhangfei', 'jianyou', 'sunqian'] },
      beihai:    { owner: 'kongrong', gold: 1500, food: 2400, troops: 5800, gens: ['kongrong', 'taishici_alt', 'zongbao'] },
      chenliu:   { owner: 'cao', gold: 2100, food: 3100, troops: 9500, gens: ['caocao', 'xiahoudun', 'xiahouyuan', 'caoren', 'caohong', 'xunyu'] },
      puyang:    { owner: 'cao', gold: 1600, food: 2400, troops: 6800, gens: ['yuejin', 'lidian', 'yujin'] },
      wan:       { owner: 'yuanshu', gold: 2200, food: 3400, troops: 9200, gens: ['yuanshu', 'jiling', 'yanxiang', 'zhangxun'] },
      xiapi:     { owner: 'taoqian', gold: 1800, food: 2900, troops: 7200, gens: ['taoqian', 'caobao', 'mizhu', 'chendeng', 'chengui'] },
      xiaopei:   { owner: 'taoqian', gold: 1300, food: 2200, troops: 5200, gens: ['zangba'] },
      changsha:  { owner: 'sun_jian', gold: 1900, food: 2900, troops: 9500, gens: ['sunjian', 'sunce', 'chengpu', 'huanggai', 'handang', 'zhuzhi'] },
      xiangyang: { owner: 'biao', gold: 2000, food: 3200, troops: 8800, gens: ['liubiao', 'kuaiyue', 'kuailiang', 'caimao', 'wenpin'] },
      jiangxia:  { owner: 'biao', gold: 1500, food: 2400, troops: 6500, gens: ['huangzu', 'zhangyun'] },
      jianye:    { owner: 'liuyao', gold: 1600, food: 2500, troops: 6800, gens: ['liuyao', 'zhangying', 'taishici', 'ze_rong'] },
      kuaiji:    { owner: 'wanglang', gold: 1500, food: 2400, troops: 5800, gens: ['wanglang', 'yanbaihu', 'yanyu'] },
      hanzhong:  { owner: 'zhanglu', gold: 1500, food: 2600, troops: 6800, gens: ['zhanglu', 'zhangwei', 'yanpu'] },
      chengdu:   { owner: 'zhang', gold: 2200, food: 3800, troops: 8800, gens: ['liuyan', 'liuzhang', 'zhangren', 'yanyan', 'huangquan'] },
      jianning:  { owner: 'menghuo', gold: 1200, food: 2200, troops: 7200, gens: ['menghuo', 'zhurong'] },
      jiaozhi:   { owner: 'shixie', gold: 1600, food: 2800, troops: 6400, gens: ['shixie', 'shiyi', 'shihui'] }
    }
  },
  {
    id: '194',
    year: 194,
    month: 4,
    title: '194年 群雄割據',
    jpTitle: '群雄割拠',
    subtitle: '曹操據兗豫迎天子、呂布襲徐州、孫策平江東、袁紹統一河北，46城群雄大混戰！',
    difficultyInfo: '經典亂戰：曹操・劉備・孫策・呂布・袁紹',
    playableRulers: ['cao', 'liu', 'sun_ce', 'lubu', 'yuan', 'yuanshu', 'biao', 'ma', 'gongsunzan', 'zhang'],
    citySetup: {
      xuchang:   { owner: 'cao', gold: 2400, food: 3600, troops: 11500, gens: ['caocao', 'xunyu', 'xunyou', 'guojia', 'dianwei', 'xuchu'] },
      chenliu:   { owner: 'cao', gold: 1800, food: 2800, troops: 8500,  gens: ['xiahoudun', 'xiahouyuan', 'caoren', 'caohong', 'chengyu'] },
      luoyang:   { owner: 'cao', gold: 1900, food: 2900, troops: 8000,  gens: ['xuhuang', 'yuejin', 'lidian', 'manchong'] },
      ye:        { owner: 'yuan', gold: 2800, food: 4200, troops: 14000, gens: ['yuanshao', 'yanliang', 'wenchou', 'tianfeng', 'jushou', 'zhanghe'] },
      nanpi:     { owner: 'yuan', gold: 1800, food: 2800, troops: 8500,  gens: ['yuantan', 'shenpei', 'gouliang'] },
      pingyuan:  { owner: 'yuan', gold: 1600, food: 2500, troops: 7500,  gens: ['yuanxi', 'guotu', 'pangji'] },
      jinyang:   { owner: 'yuan', gold: 1500, food: 2400, troops: 6800,  gens: ['gaogan', 'chunyu_qiong'] },
      beiping:   { owner: 'gongsunzan', gold: 1700, food: 2600, troops: 8800, gens: ['gongsunzan', 'gongsunyue', 'tiankai', 'yankang'] },
      ji:        { owner: 'gongsunzan', gold: 1500, food: 2300, troops: 6800, gens: ['zhaoyun'] },
      xiangping: { owner: 'gongsundu', gold: 1400, food: 2200, troops: 6500, gens: ['gongsundu', 'gongsun_kang'] },
      xiapi:     { owner: 'lubu', gold: 1800, food: 2700, troops: 10500, gens: ['lubu', 'zhangliao', 'gaoshun', 'chengong'] },
      puyang:    { owner: 'lubu', gold: 1500, food: 2200, troops: 7200,  gens: ['haomeng', 'caoxing', 'songxian', 'weixu', 'houcheng'] },
      xiaopei:   { owner: 'liu', gold: 1500, food: 2400, troops: 7600, gens: ['liubei', 'guanyu', 'zhangfei', 'jianyou', 'sunqian', 'mizhu'] },
      shouchun:  { owner: 'yuanshu', gold: 2300, food: 3500, troops: 10500, gens: ['yuanshu', 'jiling', 'yanxiang', 'yanghong', 'zhangxun'] },
      jianye:    { owner: 'sun_ce', gold: 2200, food: 3300, troops: 10500, gens: ['sunce', 'zhouyu', 'taishici', 'chengpu', 'huanggai', 'zhangzhao'] },
      wu:        { owner: 'sun_ce', gold: 1700, food: 2600, troops: 7200,  gens: ['sunquan', 'lusu', 'lumeng', 'zhoutai', 'zhanghong'] },
      kuaiji:    { owner: 'wanglang', gold: 1500, food: 2400, troops: 6000, gens: ['wanglang', 'yufan', 'yanbaihu'] },
      xiangyang: { owner: 'biao', gold: 2100, food: 3400, troops: 9200, gens: ['liubiao', 'kuaiyue', 'kuailiang', 'caimao', 'wenpin'] },
      jiangxia:  { owner: 'biao', gold: 1500, food: 2400, troops: 6800, gens: ['huangzu', 'ganning', 'zhangyun'] },
      wan:       { owner: 'dong', gold: 1600, food: 2400, troops: 7200, gens: ['zhangxiu', 'jiaxu'] },
      changan:   { owner: 'dong', gold: 1800, food: 2700, troops: 8000, gens: ['lijue', 'guosi', 'fanchou'] },
      xiliang:   { owner: 'ma', gold: 1700, food: 2700, troops: 9400, gens: ['mateng', 'machao', 'pangde', 'hansui', 'madai'] },
      tianshui:  { owner: 'ma', gold: 1400, food: 2200, troops: 6800, gens: ['yanxing', 'chengyi'] },
      hanzhong:  { owner: 'zhanglu', gold: 1600, food: 2700, troops: 7200, gens: ['zhanglu', 'zhangwei', 'yanpu'] },
      chengdu:   { owner: 'zhang', gold: 2300, food: 4000, troops: 9500, gens: ['liuzhang', 'zhangren', 'fazheng', 'yanyan', 'huangquan'] },
      jianning:  { owner: 'menghuo', gold: 1300, food: 2200, troops: 7200, gens: ['menghuo', 'zhurong'] },
      jiaozhi:   { owner: 'shixie', gold: 1600, food: 2800, troops: 6500, gens: ['shixie', 'shiyi', 'shihui'] }
    }
  },
  {
    id: '207',
    year: 207,
    month: 10,
    title: '207年 三顧茅廬',
    jpTitle: '三顧の礼（赤壁前夜）',
    subtitle: '曹操平定北方大舉南征，劉備駐新野得臥龍孔明，孫權據江東抗衡天下！',
    difficultyInfo: '三強鼎立：曹操（北方霸主）・劉備（新野逆襲）・孫權（江東六郡）',
    playableRulers: ['cao', 'liu', 'sun_quan', 'biao', 'zhang', 'ma', 'zhanglu', 'shixie'],
    citySetup: {
      ye:        { owner: 'cao', gold: 3200, food: 4800, troops: 15000, gens: ['caocao', 'zhangliao', 'zhanghe', 'guojia', 'xunyou', 'caopi'] },
      nanpi:     { owner: 'cao', gold: 2000, food: 3000, troops: 9000,  gens: ['yujin', 'lidian', 'zhuling'] },
      beiping:   { owner: 'cao', gold: 1700, food: 2600, troops: 7500,  gens: ['caozhang', 'caoxiu'] },
      ji:        { owner: 'cao', gold: 1600, food: 2500, troops: 7000,  gens: ['xuhuang', 'tianfeng'] },
      xuchang:   { owner: 'cao', gold: 2800, food: 4200, troops: 13500, gens: ['xunyu', 'simayi', 'xuchu', 'jiaxu', 'manchong', 'chenqun'] },
      chenliu:   { owner: 'cao', gold: 2000, food: 3000, troops: 9000,  gens: ['caoren', 'caohong', 'yuejin'] },
      luoyang:   { owner: 'cao', gold: 2400, food: 3500, troops: 10500, gens: ['xiahoudun', 'xiahouyuan', 'chengyu', 'zhongyao'] },
      changan:   { owner: 'cao', gold: 1900, food: 2900, troops: 8500,  gens: ['caozhen', 'zhangji', 'guohuai'] },
      xiapi:     { owner: 'cao', gold: 1800, food: 2800, troops: 8000,  gens: ['zangba', 'lvqian'] },
      shouchun:  { owner: 'cao', gold: 1900, food: 2900, troops: 8800,  gens: ['liuye', 'jiangji', 'zhangxiu'] },
      wan:       { owner: 'cao', gold: 1700, food: 2600, troops: 8200,  gens: ['caochun', 'wenpin'] },
      xinye:     { owner: 'liu', gold: 1700, food: 2800, troops: 8500, gens: ['liubei', 'guanyu', 'zhangfei', 'zhaoyun', 'zhugeliang', 'xushu', 'chendao'] },
      jianye:    { owner: 'sun_quan', gold: 2600, food: 4000, troops: 12500, gens: ['sunquan', 'zhouyu', 'lusu', 'zhangzhao', 'zhanghong', 'guzhongs'] },
      wu:        { owner: 'sun_quan', gold: 1900, food: 2900, troops: 8000,  gens: ['lumeng', 'luxun', 'zhutai_alt', 'zhugejin'].filter(x=>x!=='zhutai_alt').concat(['zhoutai']) },
      kuaiji:    { owner: 'sun_quan', gold: 1600, food: 2500, troops: 7000,  gens: ['heqi', 'yufan', 'ludai'] },
      chaisang:  { owner: 'sun_quan', gold: 2000, food: 3100, troops: 9800,  gens: ['taishici', 'ganning', 'huanggai', 'chengpu', 'lingtong'] },
      lujiang:   { owner: 'sun_quan', gold: 1600, food: 2500, troops: 7500,  gens: ['xusheng', 'dingfeng', 'jiangqin'] },
      xiangyang: { owner: 'biao', gold: 2100, food: 3400, troops: 9200, gens: ['liubiao', 'kuaiyue', 'caimao', 'zhangyun', 'liuzong'] },
      jiangxia:  { owner: 'biao', gold: 1600, food: 2500, troops: 7000, gens: ['huangzu', 'liuchi'] },
      jiangling: { owner: 'biao', gold: 1600, food: 2600, troops: 7200, gens: ['pangtong', 'yiji', 'maliang'] },
      changsha:  { owner: 'biao', gold: 1400, food: 2300, troops: 6800, gens: ['huangzhong', 'weiyan', 'hanxuan'] },
      chengdu:   { owner: 'zhang', gold: 2500, food: 4400, troops: 11000, gens: ['liuzhang', 'zhangren', 'fazheng', 'yanyan', 'huangquan', 'liyan'] },
      zitong:    { owner: 'zhang', gold: 1500, food: 2600, troops: 7000,  gens: ['zhangsong', 'mengda', 'wuyi'] },
      hanzhong:  { owner: 'zhanglu', gold: 1600, food: 2800, troops: 7500, gens: ['zhanglu', 'zhangwei', 'yanpu', 'yangren'] },
      xiliang:   { owner: 'ma', gold: 1800, food: 2800, troops: 9800, gens: ['mateng', 'machao', 'pangde', 'madai', 'hansui'] },
      xiangping: { owner: 'gongsundu', gold: 1400, food: 2200, troops: 6400, gens: ['gongsun_kang'] },
      jianning:  { owner: 'menghuo', gold: 1300, food: 2200, troops: 7400, gens: ['menghuo', 'zhurong'] },
      jiaozhi:   { owner: 'shixie', gold: 1700, food: 2900, troops: 6800, gens: ['shixie', 'shiyi', 'shihui'] }
    }
  }
];

// Automatically populate every scenario's freeGenerals with ALL remaining generals from the 311 roster
(function assignRemainingGeneralsToFreePool() {
  const allGens = window.RTK3.GENERALS_TEMPLATE || [];
  window.RTK3.SCENARIOS.forEach(scen => {
    const used = new Set();
    Object.values(scen.citySetup).forEach(st => {
      st.gens.forEach(gid => used.add(gid));
    });
    const freeMap = {};
    let fallbackIdx = 0;
    allGens.forEach(g => {
      if (used.has(g.id)) return;
      const poolCities = HOME_CITY_BY_CAMP[g.camp] || HOME_CITY_BY_CAMP.free;
      const cid = poolCities[fallbackIdx % poolCities.length];
      fallbackIdx += 1;
      if (!freeMap[cid]) freeMap[cid] = [];
      freeMap[cid].push(g.id);
    });
    scen.freeGenerals = freeMap;
  });
})();
