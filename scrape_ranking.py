from selenium import webdriver
import time
from collections import defaultdict
import pandas as pd
import os

def scrape(league):
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--no-sandbox")
    options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
    driver = webdriver.Chrome(executable_path = os.environ.get("CHROMEDRIVER_PATH"),options=options)
    if league == "England":
        url = "https://www.espn.com.au/football/table/_/league/eng.1"
    if league == "Spain":
        url = "https://www.espn.com.au/football/table/_/league/esp.1"
    if league == "Italy":
        url = "https://www.espn.com.au/football/table/_/league/ita.1"

    table = defaultdict(list)

    driver.get(url)
    time.sleep(1)

    imgs = driver.find_elements_by_xpath('//img[@class="Image Logo Logo__sm"]')
    rows = driver.find_elements_by_xpath('//td[@class="Table__TD"]')
    
    for i in range(len(imgs)):
        table["Ranking"].append(i+1)
        table["Team"].append(imgs[i].get_attribute("title"))
        if league == "England":
            table["League"].append('England')
        if league == "Spain":
            table["League"].append('Spain')
        if league == "Italy":
            table["League"].append('Italy')
            src = imgs[i].get_attribute("src")
            new_src = src.replace("h=100&w=100","h=40&w=40")
            table["img"].append(new_src)
    count = 0
    for i in range(len(rows)):
        if i <20:
            count=-1
            pass 
        if count == 0 :
            table["MP"].append(rows[i].text)
        if count == 1:
            table["W"].append(rows[i].text)
        if count == 2:
            table["D"].append(rows[i].text)
        if count == 3:
            table["L"].append(rows[i].text)
        if count == 7:
            table["Pts"].append(rows[i].text)
            count = -1
        count+=1
    driver.close()
    table = dict(table)
    df = pd.DataFrame(table)
    table_dict = df.to_dict('records')
    # Return results
    return table_dict

