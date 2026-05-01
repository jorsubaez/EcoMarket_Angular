from django.urls import path
from . import views

urlpatterns = [
    path('', views.my_orders, name='my-orders'),
    path('checkout/', views.create_order_from_cart, name='create-order-from-cart'),
    path('<int:order_id>/pay/', views.simulate_payment, name='simulate-payment'),
]