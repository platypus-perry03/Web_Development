from DB.db_conn import db_conn
import pymysql

def get_board_id(post_id): # 게시글 조회 함수수
    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            # 특정 게시글을 조회하는 SQL 쿼리
            # 주어진 post_id에 해당하는 게시글을 가져옴
            sql = "SELECT idx, title, content FROM write_list WHERE idx = %s"
            cursor.execute(sql, (post_id,))
            post = cursor.fetchone()  # 첫 번째 결과만 가져옴
            return post
    finally:
        conn.close()


def update(post_id, new_title, new_content): # 수정한 게시글 정보 업데이트
    # 디버깅 목적으로 현재 업데이트할 내용 출력
    ## print(f"Updating post {post_id} with title: {new_title} and content: {new_content}")
    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            # 기존 게시글을 수정한 정보로 업데이트트
            sql = "UPDATE write_list SET title = %s, content = %s WHERE idx = %s"
            cursor.execute(sql, (new_title, new_content, post_id))
            conn.commit()
    finally:
        conn.close()

def get_all(): # 검색의 콤보박스에서 전체 선택 시, DB의 모든 게시글을 가져옴
    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT idx, writer, title, w_time FROM write_list")
            return cursor.fetchall()
    finally:
        conn.close()

def get_title(query):   # 검색의 콤보박스에서 제목 선택 후, 사용자가 입력한 제목과
                        # 유사한 게시글들을 DB에서 조회하고 반환
    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT idx, writer, title, w_time FROM write_list WHERE title LIKE %s", ('%' + query + '%',))
            return cursor.fetchall()
    finally:
        conn.close()

def get_content(query): # 검색의 콤보박스에서 제목 선택 후, 사용자가 입력한 내용과
                        # 유사한 게시글들을 DB에서 조회하고 반환
    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT idx, writer, title, w_time FROM write_list WHERE content LIKE %s", ('%' + query + '%',))
            return cursor.fetchall()
    finally:
        conn.close()

def modify_checkid(post_id): # 게시글 수정을 위한 작성자 비교
    conn = db_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT writer_name FROM write_list WHERE idx = %s
            """, (post_id,))
            post = cursor.fetchone()
        
        # 게시글이 존재하지 않으면 None 반환
        if post is None:
            return None

        return post['writer_name']
    finally:
        conn.close()