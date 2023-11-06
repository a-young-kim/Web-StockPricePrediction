import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import FinanceDataReader as fdr
import pytz

from datetime import *

class Bollingers:
  def __init__(self, df, k, window):
    self.df = df
    self.k = k
    self.window = window

    # compute rolling calculations
    self.df['Rolling Average'] = self.df['Close'].rolling(window=self.window,center=False).mean()
    self.df['Rolling St Dev'] = self.df['Close'].rolling(window=self.window,center=False).std()

    # compute bollingers
    self.df['Bollinger Top'] = self.df.apply(lambda row: self.bollinger('top', row['Rolling Average'], row['Rolling St Dev']), axis=1)
    self.df['Bollinger Bottom'] = self.df.apply(lambda row: self.bollinger('bottom', row['Rolling Average'], row['Rolling St Dev']), axis=1)

  def bollinger(self, top_or_bottom, rolling_av, rolling_std):
    if top_or_bottom == 'top':
        return rolling_av + self.k*rolling_std
    elif top_or_bottom == 'bottom':
        return rolling_av - self.k*rolling_std
    else:
        raise ValueError('Expect "top" or "bottom" for top_or_bottom')

def BollingerResult(szCompany):
  # 1. Crawling
  korean= pytz.timezone('Asia/Seoul')
  if (datetime.now(korean).strftime('%H:%M:%S')>='15:30:00'): szEndDate= str(datetime.now(korean)+timedelta(days=1)).split(' ')[0]
  else: szEndDate= str(datetime.now(korean)).split(' ')[0]
  dateEndDate = datetime.strptime(szEndDate, "%Y-%m-%d")
  szStartDate = str(dateEndDate- timedelta(days=20))[:-9]

  while (True):
    FinData = fdr.DataReader(szCompany, szStartDate, dateEndDate)
    if len(FinData)!= 20:
      szStartDate = datetime.strptime(szStartDate, "%Y-%m-%d")
      szStartDate= str(szStartDate- timedelta(days=(20-len(FinData))))[:-9]
    else: break
  FinData= FinData.reset_index()

  # 2. Bollinger Band
  bollingers = Bollingers(FinData, 3, 20)
  fBollTop= (bollingers.df.iloc[-1, -2])
  fBollBot= (bollingers.df.iloc[-1, -1])
  BeforeClose= FinData.iloc[-1,4]

  szPredict=''
  if BeforeClose>fBollTop: szPredict= '감소'
  elif BeforeClose<fBollBot: szPredict= '상승'
  else: szPredict= '횡보'
  print(szEndDate, "주식 예측 결과:", szPredict)