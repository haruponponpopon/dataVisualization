#データの読み込み、分析
#累積じゃなくて単純なやつ
#開店と閉店がごっちゃ
f_r = open('unagi.csv', 'r')

datalist = f_r.readlines()
mydict = {}
genres_dict = {}
year_index = 1
for i in range(1,len(datalist)):
    arr = datalist[i].split(',')
    genres = arr[6].split('#')
    if genres[0]=='None\n':
        continue
    for j in (1,len(genres)-1):
        result = mydict.get((genres[j][0:len(genres[j])-1], arr[year_index][0:7]))
        genres_dict[genres[j][0:len(genres[j])-1]]=1
        if result==None:
            mydict[(genres[j][0:len(genres[j])-1], arr[year_index][0:7])] = 1
        else:
            mydict[(genres[j][0:len(genres[j])-1], arr[year_index][0:7])] = result + 1
f_r.close()


#データの書き込み
f_w = open('unagi_line.js','w')
#最初の方の諸々データ
f_w.write("var ShopData=[];\n")
f_w.write("ShopData.push({title:'Unagi Data',\n")
f_w.write("genre_num: "+str(len(genres_dict))+",\n")
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
f_w.write("min_date: \"2011-09\",\n")#手動です。ごめんなさいごめんなさいごめんなさい
f_w.write("max_date: \"2021-11\",\n")


#データ
f_w.write("dist: [\n")
#2011年
for month in range(9,13):
    f_w.write("[")
    date = "2011-"
    if month<10:
        date += "0"+str(month)
    else:
        date += str(month)
    for i in range(len(genres)):
        if mydict.get((genres[i],date))==None:
            f_w.write("0")
        else:
            f_w.write(str(mydict[(genres[i],date)]))
        if i==len(genres)-1:
            f_w.write("],\n")
        else:
            f_w.write(", ")
#2012-2020年
for year in range(12,21):
    for month in range(1,13):
        f_w.write("[")
        date = "20"+str(year)+"-"
        if month<10:
            date += "0"+str(month)
        else:
            date += str(month)
        for i in range(len(genres)):
            if mydict.get((genres[i],date))==None:
                f_w.write("0")
            else:
                f_w.write(str(mydict[(genres[i],date)]))
            if i==len(genres)-1:
                f_w.write("],\n")
            else:
                f_w.write(", ")
#2021年
for month in range(1,12):
    f_w.write("[")
    date = "2021-"
    if month<10:
        date += "0"+str(month)
    else:
        date += str(month)
    for i in range(len(genres)):
        if mydict.get((genres[i],date))==None:
            f_w.write("0")
        else:
            f_w.write(str(mydict[(genres[i],date)]))
        if i==len(genres)-1:
            if month==11:
                f_w.write("]\n")
            else:
                f_w.write("],\n")
        else:
            f_w.write(", ")
f_w.write("]});\n")
f_w.close()