document.querySelector("form").addEventListener("submit", function(event) {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (title.trim() === "" || content.trim() === "") {
        event.preventDefault();
        alert("제목과 내용은 필수입니다.");
    }
});
