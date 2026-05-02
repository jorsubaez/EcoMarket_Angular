from django.contrib import admin
from .models import CustomUser, ContactMessage

# Registramos los modelos para que salgan en el panel
admin.site.register(CustomUser)
admin.site.register(ContactMessage)