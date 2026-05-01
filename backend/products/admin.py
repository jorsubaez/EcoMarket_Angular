from django.contrib import admin
from .models import Producto, CartItem


@admin.action(description='Marcar como verificado')
def marcar_verificado(modeladmin, request, queryset):
    queryset.update(verification_status='VERIFICADO')


@admin.action(description='Marcar como pendiente')
def marcar_pendiente(modeladmin, request, queryset):
    queryset.update(verification_status='PENDIENTE')


@admin.action(description='Marcar como rechazado')
def marcar_rechazado(modeladmin, request, queryset):
    queryset.update(verification_status='RECHAZADO')


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'owner',
        'origin',
        'price',
        'quantity',
        'verification_status',
    )

    list_display_links = ('id', 'name')

    list_editable = (
        'verification_status',
    )

    list_filter = (
        'verification_status',
        'origin',
    )

    search_fields = (
        'name',
        'origin',
        'owner__username',
        'owner__email',
    )

    actions = [
        marcar_verificado,
        marcar_pendiente,
        marcar_rechazado,
    ]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'producto',
        'cantidad',
    )