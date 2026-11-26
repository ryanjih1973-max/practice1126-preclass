// JLPT N5 Vocabulary integrated directly into the Sangokushi III UI
// Every entry maps to an actual interface element, status, command, or battle term.
window.RTK3 = window.RTK3 || {};

window.RTK3.N5_VOCAB = [
  // === Time & Calendar (時間・暦) ===
  { id: 'nen', kanji: '年', kana: 'ねん', romaji: 'nen', pos: '名詞', meaning: '年', category: '時間', uiTag: '紀年', example: '今は189年です。', exMean: '現在是189年。' },
  { id: 'gatsu', kanji: '月', kana: 'がつ', romaji: 'gatsu', pos: '名詞', meaning: '月（月份）', category: '時間', uiTag: '月份', example: '四月に戦争が始まります。', exMean: '四月開始戰爭。' },
  { id: 'haru', kanji: '春', kana: 'はる', romaji: 'haru', pos: '名詞', meaning: '春天', category: '時間', uiTag: '季節', example: '春は新しい仕事の時間です。', exMean: '春天是新工作的時刻。' },
  { id: 'natsu', kanji: '夏', kana: 'なつ', romaji: 'natsu', pos: '名詞', meaning: '夏天', category: '時間', uiTag: '季節', example: '夏は天気が暑いです。', exMean: '夏天天氣很熱。' },
  { id: 'aki', kanji: '秋', kana: 'あき', romaji: 'aki', pos: '名詞', meaning: '秋天', category: '時間', uiTag: '季節', example: '秋に食べ物をたくさん作ります。', exMean: '秋天會生產很多糧食。' },
  { id: 'fuyu', kanji: '冬', kana: 'ふゆ', romaji: 'fuyu', pos: '名詞', meaning: '冬天', category: '時間', uiTag: '季節', example: '冬は寒いから、町を守ります。', exMean: '因為冬天寒冷，所以守護城鎮。' },
  { id: 'tenki', kanji: '天気', kana: 'てんき', romaji: 'tenki', pos: '名詞', meaning: '天氣', category: '時間', uiTag: '戰場天氣', example: '今日の天気は晴れです。', exMean: '今天的天氣是晴天。' },
  { id: 'hare', kanji: '晴れ', kana: 'はれ', romaji: 'hare', pos: '名詞', meaning: '晴天', category: '時間', uiTag: '天氣', example: '晴れの日に出征します。', exMean: '在晴天出征。' },
  { id: 'ame', kanji: '雨', kana: 'あめ', romaji: 'ame', pos: '名詞', meaning: '雨 / 下雨', category: '時間', uiTag: '天氣', example: '雨の日は火を使いません。', exMean: '下雨天不使用火計。' },
  { id: 'kaze', kanji: '風', kana: 'かぜ', romaji: 'kaze', pos: '名詞', meaning: '風', category: '時間', uiTag: '天氣', example: '強い風が吹きます。', exMean: '吹起強風。' },
  { id: 'ima', kanji: '今', kana: 'いま', romaji: 'ima', pos: '名詞', meaning: '現在', category: '時間', uiTag: '現在回合', example: '今、曹操の番です。', exMean: '現在是曹操的回合。' },
  { id: 'jikan', kanji: '時間', kana: 'じかん', romaji: 'jikan', pos: '名詞', meaning: '時間', category: '時間', uiTag: '戰場日數', example: '時間がありません。急ぎましょう。', exMean: '沒有時間了，快點吧。' },

  // === Geography & Directions (場所・方角) ===
  { id: 'kuni', kanji: '国', kana: 'くに', romaji: 'kuni', pos: '名詞', meaning: '國家 / 領土', category: '地理', uiTag: '勢力國數', example: '大きな国を作りたいです。', exMean: '想建立強大的國家。' },
  { id: 'machi', kanji: '町', kana: 'まち', romaji: 'machi', pos: '名詞', meaning: '城鎮 / 都市', category: '地理', uiTag: '都市', example: 'この町は人が多くて賑やかです。', exMean: '這座城鎮人很多很熱鬧。' },
  { id: 'yama', kanji: '山', kana: 'やま', romaji: 'yama', pos: '名詞', meaning: '山', category: '地理', uiTag: '戰場地形', example: '山の上から敵を見ます。', exMean: '從山上觀察敵人。' },
  { id: 'kawa', kanji: '川', kana: 'かわ', romaji: 'kawa', pos: '名詞', meaning: '河川', category: '地理', uiTag: '戰場地形', example: '川の近くは水が危ないです。', exMean: '河川附近水患危險。' },
  { id: 'mori', kanji: '森', kana: 'もり', romaji: 'mori', pos: '名詞', meaning: '森林', category: '地理', uiTag: '戰場地形', example: '森の中に兵がいます。', exMean: '森林裡有士兵。' },
  { id: 'michi', kanji: '道', kana: 'みち', romaji: 'michi', pos: '名詞', meaning: '道路', category: '地理', uiTag: '行軍路線', example: 'この道は洛陽へ行きます。', exMean: '這條路通往洛陽。' },
  { id: 'kita', kanji: '北', kana: 'きた', romaji: 'kita', pos: '名詞', meaning: '北方', category: '方角', uiTag: '方向指示', example: '北の町へ行きましょう。', exMean: '往北邊的城鎮出發吧。' },
  { id: 'minami', kanji: '南', kana: 'みなみ', romaji: 'minami', pos: '名詞', meaning: '南方', category: '方角', uiTag: '方向指示', example: '南は川が多いです。', exMean: '南方有很多河川。' },
  { id: 'higashi', kanji: '東', kana: 'ひがし', romaji: 'higashi', pos: '名詞', meaning: '東方', category: '方角', uiTag: '方向指示', example: '東から太陽が出ます。', exMean: '太陽從東方升起。' },
  { id: 'nishi', kanji: '西', kana: 'にし', romaji: 'nishi', pos: '名詞', meaning: '西方', category: '方角', uiTag: '方向指示', example: '西の山に敵がいます。', exMean: '西邊的山裡有敵人。' },
  { id: 'ue', kanji: '上', kana: 'うえ', romaji: 'ue', pos: '名詞', meaning: '上面', category: '方角', uiTag: '戰術位置', example: '城の上に旗があります。', exMean: '城堡上面有旗幟。' },
  { id: 'shita', kanji: '下', kana: 'した', romaji: 'shita', pos: '名詞', meaning: '下面', category: '方角', uiTag: '戰術位置', example: '山の下で待ちます。', exMean: '在山下等待。' },
  { id: 'naka', kanji: '中', kana: 'なか', romaji: 'naka', pos: '名詞', meaning: '裡面', category: '方角', uiTag: '城內', example: '城の中に入ります。', exMean: '進入城裡。' },
  { id: 'soto', kanji: '外', kana: 'そと', romaji: 'soto', pos: '名詞', meaning: '外面', category: '方角', uiTag: '城外', example: '城の外に敵が来ました。', exMean: '敵人來到城外了。' },

  // === Resources & People (資源・人物) ===
  { id: 'okane', kanji: 'お金', kana: 'おかね', romaji: 'okane', pos: '名詞', meaning: '金錢 / 軍資金', category: '資源', uiTag: '金（軍資金）', example: 'お金が足りないから、商業をします。', exMean: '因為錢不夠，所以發展商業。' },
  { id: 'tabemono', kanji: '食べ物', kana: 'たべもの', romaji: 'tabemono', pos: '名詞', meaning: '食物 / 兵糧', category: '資源', uiTag: '兵糧', example: '兵士に食べ物をあげます。', exMean: '給士兵們食物（兵糧）。' },
  { id: 'hito', kanji: '人', kana: 'ひと', romaji: 'hito', pos: '名詞', meaning: '人 / 人口・將領', category: '人物', uiTag: '人口 / 武將', example: '強い人がたくさんいます。', exMean: '有很多強大的人才。' },
  { id: 'namae', kanji: '名前', kana: 'なまえ', romaji: 'namae', pos: '名詞', meaning: '名字', category: '人物', uiTag: '武將姓名', example: 'あなたの名前は何ですか。', exMean: '你的名字是什麼？' },
  { id: 'shigoto', kanji: '仕事', kana: 'しごと', romaji: 'shigoto', pos: '名詞', meaning: '工作 / 內政任務', category: '行動', uiTag: '內政選單', example: '今日は町の仕事をします。', exMean: '今天做城鎮的內政工作。' },
  { id: 'uma', kanji: '馬', kana: 'うま', romaji: 'uma', pos: '名詞', meaning: '馬（騎兵）', category: '資源', uiTag: '騎兵移動', example: '馬に乗ると、速く行きます。', exMean: '騎馬的話會走得很快。' },

  // === Core N5 Verbs mapped to Commands (動詞・指令) ===
  { id: 'tsukuru', kanji: '作る', kana: 'つくる', romaji: 'tsukuru', pos: '動詞', meaning: '製作 / 建設開墾', category: '動詞', uiTag: '開墾・建設', example: '田畑を作って、食べ物が増えます。', exMean: '開墾農田，糧食就會增加。' },
  { id: 'kau', kanji: '買う', kana: 'かう', romaji: 'kau', pos: '動詞', meaning: '買 / 徵兵採購', category: '動詞', uiTag: '買糧 / 徵兵', example: 'お金で食べ物を買います。', exMean: '用錢買糧食。' },
  { id: 'iku', kanji: '行く', kana: 'いく', romaji: 'iku', pos: '動詞', meaning: '去 / 出征', category: '動詞', uiTag: '出征・移動', example: 'みんなで洛陽へ行きます！', exMean: '大家一起去洛陽吧！' },
  { id: 'kuru', kanji: '来る', kana: 'くる', romaji: 'kuru', pos: '動詞', meaning: '來', category: '動詞', uiTag: '敵軍來襲', example: '敵の軍がこちらに来ます！', exMean: '敵軍朝這邊來了！' },
  { id: 'miru', kanji: '見る', kana: 'みる', romaji: 'miru', pos: '動詞', meaning: '看 / 偵察情報', category: '動詞', uiTag: '情報・偵察', example: '敵の町の情報を見ます。', exMean: '查看敵城的情報。' },
  { id: 'hanasu', kanji: '話す', kana: 'はなす', romaji: 'hanasu', pos: '動詞', meaning: '說話 / 外交交涉', category: '動詞', uiTag: '外交・登用', example: '孫権と平和について話します。', exMean: '和孫權談論和平外交。' },
  { id: 'kiku', kanji: '聞く', kana: 'きく', romaji: 'kiku', pos: '動詞', meaning: '聽 / 詢問軍師', category: '動詞', uiTag: '軍師助言', example: '軍師の話をよく聞きます。', exMean: '仔細聽軍師的話。' },
  { id: 'tsukau', kanji: '使う', kana: 'つかう', romaji: 'tsukau', pos: '動詞', meaning: '使用 / 施展計謀', category: '動詞', uiTag: '使用計謀/物資', example: 'ここで火の計を使います。', exMean: '在這裡使用火計。' },
  { id: 'yasumu', kanji: '休む', kana: 'やすむ', romaji: 'yasumu', pos: '動詞', meaning: '休息 / 結束回合', category: '動詞', uiTag: '待機・結束回合', example: '今月はこれで休みます。', exMean: '這個月就到此結束回合休息。' },
  { id: 'matsu', kanji: '待つ', kana: 'まつ', romaji: 'matsu', pos: '動詞', meaning: '等待 / 待機', category: '動詞', uiTag: '戰場待機', example: '城の中で敵を待ちます。', exMean: '在城裡面等待敵人。' },
  { id: 'hairu', kanji: '入る', kana: 'はいる', romaji: 'hairu', pos: '動詞', meaning: '進入 / 進城', category: '動詞', uiTag: '入城・登錄', example: '新しい武将が仲間に入りました。', exMean: '新的武將加入夥伴了。' },
  { id: 'deru', kanji: '出る', kana: 'でる', romaji: 'deru', pos: '動詞', meaning: '出去 / 出陣', category: '動詞', uiTag: '出陣', example: '門から外に出ます。', exMean: '從城門出去。' },
  { id: 'ageru', kanji: 'あげる', kana: 'あげる', romaji: 'ageru', pos: '動詞', meaning: '給 / 賞賜施捨', category: '動詞', uiTag: '施捨・賞賜', example: '民に食べ物をあげます。', exMean: '施捨糧食給人民。' },
  { id: 'morau', kanji: 'もらう', kana: 'もらう', romaji: 'morau', pos: '動詞', meaning: '收到 / 徵稅收穫', category: '動詞', uiTag: '稅收・收穫', example: '町からたくさんお金をもらいます。', exMean: '從城鎮收到很多稅金。' },
  { id: 'wakaru', kanji: '分かる', kana: 'わかる', romaji: 'wakaru', pos: '動詞', meaning: '明白 / 了解', category: '動詞', uiTag: '學習確認', example: '日本語の意味が分かりました！', exMean: '明白日文的意思了！' },
  { id: 'hajimeru', kanji: '始める', kana: 'はじめる', romaji: 'hajimeru', pos: '動詞', meaning: '開始', category: '動詞', uiTag: '開始遊戲', example: '新しい物語を始めましょう。', exMean: '開始新的故事吧。' },
  { id: 'owaru', kanji: '終わる', kana: 'おわる', romaji: 'owaru', pos: '動詞', meaning: '結束', category: '動詞', uiTag: '回合結束', example: 'このターンが終わります。', exMean: '這個回合結束。' },

  // === Adjectives for Stats & Status (形容詞・狀態) ===
  { id: 'tsuyoi', kanji: '強い', kana: 'つよい', romaji: 'tsuyoi', pos: 'い形容詞', meaning: '強的', category: '狀態', uiTag: '武力 / 兵力高', example: '呂布はとても強い武将です。', exMean: '呂布是非常強的武將。' },
  { id: 'yowai', kanji: '弱い', kana: 'よわい', romaji: 'yowai', pos: 'い形容詞', meaning: '弱的', category: '狀態', uiTag: '兵力弱', example: '兵が少ないから、まだ弱いです。', exMean: '因為士兵少，現在還很弱。' },
  { id: 'ooi', kanji: '多い', kana: 'おおい', romaji: 'ooi', pos: 'い形容詞', meaning: '多的', category: '狀態', uiTag: '資源充足', example: 'この国はお金が多いです。', exMean: '這個國家錢很多。' },
  { id: 'sukunai', kanji: '少ない', kana: 'すくない', romaji: 'sukunai', pos: 'い形容詞', meaning: '少的', category: '狀態', uiTag: '兵糧不足', example: '食べ物が少ないから気をつけて。', exMean: '糧食很少，請小心。' },
  { id: 'takai', kanji: '高い', kana: 'たかい', romaji: 'takai', pos: 'い形容詞', meaning: '高的 / 貴的', category: '狀態', uiTag: '忠誠 / 士氣高', example: '兵士の士気が高いです。', exMean: '士兵的士氣很高。' },
  { id: 'hikui', kanji: '低い', kana: 'ひくい', romaji: 'hikui', pos: 'い形容詞', meaning: '低的', category: '狀態', uiTag: '忠誠 / 城防低', example: '城の守りが低いです。', exMean: '城堡的防禦很低。' },
  { id: 'hayai', kanji: '速い', kana: 'はやい', romaji: 'hayai', pos: 'い形容詞', meaning: '快的', category: '狀態', uiTag: '機動力', example: '騎馬隊は足が速いです。', exMean: '騎兵隊移動速度很快。' },
  { id: 'atarashii', kanji: '新しい', kana: 'あたらしい', romaji: 'atarashii', pos: 'い形容詞', meaning: '新的', category: '狀態', uiTag: '新劇本/新武將', example: '新しい城を取りました。', exMean: '奪取了新的城堡。' },
  { id: 'ookii', kanji: '大きい', kana: 'おおきい', romaji: 'ookii', pos: 'い形容詞', meaning: '大的', category: '狀態', uiTag: '大都市', example: '洛陽は大きい都市です。', exMean: '洛陽是很大的都市。' },
  { id: 'chiisai', kanji: '小さい', kana: 'ちいさい', romaji: 'chiisai', pos: 'い形容詞', meaning: '小的', category: '狀態', uiTag: '小城', example: '小さい町から始めます。', exMean: '從小城鎮開始。' },
  { id: 'ii', kanji: 'いい', kana: 'いい', romaji: 'ii', pos: 'い形容詞', meaning: '好的', category: '狀態', uiTag: '良策/好評', example: 'それはとてもいい考えです。', exMean: '那真是個好主意。' },
  { id: 'abunai', kanji: '危ない', kana: 'あぶない', romaji: 'abunai', pos: 'い形容詞', meaning: '危險的', category: '狀態', uiTag: '城池危機', example: '敵が近いです。危ないです！', exMean: '敵人很近了，很危險！' },
  { id: 'joozu', kanji: '上手', kana: 'じょうず', romaji: 'jōzu', pos: 'な形容詞', meaning: '擅長 / 厲害', category: '狀態', uiTag: '政治/知力高', example: '孔明は計略が上手です。', exMean: '孔明很擅長計謀。' },

  // === Numbers / Months Helper (數字) ===
  { id: 'ichi', kanji: '一', kana: 'いち', romaji: 'ichi', pos: '數詞', meaning: '1（一）', category: '數字', uiTag: '一月 / 第一', example: '一月に新しい年が始まります。', exMean: '一月新的一年開始。' },
  { id: 'ni', kanji: '二', kana: 'に', romaji: 'ni', pos: '數詞', meaning: '2（二）', category: '數字', uiTag: '二月', example: '二つの城を持っています。', exMean: '擁有兩座城。' },
  { id: 'san', kanji: '三', kana: 'さん', romaji: 'san', pos: '數詞', meaning: '3（三）', category: '數字', uiTag: '三國 / 三月', example: '三つの国が戦います。', exMean: '三個國家戰鬥。' },
  { id: 'hyaku', kanji: '百', kana: 'ひゃく', romaji: 'hyaku', pos: '數詞', meaning: '100（百）', category: '數字', uiTag: '兵力/資金單位', example: '兵士が五百人います。', exMean: '有五百名士兵。' },
  { id: 'sen', kanji: '千', kana: 'せん', romaji: 'sen', pos: '數詞', meaning: '1,000（千）', category: '數字', uiTag: '大軍單位', example: '三千人の軍が出ます。', exMean: '三千人的軍隊出陣。' },
  { id: 'man', kanji: '万', kana: 'まん', romaji: 'man', pos: '數詞', meaning: '10,000（萬）', category: '數字', uiTag: '天下大軍', example: '一万人の大軍です！', exMean: '是一萬人的大軍！' },

  // === Study, Commerce, Sound, Records ===
  { id: 'kotoba', kanji: '言葉', kana: 'ことば', romaji: 'kotoba', pos: '名詞', meaning: '詞彙 / 言語', category: '學習', uiTag: '今月之言葉', example: '今月の言葉を覚えます。', exMean: '記住今月之言葉。' },
  { id: 'benkyou', kanji: '勉強', kana: 'べんきょう', romaji: 'benkyō', pos: '名詞/動詞', meaning: '學習 / 用功', category: '學習', uiTag: '私塾測驗', example: '私塾で日本語を勉強します。', exMean: '在私塾學習日語。' },
  { id: 'mise', kanji: '店', kana: 'みせ', romaji: 'mise', pos: '名詞', meaning: '商店 / 商業', category: '資源', uiTag: '商業振興', example: '町に新しい店を作ります。', exMean: '在城鎮開設新的商店。' },
  { id: 'tatemono', kanji: '建物', kana: 'たてもの', romaji: 'tatemono', pos: '名詞', meaning: '建築物 / 城防', category: '地理', uiTag: '城牆補修', example: '高い建物を建てます。', exMean: '建造高大的建築物（城防）。' },
  { id: 'tomodachi', kanji: '友達', kana: 'ともだち', romaji: 'tomodachi', pos: '名詞', meaning: '朋友 / 盟友', category: '人物', uiTag: '外交同盟', example: '隣の国は大切な友達です。', exMean: '鄰國是重要的盟友。' },
  { id: 'kaku', kanji: '書く', kana: 'かく', romaji: 'kaku', pos: '動詞', meaning: '書寫 / 存檔記錄', category: '動詞', uiTag: '存檔記錄', example: '今日の記録を書きます。', exMean: '寫下今天的記錄。' },
  { id: 'oto', kanji: '音', kana: 'おと', romaji: 'oto', pos: '名詞', meaning: '聲音 / 音效', category: '感官', uiTag: '音效開關', example: '太鼓の音が聞こえます。', exMean: '聽見戰鼓的聲音。' }
];

