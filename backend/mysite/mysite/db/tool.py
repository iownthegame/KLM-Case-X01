"""db tools"""


def dictfetchall(cursor):
    """Returns all rows from a cursor as a dict"""
    result = cursor.fetchall()
    if not result:
        return []
    desc = cursor.description
    return [dict(zip([col[0] for col in desc], row)) for row in result]


def dictfetchone(cursor):
    """Returns all rows from a cursor as a dict"""
    result = cursor.fetchone()
    if not result:
        return None
    desc = cursor.description
    return dict(zip([col[0] for col in desc], result))
