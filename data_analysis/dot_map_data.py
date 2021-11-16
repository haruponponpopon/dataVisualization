variable_dict = {'コーヒー':"coffee", 'カフェ':"cafe", '寿司':"sushi", 'ハンバーガー':"hamburger", 'カレー':"curry", 'ドーナツ':"donut", 'タピオカ':"tapi", 'お好み焼き':"okonomiyaki", 'イタリアン':"italian", 'ダイニングバー':"dining", '居酒屋':"izakaya", 'たこ焼き':"tako", 'パン':"bakery", 'ケーキ':"cake", 'パンケーキ':"pancake", 'うなぎ':"unagi", 'オムライス':"omlet", 'バー':"bar", '洋食':"western", 'パスタ':"pasta", '喫茶店':"kissa", '鉄板焼き':"teppan", 'おでん':"oden", 'たい焼き・大判焼き':"taiyaki", 'サンドイッチ':"sandwitch", '焼きそば':"yakisoba", 'ジュースバー':"juice", 'フレンチ':"french", 'コーヒー専門店':"coffee_pro", 'ステーキ':"steak", '定食・食堂':"teishoku", '紅茶専門店':"tea", 'ビストロ':"bistro", 'バル・バール':"bal", 'もんじゃ焼き':"monja", 'ピザ':"pizza", 'パフェ':"parfait", 'バイキング':"biking", '焼鳥':"yakitori", '中国茶専門店':"china", 'ワインバー':"wine", '自然食':"nature", 'ハワイ料理':"Hawaii", '野菜料理':"vegetable", 'ラーメン':"ramen", 'アイスクリーム':"ice", '魚介料理・海鮮料理':"fish", 'ハンバーグ':"hanbagu", '創作料理':"sousaku", '日本茶専門店':"japan", '和菓子':"wagashi"}
variable_num_dict = {'コーヒー':0, 'カフェ':1, '寿司':2, 'ハンバーガー':3, 'カレー':4, 'ドーナツ':5, 'タピオカ':6, 'お好み焼き':7, 'イタリアン':8, 'ダイニングバー':9, '居酒屋':10, 'たこ焼き':11, 'パン':12, 'ケーキ':13, 'パンケーキ':14, 'うなぎ':15, 'オムライス':16, 'バー':17, '洋食':18, 'パスタ':19, '喫茶店':20, '鉄板焼き':21, 'おでん':22, 'たい焼き・大判焼き':23, 'サンドイッチ':24, '焼きそば':25, 'ジュースバー':26, 'フレンチ':27, 'コーヒー専門店':28, 'ステーキ':29, '定食・食堂':30, '紅茶専門店':31, 'ビストロ':32, 'バル・バール':33, 'もんじゃ焼き':34, 'ピザ':35, 'パフェ':36, 'バイキング':37, '焼鳥':38, '中国茶専門店':39, 'ワインバー':40, '自然食':41, 'ハワイ料理':42, '野菜料理':43, 'ラーメン':44, 'アイスクリーム':45, '魚介料理・海鮮料理':46, 'ハンバーグ':47, '創作料理':48, '日本茶専門店':49, '和菓子':50}
import csv
from pprint import pprint


################
# Edit genre here
genre = "unagi"
################

inputfile = f"./corrected_longitude.csv"
outputfile = f"./total_plot.js"
# inputfile = f"./sampledata.csv"
# outputfile = f"./sample_plot.js"
print(inputfile)


genre_dict = [[] for i in range(51)]

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

f_w = open('total_plot.js', 'a')
f_w.write("const genreMap = new Map([\n")
count = 0
for key in variable_dict.keys():
    f_w.write("    [\""+key+"\", "+variable_dict[key])
    if count!=len(variable_dict)-1:
        f_w.write("],\n")
    else:
        f_w.write("]\n")
f_w.write("]);")