window.RTK3.N5_BY_ID = {};
window.RTK3.N5_VOCAB.forEach(w => {
  window.RTK3.N5_BY_ID[w.id] = w;
});

window.RTK3.MONTH_JP = [
  { num: 1, kanji: '一月', kana: 'いちがつ', romaji: 'ichigatsu' },
  { num: 2, kanji: '二月', kana: 'にがつ', romaji: 'nigatsu' },
  { num: 3, kanji: '三月', kana: 'さんがつ', romaji: 'sangatsu' },
  { num: 4, kanji: '四月', kana: 'しがつ', romaji: 'shigatsu' },
  { num: 5, kanji: '五月', kana: 'ごがつ', romaji: 'gogatsu' },
  { num: 6, kanji: '六月', kana: 'ろくがつ', romaji: 'rokugatsu' },
  { num: 7, kanji: '七月', kana: 'しちがつ', romaji: 'shichigatsu' },
  { num: 8, kanji: '八月', kana: 'はちがつ', romaji: 'hachigatsu' },
  { num: 9, kanji: '九月', kana: 'くがつ', romaji: 'kugatsu' },
  { num: 10, kanji: '十月', kana: 'じゅうがつ', romaji: 'jūgatsu' },
  { num: 11, kanji: '十一月', kana: 'じゅういちがつ', romaji: 'jūichigatsu' },
  { num: 12, kanji: '十二月', kana: 'じゅうにがつ', romaji: 'jūnigatsu' }
];

