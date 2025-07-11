document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            fetch("/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);  // 로그아웃 메시지 표시
                window.location.href = "/login";  // 로그인 페이지로 이동
            })
            .catch(error => console.error("로그아웃 중 오류 발생:", error));
        });
    }
});
