document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("searchForm");
    var progressModal = document.getElementById("progressModal");
  
    form.addEventListener("submit", function(event) {
      event.preventDefault(); // 기본 폼 제출 동작을 막음
  
      // 모달 표시
      showModalWithFocus();
  
      // 여기서 실제로 수행해야 할 작업을 시뮬레이션
      setTimeout(function() {
        // 작업 완료 후 모달 닫기
        hideModal();
  
        // 다음 작업 또는 동작 실행
        alert("진행이 완료되었습니다. 다음으로 넘어갑니다.");
  
        // 폼 제출
        form.submit();
      }, 3000); // 시뮬레이션을 위해 3초 대기
    });
  });
  
  function showModalWithFocus() {
    var progressModal = document.getElementById("progressModal");
    var modal = new bootstrap.Modal(progressModal);
    modal.show();
  
    // 모달 표시 후 입력 요소에 포커스
    progressModal.addEventListener('shown.bs.modal', function() {
      var input = progressModal.querySelector('input');
      if (input) {
        input.focus();
      }
    });
  }
  
  function hideModal() {
    var progressModal = document.getElementById("progressModal");
    var modal = bootstrap.Modal.getInstance(progressModal);
    modal.hide();
  }
  
  
