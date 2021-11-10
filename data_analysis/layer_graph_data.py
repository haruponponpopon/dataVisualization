f_r = open('sampledata.csv', 'r')

datalist = f_r.readlines()
mydict = {}
for i in range(1,len(datalist)):
  arr = datalist[i].split(',')
  genres = arr[5].split('#')
  for j in (1,len(genres)-1):
      if j==len(genres)-1:
          mydict[genres[j][0:len(genres[j])-1], arr[0][0:7]] = 1
      else:
          mydict[genres[j][0:len(genres[j])], arr[0][0:7]] = 1
print(mydict)
f_r.close()