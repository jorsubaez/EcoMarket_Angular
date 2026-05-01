from django.conf import settings
from django.db import models
from products.models import Producto


class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING_PAYMENT', 'Pendiente de pago'),
        ('PAID', 'Pagado'),
        ('FAILED', 'Pago fallido'),
    ]

    DELIVERY_CHOICES = [
        ('ADDRESS', 'Entrega a domicilio'),
        ('PICKUP', 'Punto de recogida'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders'
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default='PENDING_PAYMENT'
    )

    delivery_type = models.CharField(
        max_length=20,
        choices=DELIVERY_CHOICES
    )

    delivery_address = models.CharField(max_length=255)

    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Pedido #{self.id} - {self.user.email} - {self.status}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )

    product = models.ForeignKey(
        Producto,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    product_name = models.CharField(max_length=120)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"