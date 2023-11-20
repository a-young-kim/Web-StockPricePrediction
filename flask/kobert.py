import torch
from kobert_tokenizer import KoBERTTokenizer
from transformers import BertModel
from bert import *  
import gluonnlp as nlp
from torch.utils.data import DataLoader

device = torch.device("cpu")

loaded_model = BERTClassifier(BertModel.from_pretrained('skt/kobert-base-v1', return_dict=False), dr_rate=0.5)

loaded_model.load_state_dict(torch.load('best_model.pth', map_location=device))
loaded_model.to(device)
loaded_model.eval()

tokenizer = KoBERTTokenizer.from_pretrained('skt/kobert-base-v1')
vocab = nlp.vocab.BERTVocab.from_sentencepiece(tokenizer.vocab_file)
max_len = 64

def kobert(text):
    input = [[text, '-1']]
    # input 처리
    input_text = BERTDataset(input, 0, 1, tokenizer, vocab, max_len, True, False)
    input_dataloader = DataLoader(input_text, batch_size = 64, num_workers = 0)

    for batch_id, (token_ids, valid_length, segment_ids, label) in enumerate(input_dataloader):
        token_ids = token_ids.long().to(device)
        segment_ids = segment_ids.long().to(device)

        valid_length= valid_length
        label = label.long().to(device)

        outputs = loaded_model(token_ids, valid_length, segment_ids)

        # 분류 결과
        logits = outputs.detach().cpu().numpy()

        # 클래스 레이블을 얻고 예측 결과 출력
        labels = ["하락", "횡보", "상승"]  # 분류에 맞게 클래스 레이블을 정의해야 합니다.
        predicted_label = labels[np.argmax(logits)]

        result = {
            'text': input[0][0],
            'class': predicted_label,
            'logits': logits[0].tolist()
        }

    return result, logits[0]