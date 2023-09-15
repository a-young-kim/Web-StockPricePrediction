
document.addEventListener("DOMContentLoaded", function() {
  var form = document.getElementById("searchForm"); // 폼 요소 가져오기
  var progressModal = new bootstrap.Modal(document.getElementById("progressModal"));

  form.addEventListener("submit", async function(event) {
      event.preventDefault(); // 기본 폼 제출 동작을 막음
      const company = form.querySelector('input[type="search"]').value; // 회사명
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

          // 여기서 response를 처리하거나, 다음 작업을 진행할 수 있습니다.
          const responseData = await response.json();
          console.log('Response:', responseData);

          setModalText("데이터 수집 완료 및 예측 시작");

          // 모달 숨기기
          await sleep(1000);

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