window.RTK3.getSeasonByMonth = function (month) {
  if (month >= 3 && month <= 5) return { zh: '春', n5Id: 'haru' };
  if (month >= 6 && month <= 8) return { zh: '夏', n5Id: 'natsu' };
  if (month >= 9 && month <= 11) return { zh: '秋', n5Id: 'aki' };
  return { zh: '冬', n5Id: 'fuyu' };
};

// Render an interactive N5 ruby pill HTML snippet
window.RTK3.n5Tag = function (vocabId, labelZh, compact = false) {
  const w = window.RTK3.N5_BY_ID[vocabId];
  if (!w) return labelZh || '';
  if (compact) {
    return `<span class="n5-chip" data-n5="${w.id}" title="點擊查看 N5 詞彙與發音：${w.kanji} (${w.kana}) = ${w.meaning}"><ruby>${w.kanji}<rt>${w.kana}</rt></ruby></span>`;
  }
  return `<span class="n5-label" data-n5="${w.id}" title="N5: ${w.kanji} (${w.kana} / ${w.romaji}) - ${w.meaning}">${labelZh ? `<span class="zh-lbl">${labelZh}</span> ` : ''}<span class="n5-chip"><ruby>${w.kanji}<rt>${w.kana}</rt></ruby></span></span>`;
};

