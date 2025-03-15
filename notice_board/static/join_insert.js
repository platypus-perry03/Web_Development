$(document).ready(function () {
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();  // 폼 제출을 막고 AJAX로 처리

        // 폼 데이터를 가져옵니다.
        var formData = {
            id: $('#id').val(),
            pw: $('#pw').val()
        };

        // AJAX 요청을 보냄
        $.ajax({
            url: '/login',
            type: 'POST',
            contentType: 'application/json',  // JSON 형식으로 전송
            data: JSON.stringify(formData),  // 데이터를 JSON 문자열로 변환하여 보냄
            success: function (response) {
                console.log('서버 응답:', response);  // 응답 확인용 로그 출력

                if (response.success) {
                    // 로그인 성공 시
                    window.location.href = '/main';  // main 페이지로 리디렉션
                } else {
                    // 로그인 실패 시
                    alert(response.error);  // 오류 메시지 표시
                }
            },
            error: function () {
                // 오류 발생 시
                alert('로그인 처리 중 문제가 발생했습니다.');
            }
        });
    });
});
