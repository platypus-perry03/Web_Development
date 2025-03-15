from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_mysqldb import MySQL
import logging

app = Flask(__name__)
app.secret_key = "your_secret_key"  # 세션을 위한 secret_key 설정

# MySQL 설정
app.config['MYSQL_HOST'] = 'localhost'  # MySQL 서버 주소
app.config['MYSQL_USER'] = 'root'  # MySQL 사용자
app.config['MYSQL_PASSWORD'] = '1234'  # MySQL 비밀번호
app.config['MYSQL_DB'] = 'flask_board'  # 사용할 데이터베이스 이름

mysql = MySQL(app)  # MySQL 객체 생성


@app.route('/')
def login_page():
    db_status = "DB 연결 실패"  # 기본값 설정
    try:
        # 데이터베이스 연결 테스트
        conn = mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT 1")  # 간단한 쿼리 실행
        cursor.close()
        db_status = "DB 연결 성공"
    except Exception as e:
        db_status = f"DB 오류: {str(e)}"

    return render_template('login.html', db_status=db_status)

@app.route('/logout')
def logout():
    session.clear()  # 세션 삭제
    return jsonify({"success": True})  # JSON 응답 반환



@app.route('/main')
def main():
    try:
        # 데이터베이스 연결
        conn = mysql.connection
        cursor = conn.cursor()

        # write_list 테이블에서 idx, writer, title, w_time 칼럼을 가져오기
        cursor.execute("SELECT idx, writer, title, w_time FROM write_list ORDER BY w_time DESC")
        posts = cursor.fetchall()

        cursor.close()  # 커서 닫기

        # 데이터를 템플릿으로 전달
        return render_template('main.html', posts=posts)

    except Exception as e:
        # 예외 처리
        return jsonify({"success": False, "error": str(e)}), 500
    
@app.route('/read/<int:idx>')
def read(idx):
    try:
        # 데이터베이스 연결
        conn = mysql.connection
        cursor = conn.cursor()

        # write_list 테이블에서 해당 idx에 맞는 글의 데이터 가져오기
        cursor.execute("SELECT idx, writer, title, content, w_time FROM write_list WHERE idx = %s", (idx,))
        post = cursor.fetchone()  # 하나의 글만 가져오므로 fetchone() 사용

        cursor.close()  # 커서 닫기

        if post:
            # 데이터를 템플릿으로 전달
            return render_template('read.html', post=post)
        else:
            return "글을 찾을 수 없습니다.", 404

    except Exception as e:
        # 예외 처리
        return jsonify({"success": False, "error": str(e)}), 500



@app.route('/write', methods=['GET', 'POST'])
def write():
    if request.method == 'POST':
        try:
            # 요청에서 JSON 데이터 읽기
            data = request.get_json()

            title = data.get('title')
            content = data.get('content')

            # 세션에서 사용자 ID 가져오기
            writer = session.get('user_inid')  # 세션에서 작성자 ID 가져오기

            if not writer:
                return jsonify({"success": False, "error": "로그인이 필요합니다."}), 400

            if not title or not content:
                return jsonify({"success": False, "error": "제목과 내용은 필수입니다."}), 400

            # MySQL 데이터베이스 연결
            conn = mysql.connection
            cursor = conn.cursor()

            # 데이터베이스에 새 글 삽입
            cursor.execute("INSERT INTO write_list (writer, title, content) VALUES (%s, %s, %s)", (writer, title, content))
            conn.commit()  # 변경 사항을 커밋

            cursor.close()  # 커서 닫기

            return jsonify({"success": True})  # 성공 시 JSON 반환

        except Exception as e:
            # 예외 발생 시 오류 메시지 반환
            return jsonify({"success": False, "error": str(e)}), 500

    # GET 요청일 때는 글 작성 폼을 렌더링
    return render_template('write.html')

    
@app.route('/login', methods=['GET', 'POST'])
def login():
    data = request.get_json()  # JSON 형식으로 데이터 받기
    user_inid = data.get("id")
    user_inpw = data.get("pw")

    # 데이터베이스 쿼리 실행
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users_join WHERE id = %s AND pw = %s", (user_inid, user_inpw))
    user = cursor.fetchone()

    if user:
        session['user'] = user_inid  # 로그인 성공 시 세션에 사용자 정보 저장
        return jsonify({"success": True, "message": "로그인 성공"})
    else:
        return jsonify({"success": False, "error": "아이디 또는 비밀번호가 틀렸습니다."})


@app.route('/join', methods=['GET', 'POST'])
def join():
    if request.method == 'POST':
        data = request.get_json()  # JSON 데이터 가져오기
        name = data['name']
        user_inid = data['id']
        user_inpw = data['pw']
        email = data['email']

        conn = mysql.connection
        cursor = conn.cursor()

        try:
            cursor.execute("INSERT INTO users_join (name, id, pw, email) VALUES (%s, %s, %s, %s)",
                           (name, user_inid, user_inpw, email))
            conn.commit()
            cursor.close()
            conn.close()

            # 정상 응답
            response = {"success": True, "message": "회원가입이 완료되었습니다."}
            app.logger.debug(f"Success Response: {response}")  # 응답 로그 출력
            return jsonify(response)

        except Exception as e:
            cursor.close()
            conn.close()
            error_message = f"회원가입에 실패했습니다. DB 오류: {str(e)}"
            app.logger.error(f"Error occurred: {error_message}")  # 오류 로그 출력
            return jsonify({"success": False, "message": error_message})

    return render_template('join.html')


if __name__ == '__main__':
    app.run(debug=True)
