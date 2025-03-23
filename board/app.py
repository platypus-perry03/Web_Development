from flask import Flask, render_template, redirect, url_for, request, jsonify, session, flash
from DB.db_conn import db_conn
import pymysql, traceback
from DB.functions import get_board_id, update, get_all, get_title, get_content

app = Flask(__name__)  # Flask 애플리케이션 객체 생성
app.secret_key = "1234"

@app.route('/')
def check_db_connection():
    return redirect(url_for('login')) 
    
@app.route('/test_db') # db 연결 테스트
def test_db():
    try:
        conn = db_conn()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")  # 간단한 쿼리 실행
        result = cursor.fetchone()
        conn.close()
        return f"DB 연결 성공: {result}"
    except Exception as e:
        return f"DB 연결 실패: {str(e)}"    

@app.route('/index')
def index():
    if "username" not in session:
        return "로그인이 필요합니다.", 403

    try:
        conn = db_conn()
        cursor = conn.cursor()

        #print("DB 연결 성공")

        cursor.execute("SELECT idx, writer, title, w_time FROM write_list ORDER BY w_time DESC")
        board_list = cursor.fetchall()

        #print("불러온 데이터:", write_list)  # 터미널에서 데이터 확인

        conn.close() # 데이터베이스 연결을 닫아 불필요한 리소스 사용을 방지

        return render_template("index.html", username=session["username"], board_list=board_list)

    except Exception as e:
        print("DB 오류 발생:", e)
        return f"DB 오류 발생: {str(e)}"
    
@app.route('/search', methods=['GET'])
def search():
    search_option = request.args.get('search_option')
    search_query = request.args.get('search_query')

    # '전체' 옵션이 선택되고 검색어가 비어 있을 경우 전체 게시글 조회
    if search_option == 'all' and not search_query:
        # 모든 게시글을 검색해서 board_list로 전달
        posts = get_all()
    elif search_option == 'title' and search_query:
        # 제목에서 검색어를 포함한 게시글 검색
        posts = get_title(search_query)
    elif search_option == 'content' and search_query:
        # 내용에서 검색어를 포함한 게시글 검색
        posts = get_content(search_query)
    else:
        posts = get_all()

    return render_template('index.html', board_list=posts)

    
@app.route('/write', methods=['GET', 'POST'])
def write_post():
    if request.method == 'POST':
        # 폼에서 입력한 데이터 가져오기
        title = request.form['title']
        content = request.form['content']
        
        # 세션에서 username 가져오기, 없으면 '익명'으로 설정
        writer = session.get('username', '익명')

        # DB에 게시글 저장
        conn = db_conn()
        try:
            with conn.cursor() as cursor:
                query = "INSERT INTO write_list (title, content, writer) VALUES (%s, %s, %s)"
                cursor.execute(query, (title, content, writer))
                conn.commit()  # 변경 사항 커밋
            # 글 작성 성공 메시지 설정
            flash('게시글이 성공적으로 작성되었습니다!', 'success')
            return redirect(url_for('index'))  # 게시판 목록으로 리디렉션
        finally:
            conn.close()

    # 세션에서 username 가져오기, 없으면 '익명'으로 설정
    username = session.get('username', '익명')
    return render_template('write.html', username=username)  # 글쓰기 폼 렌더링, username 전달
    
@app.route('/read/<int:post_id>')  # 글 읽기 라우트
def read_post(post_id):
    conn = db_conn()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT idx, writer, title, content, w_time FROM write_list WHERE idx = %s", (post_id,))
            post = cursor.fetchone()

        if not post:
            return "게시글을 찾을 수 없습니다.", 404

        return render_template('read.html', post=post)
    
    finally:
        conn.close()

from flask import session, jsonify, redirect, url_for

@app.route('/delete/<int:post_id>', methods=['POST'])
def delete_post(post_id):
    conn = db_conn()
    try:
        # 게시글을 가져와 작성자 확인
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT writer FROM write_list WHERE idx = %s", (post_id,))
            post = cursor.fetchone()

        if not post:
            return "게시글을 찾을 수 없습니다.", 404

        post_writer = post['writer']  # 작성자 이름을 가져옴

        # 세션에서 현재 로그인된 사용자 이름을 가져옵니다.
        username = session.get('username')  # 세션에서 로그인한 사용자 이름을 가져옴

        # 작성자와 요청한 사람이 같은지 확인
        if post_writer == username:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM write_list WHERE idx = %s", (post_id,))
                conn.commit()

            # 삭제 후 /index로 리다이렉트
            return redirect(url_for('index'))  # '/index'로 리다이렉트
        else:
            return jsonify({"message": "작성자만 삭제할 수 있습니다."}), 403

    finally:
        conn.close()  # DB 연결 닫기

