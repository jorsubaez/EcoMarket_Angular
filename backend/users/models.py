from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('CLIENTE', 'Cliente'),
        ('PRODUCTOR', 'Productor'),
    )
    rol = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CLIENTE')
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.CharField(max_length=160, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.rol})"

class ContactMessage(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    motivo = models.CharField(max_length=100)
    mensaje = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Mensaje de {self.nombre} - {self.motivo}"
