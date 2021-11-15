f_r = open('aggregated_data.csv', 'r')
datalist = f_r.readlines()
f_w = open('corrected_longitude.csv','w')
f_w.write(datalist[0])

for i in range(1,len(datalist)):
    print(i)
    arr = datalist[i].split(',')
    f_w.write(arr[0]+","+arr[1]+","+arr[2]+","+arr[3]+","+arr[4]+","+arr[5]+","+arr[6])
    #緯度と経度が入れ替わっていたら直す
    longitude = float(arr[3])
    latitude = float(arr[4])
    if longitude<latitude:
        longitude,latitude = latitude,longitude
        arr[3],arr[4] = arr[4],arr[3]
    #不適切な行のプリント
    #arr[3]は経度(122-154)、arr[4]は緯度(20-46)
    if longitude == -1 and latitude == -1:
        continue
    if longitude<122 or longitude>154:
        print(i)
    if latitude<20 or latitude>46:
        print(i)

f_r.close()
f_w.close()