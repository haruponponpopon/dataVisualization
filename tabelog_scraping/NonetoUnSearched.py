import sys

import bs4
import os
import re
import requests
import pandas as pd
import time
import openpyxl
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import csv
import pprint
import re

input_filename = "./data/cafe_out1.csv"
df = pd.read_csv(input_filename)
df.set_index("ShopName", inplace = True)
df['genres'].replace('None', 'Unsearched')
df.to_csv("./data/cafe_out1.csv")