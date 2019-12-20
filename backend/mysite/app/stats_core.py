"""stats core"""

from mysite.db import db_records

KEY_MAP = (
    [chr(i) for i in range(65, 91)] +
    [chr(i) for i in range(97, 123)] +
    [str(i) for i in range(10)]
)


def get_all():
    """get all records"""
    records = db_records.get_records()
    return {'records': records}


def add_request_record(record_info):
    """add new request record"""
    serial_id = db_records.add_request_record(record_info)
    request_id = get_request_id(serial_id)
    # return {'id': serial_id, 'request_id': request_id}
    return request_id


def update_request_record(record_info, request_id):
    """update request record"""
    serial_id = get_id(request_id)
    db_records.update_request_record(record_info, serial_id)
    return


def get_request_id(serial_id):
    """get request_id by id"""
    request_id = ""
    len_key_map = len(KEY_MAP)
    while serial_id:
        bit = serial_id % len_key_map
        request_id = KEY_MAP[bit] + request_id
        serial_id = serial_id // len_key_map
    return request_id


def get_id(request_id):
    """get id by request_id"""
    serial_id = 0
    for char in request_id:
        index = KEY_MAP.index(char)
        serial_id = serial_id * len(KEY_MAP) + index
    return serial_id
