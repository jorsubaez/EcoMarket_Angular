from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, CartItemViewSet

router = DefaultRouter()
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'cart', CartItemViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
]
