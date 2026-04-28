from django.urls import path
from .views import RegisterView, ContactMessageCreateView, ProducerListView, CustomTokenObtainPairView, UserDetailView

urlpatterns = [
    path('me/', UserDetailView.as_view(), name='user_detail'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('contact/', ContactMessageCreateView.as_view(), name='contact_create'),
    path('producers/', ProducerListView.as_view(), name='producers_list'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]
