from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('CLIENTE', 'Cliente'),
        ('PRODUCTOR', 'Productor'),
    )
    rol = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CLIENTE')
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.username} ({self.rol})"
