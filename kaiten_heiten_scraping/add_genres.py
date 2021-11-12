f_r = open('data/yakisoba.csv', 'r')
f_w = open('data/yakisoba_genres.csv', 'w')
datalist = f_r.readlines()
f_w.write("Date,ShopName,Prefecture,longitude,latitude,Open,genres\n")
for i in range(1,len(datalist)):
      arr = datalist[i].split(',')
      if arr[5]=="1\n":
        f_w.write(arr[0]+","+arr[1]+","+arr[2]+","+arr[3]+","+arr[4]+",1, #焼きそば\n")
      else:
        f_w.write(arr[0]+","+arr[1]+","+arr[2]+","+arr[3]+","+arr[4]+",0, #焼きそば\n")