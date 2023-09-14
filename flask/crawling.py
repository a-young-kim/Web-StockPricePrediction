from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import pandas as pd
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from datetime import datetime, timedelta
import re
from konlpy.tag import Okt
from string import whitespace, punctuation

def crawling(company):
    now = datetime.now()
    date = now.date()
    print("startcrawling")
    if now.time() > datetime.strptime("15:30:00", "%H:%M:%S").time():
        df = findArticle(date, company, False)
    else:
        df = findArticle(date, company, True)
    print("startpreprocessing")
    result = preprocessing(df, now, company)
    return result

def findArticle(date, company, isOnly):
    end_date = date
    start_date = date
    if isOnly:
        start_date = date - timedelta(days=1)
    dateList = pd.date_range(start=start_date, end=end_date, freq='D').strftime('%Y.%m.%d')

    chrome_options = Options()
    chrome_options.add_experimental_option("detach", True)
    chrome_options.add_experimental_option("excludeSwitches", ["enable-logging"])
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')

    driver = webdriver.Chrome(options=chrome_options)
    driver.implicitly_wait(10)

    df = pd.DataFrame(columns=['title'])

    for i in range(0, len(dateList)):
        saveDate = dateList[i]
        
        url = f'https://search.naver.com/search.naver?where=news&sm=tab_pge&query={company}&sort=0&photo=3\
            &field=0&pd=3&ds={saveDate}&de={saveDate}&cluster_rank=215&mynews=0&office_type=0&office_section_code=0\
            &news_office_checked=&nso=so:r,p:from{saveDate.replace(".", "")}to{saveDate.replace(".", "")},a:all&start=0'

        driver.get(url)

        while True:
            for j in range(1, 11):
                try:
                    # 기사 찾아서 클릭
                    x_path = f'/html/body/div[3]/div[2]/div/div[1]/section/div/div[2]/ul/li[{j}]/div/div/div[1]/div[2]/a[2]'
                    WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, x_path))).click()

                    # 창 변경
                    WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.TAG_NAME, 'body')))
                    driver.switch_to.window(driver.window_handles[1])

                    # 기사 수집
                    title = driver.find_element(By.XPATH, '//*[@id="title_area"]/span').text
                    ContentTime = driver.find_element(By.XPATH, '//*[@id="ct"]')\
                        .find_element(By.CLASS_NAME,"media_end_head_info_datestamp_time._ARTICLE_DATE_TIME")\
                        .get_attribute("data-date-time").split(" ")[1]
                    
                    if (isOnly == True) and (ContentTime >= "15:30:00"):
                        df.loc[df.shape[0]] = [title]

                    elif isOnly == False:
                        if (i == 0) and (ContentTime <"15:30:00"):
                            pass
                        else:
                            df.loc[df.shape[0]] = [title]

                    driver.close()
                    driver.switch_to.window(driver.window_handles[0])


                except:
                    driver_count = len(driver.window_handles)
                    if driver_count == 1:
                        break
                    for j in range(1, driver_count):
                        driver.switch_to.window(driver.window_handles[j])
                        driver.close()
                        driver.switch_to.window(driver.window_handles[j - 1])

            try:
                button = driver.find_element(By.XPATH, '//*[@id="main_pack"]').find_element(By.CLASS_NAME, "btn_next").get_attribute("aria-disabled")

                cnt += 1
                if button == 'false':
                    driver.find_element(By.XPATH, '//*[@id="main_pack"]/div[2]/div/a[2]').click()

                else:
                    break
                
            except:
                break

    driver.quit()
    return df

def preprocessing(df, now, company):

    result = []
    
    df['cleaned_title'] = df['title'].apply(CleanEnd)
    df['filtered_title'] = df['cleaned_title'].apply(TextFilter)
    

    result.append(' '.join(df['filtered_title']))

    result.append(company)
    result.append(now.strftime("%Y-%m-%d %H:%M:%S"))

    return result


def CleanEnd(text):
    email = re.compile(r'[-_0-9a-z]+@[-_0-9a-z]+(?:\.[0-9a-z]+)+', flags=re.IGNORECASE)
    url = re.compile(r'(?:https?:\/\/)?[-_0-9a-z]+(?:\.[-_0-9a-z]+)+', flags=re.IGNORECASE)
    etc = re.compile(r'\.([^\.]*(?:기자|특파원|교수|작가|대표|논설|고문|주필|부문장|팀장|장관|원장|연구원|이사장|위원|실장|차장|부장|에세이|화백|사설|소장|단장|과장|기획자|큐레이터|저작권|평론가|©|©|ⓒ|\@|\/|=|▶|무단|전재|재배포|금지|\[|\]|\(\))[^\.]*)$')
    bracket = re.compile(r'^((?:\[.+\])|(?:【.+】)|(?:<.+>)|(?:◆.+◆)\s)')
    
    result = email.sub('', text)
    result = url.sub('', result)
    result = etc.sub('.', result)
    result = bracket.sub('', result).strip()

    return result

def TextFilter(text):
    punct = ''.join([chr for chr in punctuation if chr != '%'])
    filtering = re.compile(f'[{whitespace}{punct}]+')
    onlyText = re.compile(r'[^\% 0-9a-zA-Zㄱ-ㅣ가-힣]+')

    result = filtering.sub(' ', text)
    result = onlyText.sub(' ', result).strip()
    result = filtering.sub(' ', result)
    
    return result