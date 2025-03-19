from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from aquarium.views import ServiceViewSet, ProductViewSet, ReviewViewSet, OrderViewSet

router = DefaultRouter()
router.register(r'services', ServiceViewSet)
router.register(r'products', ProductViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
