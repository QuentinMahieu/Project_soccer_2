from selenium import webdriver
import time
from collections import defaultdict
import pandas as pd

def scrape(league):
    driver = webdriver.Chrome('/usr/local/bin/chromedriver')
    if league == "England":
        url = "https://www.flashscore.com.au/football/england/epl/standings/"
    if league == "Spain":
        url = "https://www.flashscore.com.au/football/spain/laliga/standings/"
    if league == "Italy":
        url = "https://www.flashscore.com.au/football/italy/serie-a/standings/"
    #urls = [url_eng,url_es,url_it]

    table = defaultdict(list)
    #for url in urls:
    driver.get(url)
    time.sleep(1)

    col1 = driver.find_elements_by_xpath('//a[@class="rowCellParticipantName___38vskiN"]')
    col2 = driver.find_elements_by_xpath('//span[@class="  rowCell____vgDgoa cell___4WLG6Yd "]')
    
    for i in range(len(col1)):
        table["Ranking"].append(i+1)
        table["Team"].append(col1[i].text)
        if league == "England":
            table["League"].append('England')
        if league == "Spain":
            table["League"].append('Spain')
        if league == "Italy":
            table["League"].append('Italy')
    count = 0
    for i in range(len(col2)):
        if count == 0 :
            table["MP"].append(col2[i].text)
        if count == 1:
            table["W"].append(col2[i].text)
        if count == 2:
            table["D"].append(col2[i].text)
        if count == 3:
            table["L"].append(col2[i].text)
        if count == 4:
            table["Pts"].append(col2[i].text)
            count = -1
        count+=1
    table = dict(table)
    driver.close()
    # Return results
    return table

