document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form"); // 로그인 폼 선택

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // 기본 폼 제출 동작 방지

        const id = document.getElementById("insert_id").value;  // 입력된 아이디 가져오기
        const pw = document.getElementById("insert_pw").value;  // 입력된 비밀번호 가져오기

        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, pw }),
        });

        const data = await response.json(); // 서버에서 받은 JSON 응답 처리

        if (data.success) {
            alert(data.message); // 로그인 성공 메시지 출력
            window.location.href = "/index"; // 로그인 성공 시 index.html로 이동
        } else {
            alert(data.message); // 로그인 실패 시 오류 메시지 출력
        }
    });
});
