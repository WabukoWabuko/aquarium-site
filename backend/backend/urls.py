from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from aquarium.views import ServiceViewSet, ProductViewSet, ReviewViewSet, OrderViewSet
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'services', ServiceViewSet)
router.register(r'products', ProductViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/', include('aquarium.urls')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
