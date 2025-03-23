import pymysql

def db_conn():
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="1234",
        database="flask_board",
        charset="utf8mb4",  # 문자 인코딩 설정
        cursorclass=pymysql.cursors.DictCursor
    )
    return conn
