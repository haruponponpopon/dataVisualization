#データの読み込み、分析
f_r = open('sampledata.csv', 'r')

datalist = f_r.readlines()
mydict = {}
genres_dict = {}
for i in range(1,len(datalist)):
  arr = datalist[i].split(',')
  genres = arr[5].split('#')
  for j in (1,len(genres)-1):
      if j==len(genres)-1:
          result = mydict.get((genres[j][0:len(genres[j])-1], arr[0][0:7]))
          genres_dict[genres[j][0:len(genres[j])-1]]=1
          if result==None:
              mydict[(genres[j][0:len(genres[j])-1], arr[0][0:7])] = 1
          else:
              mydict[(genres[j][0:len(genres[j])-1], arr[0][0:7])] = result + 1
      else:
          genres_dict[genres[j][0:len(genres[j])-1]]=1
          result = mydict.get((genres[j][0:len(genres[j])], arr[0][0:7]))
          if result==None:
              mydict[(genres[j][0:len(genres[j])], arr[0][0:7])] = 1
          else:
              mydict[(genres[j][0:len(genres[j])], arr[0][0:7])] = result + 1
f_r.close()


#データの書き込み
f_w = open('sampledata.js','w')
#
f_w.write("ShopData = {\n")
f_w.write("        genre_num: ["+len(genres_dict)+"],\n")
#ジャンル
f_w.write("        genres: [")
genres = []
for key in genres_dict.keys():
    genres.append(key)
for i in range(len(genres)):
    if i == len(genres)-1:
        f_w.write("\""+genres[i]+"\"],\n")
    else:
        f_w.write("\""+genres[i]+"\", ")

#