"""common tool"""
import logging
import sys
import traceback
import threading

LOGGER = logging.getLogger(__name__)

def get_with_default(value, default):
    """get with default value"""
    if default is None:
        return value
    elif value is None:
        return default
    elif isinstance(value, int) or isinstance(value, float):
        return value
    else:
        return value or default


def filter_dict(data, keys, default_value=None):
    """filter dict"""
    if not isinstance(data, dict):
        return data
    if default_value is None:
        return dict((key, data.get(key)) for key in keys)
    return dict((key, get_with_default(data.get(key), default_value)) for key in keys)


def filter_dict_list(data_list, keys, default_value=None):
    """filter dict list"""
    return [filter_dict(data, keys, default_value) for data in data_list]


def threading_func_with_return(func):
    """Decorator for running a function in a thread and handling its return
    value or exception"""
    def start(*args, **kw):
        def run():
            thread.ret = None
            try:
                thread.ret = func(*args, **kw)
            except Exception:
                thread.exc = sys.exc_info()

        def get(timeout=2.0):
            thread.join(timeout)
            if thread.exc:
                # raise thread.exc[1]
                LOGGER.error(
                    "thread exception %s", traceback.print_exception(*thread.exc))
            return thread.ret

        thread = threading.Thread(None, run)
        thread.setDaemon(True)
        thread.exc = None
        thread.get = get
        thread.start()
        # print(threading.current_thread().ident)
        # print(threading.current_thread().name)
        return thread
    return start
