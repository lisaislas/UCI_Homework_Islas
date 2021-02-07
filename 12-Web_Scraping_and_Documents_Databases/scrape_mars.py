#!/usr/bin/env python
# coding: utf-8



import numpy as np
import pandas as pd
from splinter import Browser
from bs4 import BeautifulSoup as bs

import requests
import re
from webdriver_manager.chrome import ChromeDriverManager



def scrape_info():

    mars = {}





    #get_ipython().system('which chromedriver')





    executable_path = {'executable_path': ChromeDriverManager().install()}
    browser = Browser('chrome', **executable_path, headless=False)




    url = 'https://mars.nasa.gov/news'
    browser.visit(url)
    html = browser.html
    soup = bs(html, 'html.parser')





    article = soup.find("div", class_="list_text")
    news_title = article.find("div", class_="content_title").text
    news_p = article.find("div", class_="article_teaser_body").text
    print(news_title)
    print(news_p)
    mars["news_title"] = news_title
    mars["news_p"] = news_p
    #print(news_title)


    # Featured Images




    # url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    base_url = 'https://www.jpl.nasa.gov'
    url = base_url + '/spaceimages/?search=&category=Mars'




    browser.visit(url)
    html = browser.html
    soup = bs(html, 'html.parser')




    image_url = soup.find("a", class_= "button fancybox")["data-fancybox-href"]
    featured_image_url = base_url + image_url
    print(featured_image_url)
    mars["featured_image"] = featured_image_url


    # Mars Facts




    url = 'https://space-facts.com/mars/'





    tables = pd.read_html(url)
    tables





    mars_facts_df = tables[0]
    mars_facts_df.columns = ['Fact', 'Value']
    mars_facts_df['Fact'] = mars_facts_df['Fact'].str.replace(':', '')
    mars_facts_df





    mars_facts_df = tables[0]
    mars_facts_df.columns = ['Fact', 'Value']
    mars_facts_df['Fact'] = mars_facts_df['Fact'].str.replace(':', '')
    mars_facts_df
    mars_facts_html = mars_facts_df.to_html()
    print(mars_facts_html)
    mars["facts"] = mars_facts_html


    # Mars Hemispheres

    # In[14]:


    base_url = 'https://astrogeology.usgs.gov'
    url = base_url + '/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'





    browser.visit(url)
    html = browser.html
    soup = bs(html, 'html.parser')





    items = soup.find_all('div', class_='item')





    urls = []
    titles = []
    for item in items:
        urls.append(base_url + item.find('a')['href'])
        titles.append(item.find('h3').text.strip())
    print(urls)
    titles




    browser.visit(urls[0])
    html = browser.html
    soup = bs(html, 'html.parser')
    oneurl = base_url+soup.find('img', class_='wide-image')['src']
    oneurl





    image_urls = []
    for oneurl in urls:
        browser.visit(oneurl)
        html = browser.html
        soup = bs(html,'html.parser')
        oneurl = base_url+soup.find('img',class_='wide-image')['src']
        image_urls.append(oneurl)
    image_urls





    hemisphere_images_urls = []

    for i in range(len(titles)):
        hemisphere_images_urls.append({'title':titles[i],'image_url':image_urls[i]})
        
    hemisphere_images_urls
    mars["hemispheres"] = hemisphere_images_urls




    #for i in range(len(hemisphere_images_urls)):
    # print(hemisphere_images_urls[i]['title'])
        #print(hemisphere_images_urls[i]['image_url'] + '\n')





    return mars

if __name__ == "__main__":
    print(scrape_info())