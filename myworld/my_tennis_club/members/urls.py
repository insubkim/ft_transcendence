from django.urls import path
from . import views

urlpatterns = [
    path('members/', views.members, name='members'),
    path('hello_insub/', views.hello_insub, name='insub'),
    path('my_first_html/', views.my_first_html, name='my_first_html'),
    path('all_member/', views.all_member, name='all_member'),
    path('details/<int:id>', views.details, name='details'),
    path('all_member_master/', views.all_member_master, name='all_member_master'),
    path('details_master/<int:id>', views.details_master, name='details_master'),
    path('', views.main, name='main'),
    path('test/', views.test, name='test'),
    path('dom/', views.dom, name='dom'),
    path('spa/', views.spa, name='spa'),
    path('test_nav/', views.test_nav, name='test_nav'),
    path('pong/', views.pong, name='pong'),
    path('pong_multi/', views.pong_multi, name='pong_multi'),
    path('three/', views.three, name='three'),
    path('pong_main/', views.pong_main, name='pong_main'),
    path('router/', views.router, name='router'),
]
