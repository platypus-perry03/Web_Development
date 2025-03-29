from flask import Flask, render_template, redirect, url_for, request, jsonify, session, flash, send_file, send_from_directory
from DB.db_conn import db_conn
from DB.functions import get_board_id, update, get_all, get_title, get_content, find_user_id, find_user_pw, update_user_pw, user_info
from dotenv import load_dotenv
import pymysql, traceback, os, uuid

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")

@app.route('/')
def check_db_connection():
    return redirect(url_for('login'))

# 메인
@app.route('/index')
def index():
    if "userid" not in session:
        return "로그인이 필요합니다.", 403

    conn = db_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT idx, writer, title, w_time, secret_key FROM write_list ORDER BY w_time DESC")
    board_list = cursor.fetchall()
    conn.close()

    # 여기 중요!
    return render_template("index.html", username=session.get("username"), board_list=board_list)



# 프로필 정보 보기
@app.route('/mypage')
def mypage():
    user_id = session.get('userid')
    user = user_info(user_id)

    if not user:
        flash("사용자 정보를 찾을 수 없습니다.")
        return redirect(url_for('index'))

    session['username'] = user['name']
    prev_page = request.args.get('from', 'index')

    return render_template(
        'mypage.html',
        user=user,
        username=user['name'],
        from_page=prev_page,
        is_owner=True 
    )

# 이미지 업로드
@app.route('/profile/<filename>')
def uploaded_file(filename):
    return send_from_directory('profile', filename)

# 프로필 수정
@app.route('/myprofile', methods=['POST'])
def update_myprofile():
    user_id = session.get('userid')  # 현재 로그인한 사용자
    if not user_id:
        flash("로그인이 필요합니다.")
        return redirect(url_for('login'))

    name = request.form['name']
    school = request.form['school']
    email = request.form['email']
    introduce = request.form['introduce']
    image_url = None

    # 파일 업로드 처리
    profile_image = request.files.get('profile_image')
    if profile_image and profile_image.filename != '':
        filename = str(uuid.uuid4()) + os.path.splitext(profile_image.filename)[1]
        save_path = os.path.join('profile', filename)
        
        # 업로드 디렉토리 없으면 생성
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        profile_image.save(save_path)
        image_url = filename

    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            # image_url은 변경 시에만 업데이트
            if image_url:
                sql = """
                    UPDATE users_join
                    SET name = %s, school = %s, email = %s, introduce = %s, image_url = %s
                    WHERE id = %s
                """
                cursor.execute(sql, (name, school, email, introduce, image_url, user_id))
            else:
                sql = """
                    UPDATE users_join
                    SET name = %s, school = %s, email = %s, introduce = %s
                    WHERE id = %s
                """
                cursor.execute(sql, (name, school, email, introduce, user_id))

            conn.commit()
            session['username'] = name
            flash("프로필이 성공적으로 수정되었습니다.")
    finally:
        conn.close()

    return redirect(url_for('mypage'))

# 유저 목록
@app.route('/users')
def user_list():
    conn = db_conn()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT id, name, school, email FROM users_join")
            users = cursor.fetchall()
        return render_template('users.html', users=users)
    except Exception as e:
        print(f"[ERROR] 유저 목록 조회 중 오류: {e}")
        return "서버 오류가 발생했습니다.", 500
    finally:
        conn.close()

# 다른 유저 프로필 보기
@app.route('/user/<user_id>')
def view_user_profile(user_id):
    user = user_info(user_id)

    if not user:
        flash("해당 사용자를 찾을 수 없습니다.")
        return redirect(url_for('index'))

    return render_template(
        'mypage.html',
        user=user,
        username=user['name'],
        from_page='users'  # 뒤로가기용 표시
    )

# 검색
@app.route('/search', methods=['GET'])
def search():
    search_option = request.args.get('search_option')
    search_query = request.args.get('search_query')

    if search_option == 'all' and not search_query:     # 모든 게시글을 검색해서 전달
        posts = get_all()
    elif search_option == 'title' and search_query:     # 제목에서 검색어를 포함한 게시글 검색
        posts = get_title(search_query)
    elif search_option == 'content' and search_query:   # 내용에서 검색어를 포함한 게시글 검색
        posts = get_content(search_query)
    else:
        posts = get_all()

    return render_template('index.html', board_list=posts)


