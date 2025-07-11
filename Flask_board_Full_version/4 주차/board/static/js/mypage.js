document.addEventListener("DOMContentLoaded", () => {
    const editBtn = document.getElementById("editBtn"); // 변경 버튼
    const saveBtn = document.getElementById("saveBtn"); // 저장 버튼
    const backBtn = document.getElementById("backBtn"); // 뒤로 버튼

    const fields = ["name", "school", "email", "introduce"];
    const viewElems = fields.map(f => document.getElementById(f + "View"));
    const inputElems = fields.map(f => document.getElementById(f + "Input"));
    const imageInput = document.getElementById("profile_image");

    let isEditing = false;

    if (editBtn) {
        editBtn.addEventListener("click", () => {
            isEditing = true;
            editBtn.style.display = "none";
            saveBtn.style.display = "inline-block";
            imageInput.style.display = "block";
            viewElems.forEach(v => v.style.display = "none");
            inputElems.forEach(i => i.style.display = "block");
        });
    }

    backBtn.addEventListener("click", () => {
        const from = backBtn.dataset.from || "index";
        if (isEditing) {
            // 편집 중 → 취소
            isEditing = false;
            saveBtn.style.display = "none";
            if (editBtn) editBtn.style.display = "inline-block";
            imageInput.style.display = "none";
            viewElems.forEach(v => v.style.display = "block");
            inputElems.forEach(i => i.style.display = "none");
        } else {
            // 보기 상태 → 원래 페이지로 이동
            if (from === "users") {
                window.location.href = "/users";
            } else {
                window.location.href = "/index";
            }
        }
    });

    if (imageInput) {
        imageInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                    document.getElementById("previewImage").src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});
