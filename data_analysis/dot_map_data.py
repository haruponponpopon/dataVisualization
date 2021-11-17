variable_dict = {'コーヒー':"coffee", 'カフェ':"cafe", '寿司':"sushi", 'ハンバーガー':"hamburger", 'カレー':"curry", 'ドーナツ':"donut", 'タピオカ':"tapi", 'お好み焼き':"okonomiyaki", '居酒屋':"izakaya", 'からあげ':"karaage", 'イタリアン':"italian", 'ダイニングバー':"dining", 'たこ焼き':"takoyaki", 'パン':"pan", 'ケーキ':"cake", 'パンケーキ':"pancake", 'うなぎ':"unagi", 'オムライス':"omlet", 'バー':"bar", '洋食':"western", 'パスタ':"pasta", '喫茶店':"kissa", '鉄板焼き':"teppan", 'おでん':"oden", 'たい焼き・大判焼き':"taiyaki", 'サンドイッチ':"sandwitch", '焼きそば':"yakisoba", 'ジュースバー':"juice", '定食・食堂':"teishoku", 'フレンチ':"french", 'コーヒー専門店':"senmon", 'ステーキ':"steaks", '紅茶専門店':"tea", '弁当':"bento", 'バル・バール':"bal", 'ビストロ':"bistro", 'もんじゃ焼き':"monja", '焼鳥':"yakitori", 'ピザ':"pizza", 'パフェ':"palfe", 'バイキング':"biking", '中国茶専門店':"china", 'ラーメン':"ramen", 'ワインバー':"wine", '自然食':"shizen", 'ハワイ料理':"hawaii", '野菜料理':"yasai", 'アイスクリーム':"ice", '魚介料理・海鮮料理':"fish", 'ハンバーグ':"hambagu"}
variable_num_dict = {'コーヒー':0, 'カフェ':1, '寿司':2, 'ハンバーガー':3, 'カレー':4, 'ドーナツ':5, 'タピオカ':6, 'お好み焼き':7, '居酒屋':8, 'からあげ':9, 'イタリアン':10, 'ダイニングバー':11, 'たこ焼き':12, 'パン':13, 'ケーキ':14, 'パンケーキ':15, 'うなぎ':16, 'オムライス':17, 'バー':18, '洋食':19, 'パスタ':20, '喫茶店':21, '鉄板焼き':22, 'おでん':23, 'たい焼き・大判焼き':24, 'サンドイッチ':25, '焼きそば':26, 'ジュースバー':27, '定食・食堂':28, 'フレンチ':29, 'コーヒー専門店':30, 'ステーキ':31, '紅茶専門店':32, '弁当':33, 'バル・バール':34, 'ビストロ':35, 'もんじゃ焼き':36, '焼鳥':37, 'ピザ':38, 'パフェ':39, 'バイキング':40, '中国茶専門店':41, 'ラーメン':42, 'ワインバー':43, '自然食':44, 'ハワイ料理':45, '野菜料理':46, 'アイスクリーム':47, '魚介料理・海鮮料理':48, 'ハンバーグ':49}
import csv
from pprint import pprint


################
# Edit genre here
genre = "unagi"
################

inputfile = f"./corrected_longitude.csv"
outputfile = f"./aggregated_plot.js"
# inputfile = f"./sampledata.csv"
# outputfile = f"./sample_plot.js"
print(inputfile)


genre_dict = [[] for i in range(50)]

with open(inputfile,'r') as f:
    dataReader = csv.reader(f)
    header = next(dataReader)
    for row in dataReader:
        if float(row[3])==-1:
            continue
        genres = row[6].split('#')
        for i in range(1,len(genres)):
            genre = ""
            if i!=len(genres)-1:
                genre = genres[i][:-1]
            else:
                genre = genres[i]
        if variable_num_dict.get(genre)!=None:
            genre_dict[variable_num_dict[genre]].append(row)
index = 0

for genre in variable_num_dict.keys():
    dict = {}
    for row in genre_dict[index]:
        date = row[1].split('-')
        year = int(date[0])
        month = int(date[1])
        
        shopData = {"name": row[0],
                    "prefecture": row[2],
                    "longitude_latitude": [float(row[3]), float(row[4])],
                    "open": int(row[5])}
        
        dict.setdefault(year, {})
        dict[year].setdefault(month, [])
        dict[year][month].append(shopData)    
    with open(outputfile, "a") as g:
        genre_e = variable_dict[genre]
        dictName = f"const {genre_e} = "
        print(dictName, file=g)
        pprint(dict, stream=g)
    index += 1

f_w = open('aggregated_plot.js', 'a')
f_w.write("const genreMap = new Map([\n")
count = 0
for key in variable_dict.keys():
    f_w.write("    [\""+key+"\", "+variable_dict[key])
    if count!=len(variable_dict)-1:
        f_w.write("],\n")
    else:
        f_w.write("]\n")
f_w.write("]);")