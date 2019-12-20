"""views for app"""
from django.http import JsonResponse

from rest_framework.decorators import api_view, permission_classes
from mysite.tools.request_tool import make_response
from . import airport_core, stats_core


@api_view(['GET'])
@permission_classes([])
def airports(request):
    """fetch airports info"""
    params = {
        'term': request.GET.get('term'),
        'code': request.GET.get('code'),
        'page': request.GET.get('page', 1),
    }
    return_json = airport_core.get(params)
    return JsonResponse(make_response(result=return_json))


def airport_list(request):
    """fetch airport_list info"""
    return_json = airport_core.get_airport_list()
    return JsonResponse(make_response(result=return_json))


@api_view(['GET'])
@permission_classes([])
def fares(request):
    """fetch fare info"""
    params = {
        'orig': request.GET.get('orig'),
        'dst': request.GET.get('dst'),
    }
    return_json = airport_core.get_fares(params)
    return JsonResponse(make_response(result=return_json))


@api_view(['GET'])
@permission_classes([])
def stats(request):
    """fetch stats"""
    return_json = stats_core.get_all()
    return JsonResponse(make_response(result=return_json))
