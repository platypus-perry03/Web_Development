document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".read-link");

    links.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();  // 기본 이동 막기

            const postId = this.dataset.id;
            const secret = this.dataset.secret;

            // 비밀글일 경우만 처리
            if (secret) {
                const inputPw = prompt("비밀글입니다. 비밀번호를 입력하세요:");

                if (inputPw === null || inputPw.trim() === "") {
                    alert("비밀번호 입력이 취소되었습니다.");
                    return;
                }

                if (!/^\d{4}$/.test(inputPw)) {
                    alert("비밀번호는 숫자 4자리로 입력해야 합니다.");
                    return;
                }

                // 해당 게시글에 비밀번호가 존재하면면 서버에 확인 요청
                fetch(`/secret_check/${postId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ password: inputPw })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.result === "success") {
                        window.location.href = `/read/${postId}`;
                    } else {
                        alert("비밀번호가 일치하지 않습니다.");
                    }
                })
                .catch(err => {
                    console.error("오류:", err);
                    alert("서버 오류가 발생했습니다.");
                });

            } else {
                // 일반글이면 바로 이동
                window.location.href = `/read/${postId}`;
            }
        });
    });
});
