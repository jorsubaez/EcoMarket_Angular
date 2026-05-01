from rest_framework import serializers
from .models import Producto, CartItem
from drf_extra_fields.fields import Base64ImageField, Base64FileField
import filetype

class PDFBase64FileField(Base64FileField):
    ALLOWED_TYPES = ['pdf', 'png', 'jpg', 'jpeg']

    def get_file_extension(self, filename, decoded_file):
        kind = filetype.guess(decoded_file)
        if kind and kind.extension in self.ALLOWED_TYPES:
            return kind.extension
        return None

class ProductoSerializer(serializers.ModelSerializer):
    ownerId = serializers.ReadOnlyField(source='owner.id')
    ownerName = serializers.ReadOnlyField(source='owner.first_name')
    image_url = serializers.SerializerMethodField()
    certificate_url = serializers.SerializerMethodField()
    image = Base64ImageField(required=False, allow_null=True)
    certificate = PDFBase64FileField(required=False, allow_null=True)

    class Meta:
        model = Producto
        fields = ['id', 'name', 'origin', 'price', 'unit', 'description', 'quantity', 'image', 'certificate', 'image_url_legacy', 'ownerId', 'ownerName', 'image_url', 'certificate_url']
        read_only_fields = ['owner']
        
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url_legacy or ""

    def get_certificate_url(self, obj):
        request = self.context.get('request')
        if obj.certificate and hasattr(obj.certificate, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.certificate.url)
            return obj.certificate.url
        return ""
    
    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("El precio no puede ser negativo.")
        return value

    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("La cantidad no puede ser negativa.")
        return value

class CartItemSerializer(serializers.ModelSerializer):
    producto_detalles = ProductoSerializer(source='producto', read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'user', 'producto', 'cantidad', 'producto_detalles']
        read_only_fields = ['user']
