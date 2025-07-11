document.addEventListener("DOMContentLoaded", function () {
    // 아이디 중복 체크
    const checkIdButton = document.getElementById("id_check");
    if (checkIdButton) {
        checkIdButton.addEventListener("click", function () {
            let regist_id = document.getElementById("regist_id").value;

            if (regist_id) {
                fetch("/check_id", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ regist_id })
                })
                .then(response => response.json())
                .then(data => {
                    const messageElement = document.getElementById("idCheckMessage");

                    if (messageElement) {
                        if (data.success) {
                            messageElement.innerText = "사용 가능한 아이디입니다.";
                            messageElement.style.color = "green";
                        } else {
                            messageElement.innerText = "이미 사용 중인 아이디입니다.";
                            messageElement.style.color = "red";
                        }
                    } else {
                        console.error("idCheckMessage 요소를 찾을 수 없습니다.");
                    }
                })
                .catch(error => console.error("Error:", error));
            } else {
                alert("아이디를 입력해주세요.");
            }
        });
    }

    // 회원가입 폼 제출 시 처리
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            // 입력된 데이터 가져오기
            const name = document.getElementById("name").value;
            const regist_id = document.getElementById("regist_id").value;
            const regist_pw = document.getElementById("regist_pw").value;
            const school = document.getElementById("school").value;
            const phonenum = document.getElementById("phonenum").value;
            const email = document.getElementById("email").value;

            // 모든 필드가 채워졌는지 확인
            if (!name || !regist_id || !regist_pw || !school || !phonenum || !email) {
                alert("모든 필드를 입력해주세요.");
                return;
            }

            // fetch 요청으로 서버에 데이터 보내기
            fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    regist_id: regist_id,
                    regist_pw: regist_pw,
                    school: school,
                    phonenum: phonenum,
                    email: email
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    window.location.href = '/login';
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error("회원가입 중 오류 발생:", error);
                alert("회원가입 중 오류가 발생했습니다.");
            });
        });
    }
});