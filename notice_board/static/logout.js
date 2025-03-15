$(document).ready(function () {
    // 로그아웃 버튼 클릭 시 처리
    $('#logoutButton').on('click', function (e) {
        e.preventDefault();  // 기본 링크 동작을 막음
        console.log("로그아웃 버튼 클릭됨");  // 버튼 클릭 확인 로그 추가

        // 로그아웃 요청을 보냄
        $.ajax({
            url: '/logout',  // Flask 서버의 /logout 엔드포인트로 요청
            type: 'GET',  // GET 방식으로 요청
            success: function (response) {
                console.log('로그아웃 응답:', response);  // 응답을 콘솔에 출력

                if (response.success) {
                    alert('로그아웃되었습니다.');
                    window.location.href = '/login';  // 로그인 페이지로 리디렉션
                } else {
                    alert('로그아웃 실패: ' + response.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('AJAX 요청 오류:', textStatus, errorThrown);
                alert('로그아웃 처리 중 오류가 발생했습니다.');
            }
        });
    });
});
