f_r = open('dataset.csv', 'r')
f_w = open('kanto_dataset.csv', 'a')
datalist = f_r.readlines()
f_w.write("Date,ShopName,Prefecture,longitude,latitude,Open\n")
for i in range(1,len(datalist)):
  arr = datalist[i].split(',')
  if arr[2]=="茨城県" or arr[2] == "栃木県" or arr[2] == "群馬県" or arr[2] == "埼玉県" or arr[2] == "東京都" or arr[2] == "神奈川県":
      f_w.write(arr[0]+","+arr[1]+","+arr[2]+","+arr[3]+","+arr[4]+","+arr[5])

f_r.close()
f_w.close()