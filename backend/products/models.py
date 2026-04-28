from django.db import models
from django.conf import settings

class Producto(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='productos')
    name = models.CharField(max_length=200)
    origin = models.CharField(max_length=150)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20)
    description = models.TextField(blank=True, null=True)
    quantity = models.IntegerField(default=0)
    image = models.ImageField(upload_to='productos/', blank=True, null=True)
    
    # Store old image string or base64 temporarily if needed by migration script
    image_url_legacy = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.origin}"

class CartItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart_items')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('user', 'producto')

    def __str__(self):
        return f"{self.cantidad} x {self.producto.name} ({self.user.username})"
