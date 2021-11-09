f_r = open('sampledata.csv', 'r')

datalist = f_r.readlines()
mydict = {}
for i in range(1,len(datalist)):
  arr = datalist[i].split(',')
  genres = arr[5].split('#')
  for j in (1,len(genres)-1):
      if j==len(genres)-1:
          minidict = {}
          minidict[arr[0][0:7]] = 1
          mydict[genres[j][0:len(genres[j])-1]] = minidict
      else:
          minidict = {}
          minidict[arr[0][0:7]] = 1
          mydict[genres[j][0:len(genres[j])]] = minidict
print(mydict)
f_r.close()