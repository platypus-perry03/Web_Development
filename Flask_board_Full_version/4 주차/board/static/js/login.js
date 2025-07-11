document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // 기본 폼 제출 동작 방지

        const id = document.getElementById("insert_id").value;
        const pw = document.getElementById("insert_pw").value;

        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, pw }),
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            window.location.href = "/index";
        } else {
            alert(data.message);
        }
    });
});

// 아이디/비밀번호 찾기 선택 모달 열기
function find_idpw() {
    document.getElementById("findModal").style.display = "flex";
}

// 모달 닫기
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// 아이디/비밀번호 선택 버튼 클릭 시
function handleFind(type) {
    closeModal("findModal");

    if (type === "id") {
        // 아이디 찾기 모달 열기
        document.getElementById("find_id").style.display = "flex";
    } else if (type === "pw") {
        // 비밀번호 찾기 모달 열기
        document.getElementById("find_pw").style.display = "flex";
    }
}

let findIdAttempts = 0;  // 아이디 찾기 시도 횟수
let pwFindAttempts = 0; // 비밀번호 찾기 시도 횟수

// 아이디 찾기 - 회원 검증
async function submit_find_id() {
    const name = document.getElementById("findName").value.trim();
    const phone = document.getElementById("findPhone").value.trim();

    if (!name || !phone) {
        alert("이름과 휴대폰 번호를 모두 입력해주세요.");
        return;
    }

    try {
        const response = await fetch("/find-id", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, phone }),
        });

        const data = await response.json();

        if (data.success) {
            alert(`회원님의 아이디는: ${data.userid} 입니다.`);
            findIdAttempts = 0;  // 성공 시 시도 횟수 초기화
            closeModal("find_id");
        } else {
            findIdAttempts += 1;
            alert(`일치하는 회원 정보가 없습니다. (${findIdAttempts} / 3)`);

            if (findIdAttempts >= 3) {
                alert("3회 이상 실패하여 창을 닫습니다.");
                closeModal("find_id");
                findIdAttempts = 0;  // 초기화
            }
        }
    } catch (err) {
        console.error(err);
        alert("요청 중 오류가 발생했습니다.");
    }
}

// 비밀번호 찾기 - 회원 검증
async function submit_find_pw() {
    const userId = document.getElementById("pwFindId").value.trim();
    const phone = document.getElementById("pwFindPhone").value.trim();

    if (!userId || !phone) {
        alert("아이디와 휴대폰 번호를 모두 입력해주세요.");
        return;
    }

    try {
        const response = await fetch("/find-pw", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: userId, phone }),
        });

        const data = await response.json();

        if (data.success) {
            // 일치 → 모달 열기
            tempUserId = userId;
            tempPhone = phone;
            document.getElementById("reset_pw_modal").style.display = "flex";
        } else {
            pwFindAttempts += 1;
            alert(`일치하는 정보가 없습니다. (${pwFindAttempts} / 3)`);

            if (pwFindAttempts >= 3) {
                alert("3회 이상 실패하여 창을 닫습니다.");
                closeModal("find_pw");
                pwFindAttempts = 0;
            }
        }

    } catch (err) {
        console.error(err);
        alert("요청 중 오류가 발생했습니다.");
    }
}


// 비밀번호 찾기 - 새로운 비밀번호 설정
async function submit_new_pw() {
    const newPw = document.getElementById("newPwInput").value.trim();

    if (!validatepw(newPw)) {
        alert("비밀번호 조건: 8자 이상, 문자 + 숫자 포함");
        return;
    }

    try {
        const response = await fetch("/update-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: tempUserId,
                phone: tempPhone,
                new_password: newPw
            }),
        });

        const data = await response.json();
        alert(data.message);

        if (data.success) {
            closeModal("reset_pw_modal");
            closeModal("find_pw");
            pwFindAttempts = 0;
        }
    } catch (err) {
        console.error(err);
        alert("비밀번호 변경 중 오류 발생");
    }
}

// 새로운 비밀번호 설정 조건
function validatepw(pw) {
    if (!pw || pw.length < 8) return false;
    const hasLetter = /[a-zA-Z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    return hasLetter && hasNumber;
}

// 아이디/비밀번호 찾기 모달 창 생성 시 빈칸으로 생성 
function handleFind(type) {
    closeModal("findModal");

    if (type === "id") {
        // 입력값 초기화
        document.getElementById("findName").value = "";
        document.getElementById("findPhone").value = "";

        // 모달 열기
        document.getElementById("find_id").style.display = "flex";

    } else if (type === "pw") {
        document.getElementById("pwFindId").value = "";
        document.getElementById("pwFindPhone").value = "";

        document.getElementById("find_pw").style.display = "flex";
    }
}