
from bs4 import BeautifulSoup
from urllib import request
import datetime
import numpy as np



def scrape():
    dic = []
    for i in range(1,22):
    # for i in range(1,2):
        # url = 'https://kaiten-heiten.com/category/restaurant/takoyaki/page/'+str(i)+'/?s=%E3%80%90%E9%96%8B%E5%BA%97%E3%80%91'
        url = 'https://kaiten-heiten.com/category/restaurant/takoyaki/page/'+str(i)+'/?s=%E3%80%90%E9%96%8B%E5%BA%97%E3%80%91'
        response = request.urlopen(url)
        soup = BeautifulSoup(response,'html.parser')
        for a in soup.find_all('a', class_="post_links"): 
            link = a.get('href')
            date = a.text[6:16]
            all_data = a.text
            s_flag = False
            shop_name = ""
            for i in range(len(all_data)):
                #店の名前に関する処理
                if s_flag:
                    if all_data[i]=='\n':
                        s_flag=False
                    else:
                        shop_name+=all_data[i]
                elif all_data[i]=='】':
                    s_flag = True
            # print(shop_name)


            # if dic.get(shop_name) is None:
            #     dic[shop_name] = [0,0]



            url = link
            response = request.urlopen(url)
            soup = BeautifulSoup(response,'html.parser')
            prefecture = ""
            address = soup.select('td')[1].text
            index = 10
            while True:
                # if index>=len(address):
                #     print(address)
                #     break
                prefecture+=address[index]
                if address[index]=='都' or address[index]=='道' or address[index]=='府' or address[index]=='県':
                    break
                else:
                    index+=1
            phone = soup.select('td')[3].text
            dic.append([date,prefecture,shop_name,phone])
    return dic






if __name__ == "__main__":
    data = scrape()
    f = open('takoyaki.csv', 'w')
    f.write("Date,Prefecture,ShopName,Phone\n")
    for d in data:
        f.write(d[0]+","+d[1]+","+d[2]+","+d[3]+"\n")
    f.close()
