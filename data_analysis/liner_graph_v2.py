#データの読み込み、分析
#累積
f_r = open('aggregated_data.csv', 'r')

datalist = f_r.readlines()
mydict = {}
genres_dict = {}
year_index = 1
for i in range(1,len(datalist)):
    arr = datalist[i].split(',')
    genres = arr[6].split('#')
    op = 0 #店が空いたら1,閉まったら-1
    if arr[5]=="0":
        op = -1
    else:
        op = 1
    if genres[0]=='None\n':
        continue
    for j in (range(1,len(genres))):
        result = mydict.get((genres[j][0:len(genres[j])-1], arr[year_index][0:7]))
        #ジャンル数のカウント
        find = genres_dict.get(genres[j][0:len(genres[j])-1])
        if find == None:
            genres_dict[genres[j][0:len(genres[j])-1]]=1
        else:
            genres_dict[genres[j][0:len(genres[j])-1]]= find + 1
        # print([genres[j][0:len(genres[j])-1]])
        # if "ジューススタンド" == genres[j][0:len(genres[j])-1]:
        #     print(i)
        if result==None:
            mydict[(genres[j][0:len(genres[j])-1], arr[year_index][0:7])] = op
        else:
            mydict[(genres[j][0:len(genres[j])-1], arr[year_index][0:7])] = result + op
f_r.close()
result_dict = sorted(genres_dict.items(), key=lambda x:x[1], reverse=True)
#ジャンルのランキングを表示していたコード
# ranking = 1
# for i in result_dict:
#     print(ranking, i[0], i[1],"  ")
#     ranking += 1

#データの書き込み
f_w = open('aggregated_line_v2.js','w')
#最初の方の諸々データ
f_w.write("var ShopData=[];\n")
f_w.write("ShopData.push({title:'Shop Data',\n")
f_w.write("genre_num: 50,\n")
f_w.write("data_num: 136,\n")
#ジャンル
f_w.write("genre: [")
genres = []
# for key in genres_dict.keys():
#     genres.append(key)

#そのほかを除く上位50件のジャンルを抽出
count = 0
for i in result_dict:
    # print(i[0][-5:])
    if len(i[0])>6 and i[0][-5:]=="（その他）":
        continue
    count += 1
    genres.append(i[0])
    if count>50:
        break
# print(genres)
for i in range(len(genres)):
    if i == len(genres)-1:
        f_w.write("\""+genres[i]+"\"],\n")
    else:
        f_w.write("\""+genres[i]+"\", ")
f_w.write("min_date: \"2010-08\",\n")#手動です。ごめんなさいごめんなさいごめんなさい
f_w.write("max_date: \"2021-11\",\n")

#データ
f_w.write("dist: {\n")

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
        if mydict.get((genre,date))!=None:
            sum+=mydict[(genre,date)]
        f_w.write(" "+str(sum)+",")
    #2012年-2020年
    for year in range(11,21):
        for month in range(1,13):
            date = "20"+str(year)+"-"
            if month<10:
                date += "0"+str(month)
            else:
                date += str(month)
            if mydict.get((genre,date))!=None:
                sum+=mydict[(genre,date)]
            f_w.write(" "+str(sum)+",")
    #2021年
    for month in range(1,12):
        date = "2021-"
        if month<10:
            date += "0"+str(month)
        else:
            date += str(month)
        if mydict.get((genre,date))!=None:
            sum+=mydict[(genre,date)]
        if month!=11:
            f_w.write(" "+str(sum)+",")
        else:
            f_w.write(" "+str(sum)+"]")
    if genre!=genres[len(genres)-1]:
        f_w.write(",\n")
    else:
        f_w.write("\n")


f_w.write("}});\n")
f_w.close()