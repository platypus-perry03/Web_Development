document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.querySelector("#searchForm");
    const searchOption = document.querySelector("#searchOption");
    const searchQuery = document.querySelector("#searchQuery");

    if (searchForm) {
        searchForm.addEventListener("submit", function (event) {
            if (searchOption.value === "all" && searchQuery.value.trim() === "") {
                return true; // 전체 검색 시 입력 없이도 통과
            }
        });
    }
});
