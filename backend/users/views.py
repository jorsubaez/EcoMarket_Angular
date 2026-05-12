from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import AdminActionLog, UserEmailLog
from django.contrib.auth import get_user_model
from .models import ContactMessage
from products.models import Producto
from products.serializers import ProductoSerializer
from .serializers import (
    AdminActionLogSerializer,
    AdminUserSerializer,
    UserSerializer,
    ContactMessageSerializer,
)

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


class IsPlatformAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or request.user.is_superuser)
        )


def log_admin_action(admin, action, target_type, target_id='', detail=''):
    AdminActionLog.objects.create(
        admin=admin,
        action=action,
        target_type=target_type,
        target_id=str(target_id) if target_id else '',
        detail=detail,
    )


class AdminUserListView(generics.ListAPIView):
    serializer_class = AdminUserSerializer
    permission_classes = (IsPlatformAdmin,)

    def get_queryset(self):
        return User.objects.all().order_by('-date_joined')


class AdminUserDetailView(APIView):
    permission_classes = (IsPlatformAdmin,)

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'detail': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        requested_is_active = request.data.get('is_active')
        is_deactivation = requested_is_active in (False, 'false', 'False', '0', 0)

        if user.id == request.user.id and is_deactivation:
            return Response(
                {'detail': 'No puedes desactivar tu propia cuenta administradora.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if user.is_superuser and user.id != request.user.id:
            return Response(
                {'detail': 'No puedes modificar otra cuenta superadministradora.'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = AdminUserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        state = 'activada' if user.is_active else 'desactivada'
        log_admin_action(
            request.user,
            'USER_STATUS_UPDATED',
            'USER',
            user.id,
            f'Cuenta {state}: {user.email}'
        )

        return Response(serializer.data)

    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'detail': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        if user.id == request.user.id:
            return Response(
                {'detail': 'No puedes eliminar tu propia cuenta administradora.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if user.is_superuser:
            return Response(
                {'detail': 'No puedes eliminar una cuenta superadministradora.'},
                status=status.HTTP_403_FORBIDDEN
            )

        user_email = user.email
        user.delete()

        log_admin_action(
            request.user,
            'USER_DELETED',
            'USER',
            user_id,
            f'Cuenta eliminada: {user_email}'
        )

        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminProductListView(generics.ListAPIView):
    serializer_class = ProductoSerializer
    permission_classes = (IsPlatformAdmin,)

    def get_queryset(self):
        return Producto.objects.select_related('owner').all().order_by('-id')


class AdminProductDetailView(APIView):
    permission_classes = (IsPlatformAdmin,)

    def patch(self, request, product_id):
        try:
            product = Producto.objects.select_related('owner').get(id=product_id)
        except Producto.DoesNotExist:
            return Response({'detail': 'Producto no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('verification_status')
        valid_statuses = {'PENDIENTE', 'VERIFICADO', 'RECHAZADO'}

        if new_status not in valid_statuses:
            return Response(
                {'verification_status': 'Estado de verificacion no valido.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        product.verification_status = new_status
        product.save(update_fields=['verification_status'])

        log_admin_action(
            request.user,
            'PRODUCT_VERIFICATION_UPDATED',
            'PRODUCT',
            product.id,
            f'{product.name}: {new_status}'
        )

        return Response(ProductoSerializer(product, context={'request': request}).data)

    def delete(self, request, product_id):
        try:
            product = Producto.objects.get(id=product_id)
        except Producto.DoesNotExist:
            return Response({'detail': 'Producto no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        product_name = product.name
        product.delete()

        log_admin_action(
            request.user,
            'PRODUCT_DELETED',
            'PRODUCT',
            product_id,
            f'Producto eliminado: {product_name}'
        )

        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminActionLogListView(generics.ListAPIView):
    serializer_class = AdminActionLogSerializer
    permission_classes = (IsPlatformAdmin,)

    def get_queryset(self):
        return AdminActionLog.objects.select_related('admin').all()[:100]

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
