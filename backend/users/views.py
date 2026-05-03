from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import UserEmailLog
from django.contrib.auth import get_user_model
from .models import ContactMessage
from .serializers import UserSerializer, ContactMessageSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        # Guardamos el usuario en la Base de Datos
        user = serializer.save()

        # Enviamos correo de bienvenida
        context = {'user': user}
        html_message = render_to_string('emails/register_successful.html', context)
        plain_message = strip_tags(html_message)

        try:
            email = EmailMultiAlternatives(
                subject='🌱 ¡Bienvenido a EcoMarket!',
                body=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email]
            )
            email.attach_alternative(html_message, "text/html")
            email.send(fail_silently=False)

            # Registramos el ÉXITO
            UserEmailLog.objects.create(
                user=user,
                tipo_email='BIENVENIDA',
                status='ENVIADO'
            )
        except Exception as e:
            # Registramos el FALLO
            UserEmailLog.objects.create(
                user=user,
                tipo_email='BIENVENIDA',
                status='FALLIDO',
                error_message=str(e)
            )
            # Imprimimos el error en consola por si queremos depurar sin romper el registro del usuario.
            print(f"Error enviando email a {user.email}: {e}")

class ContactMessageCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = ContactMessageSerializer

class ProducerListView(generics.ListAPIView):
    queryset = User.objects.filter(rol='PRODUCTOR')
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class UserDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
