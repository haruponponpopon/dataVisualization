import csv
from pprint import pprint

################
# Edit genre here
genre = "unagi"
################

inputfile = f"../data_tabelog/{genre}_out.csv"
outputfile = f"./{genre}_plot.js"
print(inputfile)

dict = {}

with open(inputfile, 'r') as f:
    # print(f.read())
    dataReader = csv.reader(f)
    header = next(dataReader)
    for row in dataReader:
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

with open(outputfile, "w") as g:
    dictName = f"const {genre} = "
    print(dictName, file=g)
    pprint(dict, stream=g)