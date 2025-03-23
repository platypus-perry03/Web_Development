document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".read-link").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const postID = this.getAttribute("data-id");
            window.location.href = `/read/${postID}`;
        });
    });
});
