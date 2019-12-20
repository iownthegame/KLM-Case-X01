"""stats middleware"""
import time
import datetime
import logging

from django.utils.deprecation import MiddlewareMixin

from mysite.tools.common_tool import threading_func_with_return
from app.stats_core import add_request_record, update_request_record

LOGGER = logging.getLogger(__name__)


def async_add_request_record(request):
    """async insert request_record"""
    start_time = time.time()
    path = request.path
    request_time = datetime.datetime.fromtimestamp(
        start_time).strftime('%Y-%m-%d %H:%M:%S')
    request_id = add_request_record(
        {'api': path, 'request_time': request_time})
    LOGGER.info("[request_id: %s] path %s coming", request_id, path)
    return request_id, start_time


def async_update_request_record(request, response, response_time):
    """async update request_record"""
    print("async_update_request_record")
    status_code = response.status_code
    record_info = {
        'response_time': response_time,
        'status_code': status_code,
    }
    request_id = request.request_id
    path = request.path
    update_request_record(record_info, request_id)
    LOGGER.info(
        "[request_id: %s] path %s responded (%s), time %s",
        request_id, path, status_code, response_time)


class StatsMiddleware(MiddlewareMixin):
    """StatsMiddleware"""

    def process_request(self, request):
        """Start time at request coming in"""
        self.request_th = threading_func_with_return(
            async_add_request_record)(request)

    def process_response(self, request, response):
        """End of request, take time"""
        try:
            request_id, start_time = self.request_th.get()
            response_time = time.time() - start_time

            request.request_id = request_id
            threading_func_with_return(async_update_request_record)(
                request, response, response_time)

            response["X-total-time"] = int(response_time * 1000)
            response["request_id"] = request_id
        except Exception as e:
            LOGGER.exception("StatsMiddleware process response error")
        return response
