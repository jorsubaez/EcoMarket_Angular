from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import AdminActionLog, ContactMessage

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'password',
            'rol', 'telefono', 'direccion', 'provincia', 'is_active',
            'is_staff', 'is_superuser'
        )
        read_only_fields = ('id', 'is_active', 'is_staff', 'is_superuser')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'], # Use email as username
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            rol=validated_data.get('rol', 'CLIENTE'), # Default to CLIENTE
            provincia=validated_data.get('provincia', ''),
        )
        return user

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'


class AdminUserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'rol', 'telefono', 'direccion', 'provincia', 'is_active',
            'is_staff', 'is_superuser', 'date_joined', 'last_login'
        )
        read_only_fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'rol', 'telefono', 'direccion', 'provincia', 'is_staff',
            'is_superuser', 'date_joined', 'last_login'
        )

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class AdminActionLogSerializer(serializers.ModelSerializer):
    admin_email = serializers.EmailField(source='admin.email', read_only=True)

    class Meta:
        model = AdminActionLog
        fields = (
            'id', 'admin', 'admin_email', 'action', 'target_type',
            'target_id', 'detail', 'created_at'
        )
        read_only_fields = fields

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'] = serializers.EmailField()
        if 'username' in self.fields:
            del self.fields['username']

    def validate(self, attrs):
        attrs['username'] = attrs.get('email')
        data = super().validate(attrs)

        # Add custom claims
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'name': f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username,
            'rol': 'ADMIN' if self.user.is_staff or self.user.is_superuser else self.user.rol,
            'provincia': self.user.provincia or '',
            'is_staff': self.user.is_staff,
            'is_superuser': self.user.is_superuser,
        }
        return data
