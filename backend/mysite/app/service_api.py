"""call mock server"""
from mysite.tools import request_tool

API_SERVER_URL = 'http://localhost:8080'
ACCESS_TOKEN = ''

def generate_token():
    """generate oauth token"""
    global ACCESS_TOKEN
    path = f"{API_SERVER_URL}/oauth/token"
    username = 'travel-api-client'
    password = 'psw'
    data = {'grant_type': 'client_credentials'}
    res = request_tool.requests_auth(path, username, password, data)
    # {'result': {'access_token': '329ee777-5ce2-41c3-bb3d-e41503f05989', 'token_type': 'bearer', 'expires_in': 196, 'scope': 'read write trust'}}
    result = res.get('result')
    access_token = result.get('access_token')
    print("generate_token", access_token)
    ACCESS_TOKEN = access_token
    return access_token

def make_auth_header():
    """make auth header"""
    return {'Authorization': f'Bearer {ACCESS_TOKEN}'}

def get_airports(params):
    """get airports"""
    path = f"{API_SERVER_URL}/airports"
    page = params.get('page')

    if 'term' in params and params['term']:
        term = params['term']
        path += f"?term={term}&page={page}"
    elif 'code' in params and params['code']:
        code = params['code']
        path += f"/{code}"
    else:
        path += f"?page={page}"

    res = request_tool.requests_get(path, None, make_auth_header(), retries=1)
    if is_invalid_token(res):
        generate_token()
        res = request_tool.requests_get(path, None, make_auth_header(), retries=1)

    return res

def get_fares(params):
    """get fare"""
    orig = params.get('orig')
    dst = params.get('dst')
    path = f"{API_SERVER_URL}/fares/{orig}/{dst}"

    res = request_tool.requests_get(path, None, make_auth_header(), retries=1)
    if is_invalid_token(res):
        generate_token()
        res = request_tool.requests_get(path, None, make_auth_header(), retries=1)

    return res

def is_invalid_token(res):
    """is invalid token"""
    result = res.get('result')
    if result and 'error' in result:
        if result['error'] == 'invalid_token':
            return True
    return False
