document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const backButton = document.getElementById("backButton");

    // 폼 제출 이벤트
    form.addEventListener("submit", function (event) {
        const writer = document.getElementById("writer").value;
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;

        // 필수 항목이 비어있는지 확인
        if (!title || !content) {
            event.preventDefault(); // 폼 제출 막기
            alert("제목, 내용은 필수 입력 사항입니다.");
        } else {
            alert("게시글이 작성되었습니다!");
        }
    });

    // 뒤로 가기 버튼 클릭 이벤트
    if (backButton) {
        backButton.addEventListener("click", function () {
            window.history.back(); // 이전 페이지로 돌아가기
        });
    }
});
