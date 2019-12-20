"""sql for request records"""
from django.db import connection
from .tool import dictfetchall, dictfetchone

R_TABLE = 'request_record'

def get_records():
    """get request records"""
    sql = f"""
        SELECT * FROM {R_TABLE} R ORDER BY id"""

    with connection.cursor() as cursor:
        cursor.execute(sql)
        return dictfetchall(cursor)


def add_request_record(record_info):
    """add request record info"""
    api = record_info.get('api')
    request_time = record_info.get('request_time')
    # response_time = record_info.get('response_time')
    # status_code = record_info.get('status_code')

    # sql = f"""
    #     INSERT INTO {R_TABLE} (api, response_time, status_code)
    #     VALUES (%s, %s, %s)
    # """
    sql = f"INSERT INTO {R_TABLE} (api, request_time) VALUES (%s, %s) RETURNING id;"
    with connection.cursor() as cursor:
        # cursor.execute(sql, (api, response_time, status_code,))
        cursor.execute(sql, (api, request_time,))
        row = dictfetchone(cursor)
        return row['id']

def update_request_record(record_info, serial_id):
    """update request record info"""
    response_time = record_info.get('response_time')
    status_code = record_info.get('status_code')

    sql = f"""
        UPDATE {R_TABLE} SET response_time = %s, status_code = %s
        WHERE id = {serial_id}
    """
    with connection.cursor() as cursor:
        cursor.execute(sql, (response_time, status_code,))
