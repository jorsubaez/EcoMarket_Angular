from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'product_name',
            'quantity',
            'unit_price',
            'subtotal',
        ]


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