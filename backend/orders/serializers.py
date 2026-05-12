from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    certificate_url = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'product_name',
            'quantity',
            'unit_price',
            'subtotal',
            'certificate_url',
        ]

    def get_certificate_url(self, obj):
        request = self.context.get('request')
        if obj.product and obj.product.certificate and hasattr(obj.product.certificate, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.product.certificate.url)
            return obj.product.certificate.url
        return ""


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'status',
            'delivery_type',
            'delivery_address',
            'total',
            'created_at',
            'paid_at',
            'items',
        ]


class CreateOrderSerializer(serializers.Serializer):
    delivery_type = serializers.ChoiceField(choices=['ADDRESS', 'PICKUP'])
    delivery_address = serializers.CharField(max_length=255)


class SimulatedPaymentSerializer(serializers.Serializer):
    card_holder = serializers.CharField(max_length=120)
    card_number = serializers.CharField(max_length=20)
    expiry = serializers.CharField(max_length=7)
    cvv = serializers.CharField(max_length=4)


class ProducerSaleSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(source='order.id', read_only=True)
    order_status = serializers.CharField(source='order.status', read_only=True)
    order_date = serializers.DateTimeField(source='order.created_at', read_only=True)
    delivery_address = serializers.CharField(source='order.delivery_address', read_only=True)
    buyer_name = serializers.CharField(source='order.user.first_name', read_only=True)
    buyer_email = serializers.EmailField(source='order.user.email', read_only=True)
    certificate_url = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'order_id',
            'order_status',
            'order_date',
            'delivery_address',
            'buyer_name',
            'buyer_email',
            'product_name',
            'quantity',
            'unit_price',
            'subtotal',
            'certificate_url',
        ]

    def get_certificate_url(self, obj):
        request = self.context.get('request')
        if obj.product and obj.product.certificate and hasattr(obj.product.certificate, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.product.certificate.url)
            return obj.product.certificate.url
        return ""