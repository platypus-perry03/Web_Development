from DB.db_conn import db_conn
import pymysql

# 게시글 조회 함수
def get_board_id(post_id):
    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            sql = "SELECT idx, title, content FROM write_list WHERE idx = %s"
            cursor.execute(sql, (post_id,))
            return cursor.fetchone()
    finally:
        conn.close()

# 수정한 게시글 정보 업데이트
def update(post_id, new_title, new_content):
    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            sql = "UPDATE write_list SET title = %s, content = %s WHERE idx = %s"
            cursor.execute(sql, (new_title, new_content, post_id))
            conn.commit()
    finally:
        conn.close()

# 전체 게시글 조회
def get_all():
    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT idx, writer, title, w_time FROM write_list")
            return cursor.fetchall()
    finally:
        conn.close()

# 제목으로 게시글 검색
def get_title(query):
    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT idx, writer, title, w_time FROM write_list WHERE title LIKE %s", ('%' + query + '%',))
            return cursor.fetchall()
    finally:
        conn.close()

# 내용으로 게시글 검색
def get_content(query):
    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT idx, writer, title, w_time FROM write_list WHERE content LIKE %s", ('%' + query + '%',))
            return cursor.fetchall()
    finally:
        conn.close()

# 게시글 수정 시 작성자 검증 (미사용 시 삭제 가능)
def modify_checkid(post_id):
    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT writer FROM write_list WHERE idx = %s", (post_id,))
            post = cursor.fetchone()
            return post['writer'] if post else None
    finally:
        conn.close()

# 아이디 찾기
def find_user_id(name, phone):
    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT id FROM users_join
                WHERE name = %s AND REPLACE(phonenum, '-', '') = %s
            """
            cursor.execute(sql, (name, phone))
            return cursor.fetchone()
    finally:
        conn.close()

# 비밀번호 찾기
def find_user_pw(user_id, phone):
    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT pw FROM users_join
                WHERE id = %s AND REPLACE(phonenum, '-', '') = %s
            """
            cursor.execute(sql, (user_id, phone))
            return cursor.fetchone()
    finally:
        conn.close()

# 비밀번호 변경
def update_user_pw(user_id, phone, new_pw):
    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            sql = """
                UPDATE users_join
                SET pw = %s
                WHERE id = %s AND REPLACE(phonenum, '-', '') = %s
            """
            result = cursor.execute(sql, (new_pw, user_id, phone))
            conn.commit()
            return result > 0
    finally:
        conn.close()

# 사용자 정보 조회
def user_info(user_id):
    conn = db_conn()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = "SELECT id, name, school, email, introduce, image_url FROM users_join WHERE id = %s"
            cursor.execute(sql, (user_id,))
            return cursor.fetchone()
    finally:
        conn.close()