# 글 작성
@app.route('/write', methods=['GET', 'POST'])
def write_post():
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        writer = request.form['writer']  # ← id (userid)를 form에서 가져옴

        # 비밀글 처리
        is_secret = request.form.get('is_secret')
        secret_key = request.form.get('secret_pw') if is_secret and request.form.get('secret_pw') else None

        # 파일 처리
        f_original = f_stored = f_path = f_size = f_type = None
        uploaded_file = request.files.get('file')
        if uploaded_file and uploaded_file.filename != '':
            from werkzeug.utils import secure_filename
            import uuid

            f_original = uploaded_file.filename
            ext = os.path.splitext(f_original)[1]
            f_stored = str(uuid.uuid4()) + ext
            f_path = os.path.join('C:/Users/user/Desktop/빡공팟/4 주차/board/fileupload', f_stored)
            uploaded_file.save(f_path)

            f_size = os.path.getsize(f_path)
            f_type = uploaded_file.mimetype

        conn = db_conn()
        try:
            with conn.cursor() as cursor:
                query = """
                    INSERT INTO write_list 
                    (title, content, writer, f_original, f_stored, f_path, f_size, f_type, secret_key)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(query, (
                    title, content, writer,
                    f_original, f_stored, f_path, f_size, f_type,
                    secret_key
                ))
                conn.commit()

            flash('게시글이 성공적으로 작성되었습니다!', 'success')
            return redirect(url_for('index'))
        finally:
            conn.close()

    return render_template('write.html', name=session.get('username'), username=session.get('userid'))


# 글 읽기
@app.route('/read/<int:post_id>')
def read_post(post_id):
    conn = db_conn()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
                SELECT idx, writer, title, content, w_time, f_original
                FROM write_list
                WHERE idx = %s
            """, (post_id,))
            post = cursor.fetchone()

        if not post:
            return "게시글을 찾을 수 없습니다.", 404

        return render_template('read.html', post=post)
    
    finally:
        conn.close()


# 비밀글 비밀번호 확인
@app.route('/secret_check/<int:post_id>', methods=['POST'])
def secret_check(post_id):
    data = request.get_json()
    input_pw = data.get('password')

    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT secret_key FROM write_list WHERE idx = %s", (post_id,))
            result = cursor.fetchone()

            if result and result['secret_key'] == input_pw:
                return jsonify({"result": "success"})
            else:
                return jsonify({"result": "fail"})
    except Exception as e:
        print("비밀번호 비교 중 오류:", e)
        return jsonify({"result": "error", "message": str(e)})
    finally:
        conn.close()


# 파일 다운로드
@app.route('/download/<int:post_id>')
def download_file(post_id):
    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            query = "SELECT f_original, f_path FROM write_list WHERE idx = %s"
            cursor.execute(query, (post_id,))
            file_data = cursor.fetchone()

            if not file_data or not file_data['f_path'] or not os.path.exists(file_data['f_path']):
                flash("파일이 존재하지 않거나 찾을 수 없습니다.", "danger")
                return redirect(url_for('read_post', post_id=post_id))

            return send_file(
                file_data['f_path'],
                as_attachment=True,
                download_name=file_data['f_original']
            )
    finally:
        conn.close()

# 글 삭제
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

        username = session.get('username')  # 세션에서 로그인한 사용자 이름을 가져옴

        # 작성자와 요청한 사람이 같은지 확인
        if post_writer == username:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM write_list WHERE idx = %s", (post_id,))
                conn.commit()

            return redirect(url_for('index'))  # '/index'로 리다이렉트
        else:
            return jsonify({"message": "작성자만 삭제할 수 있습니다."}), 403

    finally:
        conn.close()  # DB 연결 닫기


