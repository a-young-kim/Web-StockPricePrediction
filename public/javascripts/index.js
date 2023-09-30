
document.addEventListener("DOMContentLoaded", function() {
  
  const RightDiv = document.getElementById("RightDiv");
  const title = document.getElementById("title"); 
  const subTitle = document.getElementById("subTitle"); 

  RightDiv.addEventListener('mouseenter', () => {
      const RightDivColor = document.querySelector('#RightDiv'); 
      if (getComputedStyle(RightDivColor).backgroundColor === 'rgb(211, 211, 211)') {
          title.textContent = '예측 결과가 입력되는 공간입니다.';
          subTitle.textContent = '왼쪽 아래의 입력란에 회사 이름을 적어보세요.';

      }
  });

  RightDiv.addEventListener('mouseleave', () => {
      const RightDivColor = document.querySelector('#RightDiv');
      if (getComputedStyle(RightDivColor).backgroundColor === 'rgb(255, 255, 0)') {
          title.textContent = '';
          subTitle.textContent = '';
      }
  });


  var form = document.getElementById("searchForm"); // 폼 요소 가져오기
  var progressModal = new bootstrap.Modal(document.getElementById("progressModal"));

  form.addEventListener("submit", async function(event) {
      event.preventDefault(); // 기본 폼 제출 동작을 막음
      const company = form.querySelector('input[type="search"]').value; // 회사명

      const companyText = document.getElementById("company");
      companyText.textContent = 'company: ' + company;

      setModalText("데이터 수집 시작");

      showModalWithFocus(progressModal);

      try {
          const response = await fetch("/", {
              method: "POST",
              body: JSON.stringify({ company: company }),
              headers: {
                "Content-Type": "application/json",
              },
          });

          const responseData = await response.json();
          console.log('Response:', responseData);

          setModalText("데이터 수집 완료 및 예측 시작");

          // 모델 학습 시작
          const response2 = await fetch("/model", {
            method: "POST",
            body: JSON.stringify(responseData),
            headers: {
              "Content-Type": "application/json",
            },
          });

          const responseData2 = await response2.json();
          console.log('Response2:', responseData2);
          title.textContent = responseData2.class;

          if(title.textContent === '상승'){
            changeBackgroundColor('red');
          }

          else if(title.textContent === '하락'){
            changeBackgroundColor('blue');
          }

          else if(title.textContent === '중립') {
            changeBackgroundColor('green');
          }

          hideModal(progressModal);

      } catch (error) {
          console.error('Error:', error);
          hideModal(progressModal);
          alert('작업 도중 오류가 발생했습니다.');
      }
  });

  function showModalWithFocus(modal) {
      modal.show();

      // 모달 표시 후 입력 요소에 포커스
      var input = modal._element.querySelector('input');
      if (input) {
          input.focus();
      }
  }

  function hideModal(modal) {
    modal.hide();
  }

  function setModalText(text){
    const modalText = document.getElementById("modal-text");

    modalText.textContent = text;
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function changeBackgroundColor(color) {
  RightDiv.style.backgroundColor = color;
}