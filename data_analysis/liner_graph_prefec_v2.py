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
f_r = open('unagi.csv', 'r')

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
    if genres[0]=='None\n':#ジャンルが存在しないからデータは集計しない
        continue
    if arr[1]=="none":#都道府県が存在しないからデータは集計しない
        print(i)
        continue
    for j in (1,len(genres)-1):
        result = mydict.get((genres[j][0:len(genres[j])-1], arr[year_index][0:7],arr[pref_index]))#ジャンル名、年、都道府県
        genres_dict[genres[j][0:len(genres[j])-1]]=1
        if result==None:
            mydict[(genres[j][0:len(genres[j])-1], arr[year_index][0:7],arr[pref_index])] = op
        else:
            mydict[(genres[j][0:len(genres[j])-1], arr[year_index][0:7],arr[pref_index])] = result + op
f_r.close()


#データの書き込み
f_w = open('unagi_line_pref_v2.js','w')
#最初の方の諸々データ
f_w.write("var ShopPrefectureData=[];\n")
f_w.write("ShopPrefectureData.push({title:'Unagi Data',\n")
f_w.write("genre_num: "+str(len(genres_dict))+",\n")
f_w.write("data_num: 123,\n")
f_w.write("min_date: \"2011-09\",\n")#手動です。ごめんなさいごめんなさいごめんなさい
f_w.write("max_date: \"2021-11\",\n")
#ジャンル
f_w.write("genre: [")
genres = []
for key in genres_dict.keys():
    genres.append(key)
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
        #2011年
        for month in range(9,13):
            date = "2011-"
            if month<10:
                date += "0"+str(month)
            else:
                date += str(month)
            if mydict.get((genre,date,prefecture))!=None:
                sum+=mydict[(genre,date,prefecture)]
            f_w.write(" "+str(sum)+",")
        #2012年-2020年
        for year in range(12,21):
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