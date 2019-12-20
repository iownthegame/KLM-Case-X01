"""urls for app"""
from django.urls import path

from . import views

urlpatterns = [
    path('airports', views.airports, name='airports'),
    path('airport_list', views.airport_list, name='airport_list'),
    path('fares', views.fares, name='fare'),
    path('stats', views.stats, name='stats'),
]
