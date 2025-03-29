document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const backButton = document.getElementById("backButton");

    // 비밀글 체크박스 & 입력칸
    const isSecretCheckbox = document.getElementById("is_secret");
    const secretPwInput = document.getElementById("secret_pw");

    // 폼 제출 이벤트
    form.addEventListener("submit", function (event) {
        const writer = document.getElementById("writer").value;
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;

        // 필수 입력 항목 확인
        if (!title || !content) {
            event.preventDefault();
            alert("제목, 내용은 필수 입력 사항입니다.");
            return;
        }

        // 비밀글일 경우 비밀번호 유효성 검사 (숫자 4자리)
        if (isSecretCheckbox.checked) {
            const pw = secretPwInput.value;
            const isValid = /^\d{4}$/.test(pw);
            if (!isValid) {
                event.preventDefault();
                alert("비밀글 비밀번호는 숫자 4자리로 입력해야 합니다.");
                return;
            }
        }

        alert("게시글이 작성되었습니다!");
    });

    // 뒤로 가기 버튼
    if (backButton) {
        backButton.addEventListener("click", function () {
            window.history.back();
        });
    }

    // 체크박스 변경 시 입력칸 보이기/숨기기
    if (isSecretCheckbox && secretPwInput) {
        isSecretCheckbox.addEventListener("change", function () {
            if (this.checked) {
                secretPwInput.style.display = "inline-block";
            } else {
                secretPwInput.style.display = "none";
                secretPwInput.value = '';
            }
        });
    }
});
