import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import FinanceDataReader as fdr
import pytz

from datetime import *
def BollingerResult(companyName, dateEndDate):
    # Bollinger Bands 계산을 위한 기간 설정
    lookback_period = 40
    
    try:
      companyList= list(str(data[companyName]))
      while len(companyList) != 6:
         companyList.insert(0, "0")
      
      szCompany = "".join(companyList)
    except:
        return -1

    dateEndDate = datetime.strptime(dateEndDate, "%Y-%m-%d %H:%M:%S")
    # 시작 날짜 설정
    szStartDate = str(dateEndDate - timedelta(days=lookback_period))[:-9]

    # 주식 데이터 가져오기
    FinData = fdr.DataReader(szCompany, szStartDate, dateEndDate - timedelta(days=1))

    if FinData is None or FinData.empty:
      return -1

    # 주가의 20일 이동평균 계산
    FinData['MA20'] = FinData['Close'].rolling(window=20).mean()

    # 볼린저 밴드 계산
    FinData['UpperBand'] = FinData['MA20'] + 2 * FinData['Close'].rolling(window=20).std()
    FinData['LowerBand'] = FinData['MA20'] - 2 * FinData['Close'].rolling(window=20).std()

    # 종가와 상한선, 하한선 비교
    FinData['Signal'] = ''
    FinData.loc[FinData['Close'] > FinData['UpperBand'], 'Signal'] = 0
    FinData.loc[FinData['Close'] < FinData['LowerBand'], 'Signal'] = 2
    FinData.loc[FinData['Signal'] == '', 'Signal'] = 1

    # 결과 출력
    #print(FinData[['Close', 'MA20', 'UpperBand', 'LowerBand', 'Signal']])

    # 최근 한 건의 결과를 리턴
    return [FinData['Signal'].iloc[-1]]

data = {
    '디어유': 376300,
    '카카오': 35720,
    '플리토': 300080,
    '자이언트스텝': 289220,
    '아프리카TV': 67160,
    '미스터블루': 207760,
    '네이버': 35420,
    'FSN': 214270,
    '핑거스토리': 417180,
    '탑코미디어': 134580,
    '판도라티비': 202960,
    '캐리소프트': 317530,
    '메쎄이상': 408920,
    '키다리스튜디오': 20120,
    '줌인터넷': 239340,
    'THE E&M': 89230,
    '티사이언티픽': 57680,
    '레뷰코퍼레이션': 443250,
    '인스웨이브시스템즈': 450520,
    '비트나인': 357880,
    '나라소프트': 288490,
    '슈어소프트테크': 298830,
    '코난테크놀로지': 402030,
    '지니언스': 263860,
    '샌즈랩': 411080,
    '오브젠': 417860,
    '맥스트': 377030,
    '스코넥': 276040,
    '모아데이타': 288980,
    'SGA솔루션즈': 184230,
    'MDS테크': 86960,
    '알체라': 347860,
    'SGA': 49470,
    '폴라리스오피스': 41020,
    '비즈니스온': 138580,
    '한컴위드': 54920,
    '버넥트': 438700,
    '바이브컴퍼니': 301300,
    '핀텔': 291810,
    '위세아이텍': 65370,
    '지란지교시큐리티': 208350,
    '인지소프트': 100030,
    '시큐레터': 418250,
    '오상자이엘': 53980,
    '한글과컴퓨터': 30520,
    '이스트소프트': 47560,
    '산돌': 419120,
    '소프트캠프': 258790,
    '누리플렉스': 40160,
    '모니터랩': 434480,
    '핸디소프트': 220180,
    '케이사인': 192250,
    '오비고': 352910,
    '라온피플': 300120,
    '지슨': 289860,
    '네오리진': 94860,
    '키네마스터': 139670,
    '이글루': 67920,
    '더존비즈온': 12510,
    '브레인즈컴퍼니': 99390,
    '투비소프트': 79970,
    '이노룰스': 296640,
    '아톤': 158430,
    '엠로': 58970,
    '세중': 39310,
    '라온시큐어': 42510,
    '윈스': 136540,
    '미디어젠': 279600,
    '이노시뮬레이션': 274400,
    '아이퀘스트': 262840,
    '알티캐스트': 85810,
    '안랩': 53800,
    '한싹': 430690,
    '엑셈': 205100,
    '영림원소프트랩': 60850,
    '에스에스알': 275630,
    '텔코웨어': 78000,
    '시큐브': 131090,
    '네이블': 153460,
    '웹케시': 53580,
    '디모아': 16670,
    '휴네시온': 290270,
    '이니텍': 53350,
    '플랜티넷': 75130,
    '링크제니시스': 219420,
    '씨유박스': 340810,
    '파수': 150900,
    '알서포트': 131370,
    '엑스게이트': 356680,
    '포시에스': 189690,
    '디지캡': 197140,
    '신시웨이': 290560,
    '비플라이소프트': 148780,
    '포스코DX': 22100,
    '카카오페이': 377300,
    '다날': 64260,
    '라피치': 403360,
    '코닉오토메이션': 391710,
    '크라우드웍스': 355390,
    '나무기술': 242040,
    '티라유텍': 322180,
    '현대오토에버': 307950,
    '솔트룩스': 304100,
    '쿠콘': 294570,
    '딥노이드': 315640,
    '소프트센': 32680,
    '씨이랩': 189330,
    '브리지텍': 64480,
    '굿센': 243870,
    '마음AI': 377480,
    '이노뎁': 303530,
    '에스트래픽': 234300,
}
