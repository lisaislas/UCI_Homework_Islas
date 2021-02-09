from splinter import Browser
from pprint import pprint
import pymongo
import pandas as pd
import requests
from bs4 import BeautifulSoup as bs
from webdriver_manager.chrome import ChromeDriverManager
from flask import Flask, render_template
import time
import numpy as np
import json
from selenium import webdriver

def init_browser():
    executable_path = {'executable_path' : ChromeDriverManager().install()}
    return Browser('chrome', **executable_path, headless=False)

def scrape():
    browser = init_browser()
    mars = {}
    url = 'https://mars.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2Ccreated_at+desc&search=&category=19%2C165%2C184%2C204&blank_scope=Latest'

    browser.visit(url)
    time.sleep(1)
    html = browser.html
    soup = bs(html, 'html.parser')
    #title
    news_title = soup.title.text
     #paragraph text
    news_p = soup.find_all('p')
    news_p_text = []
    for paragraph in news_p:
        news_p_text.append(paragraph.text)

    # space image save
    
    # While chromedriver is open go to JPL's Featured Space Image page. 
    url2 = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    browser.visit(url2)

    # Scrape the browser into soup and use soup to find the full resolution image of mars
    # Save the image url to a variable called `featured_image_url`
    html = browser.html
    soup = bs(html, 'html.parser')
    image = soup.find('img', class_="thumb")["src"]
    img_url = "https://jpl.nasa.gov"+image
    featured_image_url = img_url
    
    # Add the featured image url to the dictionary
    mars["image"] = featured_image_url

   
    
   
 
    url_new = 'https://space-facts.com/mars/'
    response_new = requests.get(url_new)
    soup_new = bs(response_new.text, 'html.parser')
    mars_fact_table = soup_new.find_all('tr')
    mars_fact_data = []
    for tr in mars_fact_table:
        mars_fact_data.append(tr.text)
        
    mars_fact_df = pd.DataFrame(mars_fact_data)
    
    mars_table = mars_fact_df[0].str.split(":", n=1, expand = True)
    
    mars_table = mars_table.rename(columns={ 0 : "Description", 1 : "Data"})
    fin_table = mars_table.to_html(index=False)
    fin_table = fin_table.replace("\n", "")
    fin_table

    
    url4 = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
    browser.visit(url4)
    html = browser.html
    soup = bs(html, 'html.parser')
    mars_hemis=[]

    for i in range (4):
        time.sleep(5)
        images = browser.find_by_tag('h3')
        images[i].click()
        html = browser.html
        soup = bs(html, 'html.parser')
        partial = soup.find("img", class_="wide-image")["src"]
        img_title = soup.find("h2",class_="title").text
        img_url = 'https://astrogeology.usgs.gov'+ partial
        dictionary={"title":img_title,"img_url":img_url}
        mars_hemis.append(dictionary)
        browser.back()
        

    

   
    mars["title"] = news_title
    mars["paragraph"] = news_p_text
    
    mars["table"] = fin_table
    mars["hemisphere"] = mars_hemis



    browser.quit()
    return mars