const coffee = 
{}
const cafe = 
{}
const sushi = 
{}
const hamburger = 
{}
const curry = 
{}
const donut = 
{}
const tapi = 
{}
const okonomiyaki = 
{}
const italian = 
{}
const dining = 
{}
const izakaya = 
{2021: {3: [{'longitude_latitude': [135.47595110560283, 34.67494398044111],
             'name': 'からあげ酒場鶏笑 九条店',
             'open': 1,
             'prefecture': '大阪府'}],
        9: [{'longitude_latitude': [135.52735051568234, 34.69778439088114],
             'name': '大阪からあげ研究所 by Forgiven 京橋本店',
             'open': 1,
             'prefecture': '大阪府'}]}}
const tako = 
{}
const bakery = 
{}
const cake = 
{}
const pancake = 
{}
const unagi = 
{}
const omlet = 
{}
const bar = 
{}
const western = 
{}
const pasta = 
{}
const kissa = 
{}
const teppan = 
{}
const oden = 
{}
const taiyaki = 
{}
const sandwitch = 
{}
const yakisoba = 
{}
const juice = 
{}
const french = 
{}
const coffee_pro = 
{}
const steak = 
{}
const teishoku = 
{2021: {4: [{'longitude_latitude': [136.88174272123936, 35.108405561830075],
             'name': 'からあげ、定食、丼 がブリチキン。ららぽーと名古屋みなとアクルス店',
             'open': 1,
             'prefecture': '愛知県'}],
        5: [{'longitude_latitude': [139.3849679504587, 35.833410586249286],
             'name': 'からあげ専門店 とりえもん',
             'open': 1,
             'prefecture': '埼玉県'}],
        9: [{'longitude_latitude': [139.96312271570147, 35.79728803120486],
             'name': 'からあげの鉄人 五香西口駅前店',
             'open': 1,
             'prefecture': '千葉県'}],
        10: [{'longitude_latitude': [136.8777393156908, 35.179988364904176],
              'name': 'からあげ、定食、丼 がブリチキン。則武新町店',
              'open': 1,
              'prefecture': '愛知県'}]}}
const tea = 
{}
const bistro = 
{}
const bal = 
{2021: {10: [{'longitude_latitude': [133.53931482924966, 33.56065061634048],
              'name': '大分からあげと鉄板焼 帯屋町応援団 勝男',
              'open': 1,
              'prefecture': '高知県'}]}}
const monja = 
{}
const pizza = 
{}
const parfait = 
{}
const biking = 
{}
const yakitori = 
{2021: {4: [{'longitude_latitude': [140.23778082926466, 38.820173998723966],
             'name': 'やきとり・からあげ家 米っこ最上',
             'open': 1,
             'prefecture': '山形県'}],
        11: [{'longitude_latitude': [136.68535582923522, 35.067079096438825],
              'name': '骨付鳥、からあげ、ハイボール がブリチキン。桑名駅前店',
              'open': 1,
              'prefecture': '三重県'}]}}
const china = 
{}
const wine = 
{}
const nature = 
{}
const Hawaii = 
{}
const vegetable = 
{}
const ramen = 
{}
const ice = 
{}
const fish = 
{}
const hanbagu = 
{}
const sousaku = 
{}
const japan = 
{}
const wagashi = 
{}
const genreMap = new Map([
    ["コーヒー", coffee],
    ["カフェ", cafe],
    ["寿司", sushi],
    ["ハンバーガー", hamburger],
    ["カレー", curry],
    ["ドーナツ", donut],
    ["タピオカ", tapi],
    ["お好み焼き", okonomiyaki],
    ["イタリアン", italian],
    ["ダイニングバー", dining],
    ["居酒屋", izakaya],
    ["たこ焼き", tako],
    ["パン", bakery],
    ["ケーキ", cake],
    ["パンケーキ", pancake],
    ["うなぎ", unagi],
    ["オムライス", omlet],
    ["バー", bar],
    ["洋食", western],
    ["パスタ", pasta],
    ["喫茶店", kissa],
    ["鉄板焼き", teppan],
    ["おでん", oden],
    ["たい焼き・大判焼き", taiyaki],
    ["サンドイッチ", sandwitch],
    ["焼きそば", yakisoba],
    ["ジュースバー", juice],
    ["フレンチ", french],
    ["コーヒー専門店", coffee_pro],
    ["ステーキ", steak],
    ["定食・食堂", teishoku],
    ["紅茶専門店", tea],
    ["ビストロ", bistro],
    ["バル・バール", bal],
    ["もんじゃ焼き", monja],
    ["ピザ", pizza],
    ["パフェ", parfait],
    ["バイキング", biking],
    ["焼鳥", yakitori],
    ["中国茶専門店", china],
    ["ワインバー", wine],
    ["自然食", nature],
    ["ハワイ料理", Hawaii],
    ["野菜料理", vegetable],
    ["ラーメン", ramen],
    ["アイスクリーム", ice],
    ["魚介料理・海鮮料理", fish],
    ["ハンバーグ", hanbagu],
    ["創作料理", sousaku],
    ["日本茶専門店", japan],
    ["和菓子", wagashi],
]);