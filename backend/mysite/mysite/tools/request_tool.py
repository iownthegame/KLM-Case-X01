"""request tool"""
import json
import logging
import requests

LOGGER = logging.getLogger(__name__)


def make_response(status=0, result=None):
    """make response"""
    if not result:
        result = {}
    return {'status': status, 'result': result}


def requests_auth(url, username, password, data):
    """authorization"""
    session = requests.Session()
    session.auth = (username, password)
    return requests_post(url, data, retries=0, session=session)

def requests_get(
        url='', payload=None, headers=None,
        retries=5, timeout=16, no_retry_codes=None, session=None):
    """send GET request"""
    current_retries = 0
    if not headers:
        headers = {}
    return_result = {}

    while current_retries <= retries:
        status_code = 0
        try:
            if session:
                res = session.get(url, params=payload,
                                  headers=headers, timeout=timeout)
            else:
                res = requests.get(url, params=payload,
                                   headers=headers, timeout=timeout)

            status_code = res.status_code
            return_result['result'] = json.loads(res.text) if res.text else {}
            if res and status_code == 200:
                if 'error' in return_result:
                    del return_result['error']
                break
            elif no_retry_codes and status_code in no_retry_codes:
                break
        except Exception as exception:
            LOGGER.exception("http get request error")
            return_result['error'] = exception

        LOGGER.info(
            "requests.get retry = %s, url = %s, code = %s, res = %s",
            current_retries, url, status_code, return_result)
        current_retries += 1

    return return_result


def requests_post(
        url='', payload=None, headers=None, is_json=False,
        retries=5, timeout=16, no_retry_codes=None, session=None):
    """send POST request"""
    current_retries = 0
    if not headers:
        headers = {}
    return_result = {}

    while current_retries <= retries:
        status_code = 0
        try:
            if session:
                if not is_json:
                    res = session.post(url, data=payload,
                                       headers=headers, timeout=timeout)
                else:
                    res = session.post(url, json=payload,
                                       headers=headers, timeout=timeout)
            else:
                if not is_json:
                    res = requests.post(url, data=payload,
                                        headers=headers, timeout=timeout)
                else:
                    res = requests.post(url, json=payload,
                                        headers=headers, timeout=timeout)

            status_code = res.status_code
            return_result['result'] = json.loads(res.text) if res.text else {}
            if res and status_code == 200:
                if 'error' in return_result:
                    del return_result['error']
                break
            elif no_retry_codes and status_code in no_retry_codes:
                break
        except Exception as exception:
            LOGGER.exception("http post request error")
            return_result['error'] = exception

        LOGGER.info(
            "requests.post retry = %s, url = %s, code = %s, res = %s",
            current_retries, url, status_code, return_result)
        current_retries += 1

    return return_result
