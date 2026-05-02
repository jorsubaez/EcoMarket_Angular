from decimal import Decimal

from django.core.mail import send_mail
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from products.models import CartItem
from .models import Order, OrderItem
from .serializers import (
    OrderSerializer,
    CreateOrderSerializer,
    SimulatedPaymentSerializer,
)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order_from_cart(request):
    serializer = CreateOrderSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    cart_items = CartItem.objects.filter(user=request.user).select_related('producto')

    if not cart_items.exists():
        return Response(
            {'detail': 'El carrito está vacío.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    order = Order.objects.create(
        user=request.user,
        delivery_type=serializer.validated_data['delivery_type'],
        delivery_address=serializer.validated_data['delivery_address'],
        status='PENDING_PAYMENT',
        total=Decimal('0.00'),
    )

    total = Decimal('0.00')

    for item in cart_items:
        product = item.producto
        quantity = item.cantidad
        unit_price = product.price
        subtotal = unit_price * quantity

        OrderItem.objects.create(
            order=order,
            product=product,
            product_name=product.name,
            quantity=quantity,
            unit_price=unit_price,
            subtotal=subtotal,
        )

        total += subtotal

    order.total = total
    order.save()

    cart_items.delete()

    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def simulate_payment(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response(
            {'detail': 'Pedido no encontrado.'},
            status=status.HTTP_404_NOT_FOUND
        )

    if order.status == 'PAID':
        return Response(
            {'detail': 'Este pedido ya está pagado.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = SimulatedPaymentSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    card_number = serializer.validated_data['card_number'].replace(' ', '')

    if card_number.endswith('0'):
        order.status = 'FAILED'
        order.save()

        return Response(
            {
                'success': False,
                'detail': 'Pago rechazado por la pasarela simulada.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    order.status = 'PAID'
    order.paid_at = timezone.now()
    order.save()

    # Decrement product stock
    for item in order.items.all():
        if item.product:
            item.product.quantity = max(0, item.product.quantity - item.quantity)
            item.product.save()

    send_mail(
        subject=f'Confirmación de pedido #{order.id}',
        message=f'Tu pedido #{order.id} ha sido pagado correctamente. Total: {order.total} €.',
        from_email=None,
        recipient_list=[request.user.email],
        fail_silently=True,
    )

    return Response(
        {
            'success': True,
            'detail': 'Pago realizado correctamente.',
            'order': OrderSerializer(order).data,
        },
        status=status.HTTP_200_OK
    )