// Generate a contextual N5 quiz question
window.RTK3.generateQuizQuestion = function (preferredIds = null) {
  const pool = window.RTK3.N5_VOCAB;
  let target;
  if (preferredIds && preferredIds.length > 0) {
    const valid = preferredIds.map(id => window.RTK3.N5_BY_ID[id]).filter(Boolean);
    if (valid.length > 0) target = valid[Math.floor(Math.random() * valid.length)];
  }
  if (!target) {
    target = pool[Math.floor(Math.random() * pool.length)];
  }

  // Pick 3 distractors preferably from similar category or POS
  const sameCat = pool.filter(w => w.id !== target.id && (w.category === target.category || w.pos === target.pos));
  const others = pool.filter(w => w.id !== target.id && !sameCat.includes(w));
  const shuffledSame = [...sameCat].sort(() => Math.random() - 0.5);
  const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
  const distractors = [...shuffledSame, ...shuffledOthers].slice(0, 3);

  const modeRoll = Math.random();
  const mode = modeRoll < 0.4 ? 'jp2zh' : (modeRoll < 0.72 ? 'zh2jp' : 'kanji2kana');
  const options = [target, ...distractors].sort(() => Math.random() - 0.5);

  if (mode === 'jp2zh') {
    return {
      vocab: target,
      mode,
      promptHtml: `詞彙 <span class="quiz-word"><ruby>${target.kanji}<rt>${target.kana}</rt></ruby></span>（${target.romaji}）是什麼意思？`,
      options: options.map(o => ({
        id: o.id,
        label: o.meaning,
        sub: o.pos
      }))
    };
  } else if (mode === 'kanji2kana') {
    return {
      vocab: target,
      mode,
      promptHtml: `漢字 <span class="quiz-word">${target.kanji}</span>（意思：${target.meaning}）的正確假名讀音是？`,
      options: options.map(o => ({
        id: o.id,
        label: o.kana,
        sub: o.romaji
      }))
    };
  } else {
    return {
      vocab: target,
      mode,
      promptHtml: `「<strong>${target.meaning}</strong>」（${target.uiTag}）對應的日語 N5 單字是哪一個？`,
      options: options.map(o => ({
        id: o.id,
        label: `${o.kanji}（${o.kana}）`,
        sub: o.romaji
      }))
    };
  }
};
