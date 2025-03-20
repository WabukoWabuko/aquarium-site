from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.admin_login, name='admin_login'),
    path('csrf/', views.get_csrf_token, name='get_csrf_token'),  # New endpoint
]
