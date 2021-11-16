#データの読み込み、分析
#累積
#件数がゼロでも全ての都道府県を入れる

#都道府県の配列作成
f_pref = open('prefecture.txt','r')
pref_list = f_pref.readlines()
prefectures = []
for pref in pref_list:
    prefectures.append(pref[:-1])
f_pref.close()

#元データの読み込み
f_r = open('aggregated_data.csv', 'r')

datalist = f_r.readlines()
mydict = {}
genres_dict = {}
year_index = 1
pref_index = 2
for i in range(1,len(datalist)):
    arr = datalist[i].split(',')
    genres = arr[6].split('#')
    op = 0 #店が空いたら1,閉まったら-1
    if arr[5]=="0":
        op = -1
    else:
        op = 1
    if genres[0]=='None\n' or genres[0]=='unfound':#ジャンルが存在しないからデータは集計しない
        continue
    if arr[1]=="none":#都道府県が存在しないからデータは集計しない
        print(i)
        continue
    for j in (range(1,len(genres))):
        result = mydict.get((genres[j][0:len(genres[j])-1], arr[year_index][0:7],arr[pref_index]))#ジャンル名、年、都道府県
        genres_dict[genres[j][0:len(genres[j])-1]]=1
        if result==None:
            mydict[(genres[j][0:len(genres[j])-1], arr[year_index][0:7],arr[pref_index])] = op
        else:
            mydict[(genres[j][0:len(genres[j])-1], arr[year_index][0:7],arr[pref_index])] = result + op
f_r.close()


#データの書き込み
f_w = open('aggregated_line_pref_v2.js','w')
#最初の方の諸々データ
f_w.write("var ShopPrefectureData=[];\n")
f_w.write("ShopPrefectureData.push({title:'Prefectire Data',\n")
f_w.write("genre_num: 50,\n")
f_w.write("data_num: 136,\n")
f_w.write("min_date: \"2010-08\",\n")#手動です。ごめんなさいごめんなさいごめんなさい
f_w.write("max_date: \"2021-11\",\n")
#ジャンル
f_w.write("genre: [")
genres = ['コーヒー', 'カフェ', '寿司', 'ハンバーガー', 'カレー', 'ドーナツ', 'タピオカ', 'お好み焼き', 'イタリアン', 'ダイニングバー', '居酒屋', 'たこ焼き', 'パン', 'ケーキ', 'パンケーキ', 'うなぎ', 'オムライス', 'バー', '洋食', 'パスタ', '喫茶店', '鉄板焼き', 'おでん', 'たい焼き・大判焼き', 'サンドイッチ', '焼きそば', 'ジュースバー', 'フレンチ', 'コーヒー専門店', 'ステーキ', '定食・食堂', '紅茶専門店', 'ビストロ', 'バル・バール', 'もんじゃ焼き', 'ピザ', 'パフェ', 'バイキング', '焼鳥', '中国茶専門店', 'ワインバー', '自然食', 'ハワイ料理', '野菜料理', 'ラーメン', 'アイスクリーム', '魚介料理・海鮮料理', 'ハンバーグ', '創作料理', '日本茶専門店', '和菓子']
# for key in genres_dict.keys():
#     genres.append(key)
for i in range(len(genres)):
    if i == len(genres)-1:
        f_w.write("\""+genres[i]+"\"],\n")
    else:
        f_w.write("\""+genres[i]+"\", ")
#描画されるデータの書き込み
f_w.write("dist: {\n")
for prefecture in prefectures:
    f_w.write("\""+prefecture+"\":{\n")
    for genre in genres:
        f_w.write("\""+genre+"\": [")
        #店の閉店開店の累積データの配列
        sum = 0
        #2010年
        for month in range(8,13):
            date = "2010-"
            if month<10:
                date += "0"+str(month)
            else:
                date += str(month)
            if mydict.get((genre,date,prefecture))!=None:
                sum+=mydict[(genre,date,prefecture)]
            f_w.write(" "+str(sum)+",")
        #2012年-2020年
        for year in range(11,21):
            for month in range(1,13):
                date = "20"+str(year)+"-"
                if month<10:
                    date += "0"+str(month)
                else:
                    date += str(month)
                if mydict.get((genre,date,prefecture))!=None:
                    sum+=mydict[(genre,date,prefecture)]
                f_w.write(" "+str(sum)+",")
        #2021年
        for month in range(1,12):
            date = "2021-"
            if month<10:
                date += "0"+str(month)
            else:
                date += str(month)
            if mydict.get((genre,date,prefecture))!=None:
                sum+=mydict[(genre,date,prefecture)]
            if month!=11:
                f_w.write(" "+str(sum)+",")
            else:
                f_w.write(" "+str(sum)+"]")
        if genre!=genres[len(genres)-1]:
            f_w.write(",\n")
        else:
            f_w.write("\n")
    if prefecture!='沖縄県':
        f_w.write("},\n")
    else:
        f_w.write("}\n")

f_w.write("}});\n")
f_w.close()