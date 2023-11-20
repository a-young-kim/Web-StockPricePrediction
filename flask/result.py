import pandas as pd
from kobert import *
from bolingerBand import *
from sklearn.metrics import f1_score
from joblib import dump, load
import numpy as np
from sklearn.neural_network import MLPClassifier

loaded_model = load('best_last_model.joblib')
def resultModel(kobert, band):

    features = np.hstack((np.array([kobert]), np.array([band])))

    logits = loaded_model.predict(features)
    labels = ["하락", "횡보", "상승"]  # 분류에 맞게 클래스 레이블을 정의해야 합니다.
    predicted_label = labels[np.argmax(logits)]

    print(predicted_label)
    return predicted_label



