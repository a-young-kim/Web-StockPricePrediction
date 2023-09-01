from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import pandas as pd
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from datetime import datetime, timedelta
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

def crawling(company):
    now = datetime.now()
    date = now.date()
    print(now)
    if now.time() > datetime.strptime("15:30:00", "%H:%M:%S").time():
        findArticle(date, now.time(), company, False)
    else:
        findArticle(date, now.time(), company, True)

def findArticle(date, current_time, company, isLate):
    end_date = date
    start_date = date
    if isLate:
        start_date = date - timedelta(days=1)
    dateList = pd.date_range(start=start_date, end=end_date, freq='D').strftime('%Y.%m.%d')

    chrome_options = Options()
    chrome_options.add_experimental_option("detach", True)
    chrome_options.add_experimental_option("excludeSwitches", ["enable-logging"])
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')

    driver = webdriver.Chrome(options=chrome_options)
    driver.implicitly_wait(10)

    df = pd.DataFrame(columns=['회사', '날짜', '시간', '제목'])

    for i in range(0, len(dateList)):
        saveDate = dateList[i]
        if i == 0 and isLate:
            url = f'https://search.naver.com/search.naver?where=news&sm=tab_pge&query={company}&sort=0&photo=3&field=0&pd=3&ds={saveDate}&de={saveDate}&cluster_rank=215&mynews=0&office_type=0&office_section_code=0&news_office_checked=&nso=so:r,p:from{saveDate.replace(".", "")}to{saveDate.replace(".", "")},a:all&start=0'
        else:
            url = f'https://search.naver.com/search.naver?where=news&sm=tab_pge&query={company}&sort=0&photo=3&field=0&pd=3&ds={saveDate}&de={saveDate}&cluster_rank=215&mynews=0&office_type=0&office_section_code=0&news_office_checked=&nso=so:r,p:from{saveDate.replace(".", "")}to{saveDate.replace(".", "")},a:all&start=0'

        driver.get(url)

        while True:
            for j in range(1, 11):
                try:
                    article_link = driver.find_element(By.CSS_SELECTOR, f'div.news ul.list_news li:nth-child({j}) a.news_tit')
                    title = article_link.text
                    article_link.click()
                    WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CLASS_NAME, 'media_end_head_info_datestamp_time._ARTICLE_DATE_TIME')))
                    time_element = driver.find_element(By.CLASS_NAME, 'media_end_head_info_datestamp_time._ARTICLE_DATE_TIME')
                    ContentTime = time_element.get_attribute("data-date-time").split(" ")[1]

                    if i == 0 and isLate and ContentTime > "15:30:00":
                        df.loc[df.shape[0]] = [company, dateList[i], ContentTime, title]

                    driver.back()
                except:
                    break

            try:
                button = driver.find_element(By.CLASS_NAME, 'btn_next')
                if button.get_attribute("aria-disabled") == 'false':
                    button.click()
                else:
                    break
            except:
                break

    driver.quit()
    return df

# 예제 함수 호출
crawling("카카오")