# 글 수정
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

    post = get_board_id(post_id)
    return render_template('modify.html', post=post)


# 로그인
@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.get_json()
        user_id = data.get("id")
        user_pw = data.get("pw")

        conn = db_conn()
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT id, name FROM users_join WHERE id = %s AND pw = %s", (user_id, user_pw))
            user = cursor.fetchone()

        if user:
            session["userid"] = user["id"]       # 로그인 ID (세션 저장용)
            session["username"] = user["name"]   # 표시용 이름 (세션 저장용)
            return jsonify({"success": True, "message": f"환영합니다, {user['name']}님!"})
        else:
            return jsonify({"success": False, "message": "아이디 또는 비밀번호가 틀렸습니다."})

    return render_template('login.html')


# 아이디 찾기
@app.route('/find-id', methods=['POST'])
def find_id():
    data = request.get_json()
    name = data.get('name')
    phone = data.get('phone')

    user = find_user_id(name, phone)
    if user:
        return jsonify(success=True, userid=user['id'])
    else:
        return jsonify(success=False, message="일치하는 회원 정보가 없습니다.")

# 비밀번호 찾기
@app.route('/find-pw', methods=['POST'])
def find_pw():
    try:
        data = request.get_json()
        user_id = data.get('id')
        phone = data.get('phone')

        if not user_id or not phone:
            return jsonify(success=False, message="아이디와 휴대폰 번호를 입력해주세요.")

        user = find_user_pw(user_id, phone)

        if user:
            return jsonify(success=True) # 새 비밀번호 입력 처리
        else:
            return jsonify(success=False, message="일치하는 회원 정보가 없습니다.")

    except Exception as e:
        print(f"[ERROR] /find-pw 오류: {e}")
        return jsonify(success=False, message="서버 오류가 발생했습니다.")

# 비밀번호 찾기 - 새로운 비밀번호 업데이트
@app.route('/update-password', methods=['POST'])
def update_password():
    data = request.get_json()
    user_id = data.get('id')
    phone = data.get('phone')
    new_pw = data.get('new_password')

    # 서버 측에서도 비밀번호 유효성 재확인
    if len(new_pw) < 8 or not any(c.isalpha() for c in new_pw) or not any(c.isdigit() for c in new_pw):
        return jsonify(success=False, message="비밀번호 조건에 맞지 않습니다.")

    updated = update_user_pw(user_id, phone, new_pw)

    if updated:
        return jsonify(success=True, message="비밀번호가 성공적으로 변경되었습니다.")
    else:
        return jsonify(success=False, message="비밀번호 변경 실패: 일치하는 회원 정보가 없습니다.")


# 로그아웃
@app.route("/logout", methods=["POST"])
def logout():
    session.pop("username", None)  # 세션에서 사용자 정보 제거
    return jsonify({"success": True, "message": "로그아웃되었습니다."})


# 회원가입
@app.route('/regist') # 회원가입 페이지 오픈 라우트
def regist():
    return render_template('regist.html')
 
@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    # 입력값 받아오기
    name = data.get("name")
    regist_id = data.get("regist_id")
    regist_pw = data.get("regist_pw")
    school = data.get("school")
    phonenum = data.get("phonenum")
    email = data.get("email")

    # 모든 필드가 입력되지 않으면 에러 메시지 반환
    if not all([name, regist_id, regist_pw, school, phonenum, email]):
        return jsonify({"success": False, "message": "모든 필드를 입력해주세요."})

    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO users_join (name, id, pw, school, phonenum, email)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (name, regist_id, regist_pw, school, phonenum, email))
            conn.commit()
        return jsonify({"success": True, "message": "회원가입 성공!"})
    except Exception as e:
        print("회원가입 오류:", e)
        return jsonify({"success": False, "message": "회원가입 실패!"})
    finally:
        conn.close()
  

# 중복 검사
@app.route('/check_id', methods=['POST'])
def check_id():
    try:
        data = request.get_json()
        regist_id = data.get("regist_id")

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
    app.run(debug=True, use_reloader=True)