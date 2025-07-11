$(document).ready(function () {
    $('#writeForm').on('submit', function (e) {
        e.preventDefault();  // 폼 제출을 막고 AJAX로 처리

        // 폼 데이터를 가져옵니다.
        var formData = {
            title: $('#title').val(), //
            content: $('#content').val()
        };

        // AJAX 요청을 보냄
        $.ajax({
            url: '/write',  // 서버의 '/write' 엔드포인트로 전송
            type: 'POST',  // POST 방식
            contentType: 'application/json',  // JSON 형식으로 전송
            dataType: 'json',  // 응답을 JSON 형식으로 받음
            data: JSON.stringify(formData),  // 데이터를 JSON 형식으로 보냄
            success: function (response) {
                console.log('서버 응답:', response);
                if (response.success) {
                    alert('글이 작성되었습니다.');
                    window.location.href = '/main';  // 메인 페이지로 리디렉션
                } else {
                    alert('오류 발생: ' + response.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('AJAX 요청 오류:', textStatus, errorThrown); // 개발자 도구 콘솔에서 오류 출력
                console.error('응답 내용:', jqXHR.responseText); //jqXHR.responseTExt를 통해 서버에서 오류 확인
                alert('글 작성 처리 중 문제가 발생했습니다.'); // 요청 실패 시 오류 메시지지
            }
        });
    });
});
