function Delete(postId) {
    const postWriter = "{{ post.writer }}";  // 템플릿에서 작성자 이름을 가져옴

    //console.log("Post Writer:", postWriter);  // 디버깅: 확인

    if (confirm("정말 삭제하시겠습니까?")) {
        let currentUrl = window.location.pathname;  // 예: "/read/17"
        let deleteUrl = currentUrl.replace('read', 'delete'); // "/delete/17"

        fetch(deleteUrl, {
            method: 'POST',  // POST 요청으로 삭제
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'username': postWriter  // 작성자 이름을 함께 보내기
            })
        }).then(response => {
            if (response.ok) {
                window.location.href = "/index";  // 삭제 후 홈 또는 게시글 목록으로 리다이렉트
            } else {
                alert("삭제 실패: 작성자만 삭제할 수 있습니다.");
            }
        }).catch(error => {
            console.error('삭제 중 오류 발생:', error);
            alert("삭제 중 오류가 발생했습니다.");
        });
    }
}