@app.route('/modify/<int:post_id>', methods=['GET', 'POST'])
def modify(post_id):
    if request.method == 'POST':
        # 수정된 제목과 내용을 가져옵니다.
        new_title = request.form['title']
        new_content = request.form['content']
        
        # 수정된 내용으로 게시글을 업데이트합니다.
        conn = db_conn()
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    UPDATE write_list
                    SET title = %s, content = %s, w_time = CURRENT_TIMESTAMP
                    WHERE idx = %s
                """, (new_title, new_content, post_id))
                conn.commit()

            # 수정 후, 완료 메시지를 추가하고 게시글 목록으로 리디렉션
            flash('게시글이 성공적으로 수정되었습니다!', 'success')
            return redirect('/index')
        
        finally:
            conn.close()

    # GET 요청 시 기존 게시글을 가져와서 수정 페이지로 전달
    post = get_board_id(post_id)
    return render_template('modify.html', post=post)



@app.route('/login', methods=["GET", "POST"]) # 로그인 라우트
def login():
    username = request.form.get('username')
    if request.method == "POST":
        data = request.get_json()
        user_id = data.get("id") 
        user_pw = data.get("pw")

        conn = db_conn()
        with conn.cursor() as cursor:
            cursor.execute("SELECT name FROM users_join WHERE id = %s AND pw = %s", (user_id, user_pw))
            user = cursor.fetchone()

        if user:
            session["username"] = user["name"]  # 로그인한 사용자의 이름을 세션에 저장
            return jsonify({"success": True, "message": f"환영합니다, {user['name']}님!"})
        else:
            return jsonify({"success": False, "message": "아이디 또는 비밀번호가 틀렸습니다."})

    return render_template('login.html')

@app.route("/logout", methods=["POST"]) # 로그아웃 라우트
def logout():
    session.pop("username", None)  # 세션에서 사용자 정보 제거
    return jsonify({"success": True, "message": "로그아웃되었습니다."})


@app.route('/regist') # 회원가입 페이지 오픈 라우트
def regist():
    return render_template('regist.html')

# Not Found
# The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.
# 계속 오류가 나와서 회원가입 페이지 여는 라우트, 기능 처리 부분 라우트를 분리 

@app.route('/register', methods=['POST']) # 회원가입 기능 처리 라우트트
def register_user():
    data = request.get_json()  # JSON 데이터 받기
    name = data.get("name")
    regist_id = data.get("regist_id")
    regist_pw = data.get("regist_pw")

    # 모든 필드가 입력되지 않으면 에러 메시지 반환
    if not name or not regist_id or not regist_pw:
        return jsonify({"success": False, "message": "모든 필드를 입력해주세요."})

    # DB 연결
    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            sql = "INSERT INTO users_join (name, id, pw) VALUES (%s, %s, %s)"
            cursor.execute(sql, (name, regist_id, regist_pw))
            conn.commit()
        return jsonify({"success": True, "message": "회원가입 성공!"})
    except Exception as e:
        print("회원가입 오류:", e)
        return jsonify({"success": False, "message": "회원가입 실패!"})
    finally:
        conn.close()    

@app.route('/check_id', methods=['POST'])
def check_id():
    try:
        data = request.get_json()
        regist_id = data.get("regist_id")

        #print(f"Received ID: {regist_id}")  # 요청받은 아이디 출력

        # DB 연결
        conn = db_conn()
        with conn.cursor() as cursor:
            # users_join 테이블에서 해당 아이디가 존재하는지 확인
            cursor.execute("SELECT COUNT(*) FROM users_join WHERE id = %s", (regist_id,))
            result = cursor.fetchone()

            #print(f"DB Query Result: {result['COUNT(*)']}")  # 쿼리 결과 확인

            if result["COUNT(*)"] > 0:  # 이미 존재하는 아이디
                return jsonify({"success": False})
            else:  # 사용 가능한 아이디
                return jsonify({"success": True})

    except Exception as e:
        print(f"Error: {e}")  # 오류 메시지를 출력
        return jsonify({"success": False, "message": "아이디 중복 검사 중 오류가 발생했습니다."})
    
    finally:
        if conn:
            conn.close()  # DB 연결 종료



if __name__ == '__main__':
    app.run(debug=True)