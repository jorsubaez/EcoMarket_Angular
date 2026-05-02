from rest_framework import viewsets, permissions, filters
from django.db.models import Q
from .models import Producto, CartItem
from .serializers import ProductoSerializer, CartItemSerializer
from .permissions import IsOwnerOrReadOnly, IsProductor


class ProductoViewSet(viewsets.ModelViewSet):
    # Placeholder requerido por DRF para introspección (schemas, etc.).
    # La lógica real de filtrado la gestiona get_queryset().
    queryset = Producto.objects.none()
    serializer_class = ProductoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'origin']

    def get_queryset(self):
        """
        - Usuarios anónimos o CLIENTE: solo productos VERIFICADO.
        - PRODUCTOR autenticado: sus propios productos (todos los estados) + el resto VERIFICADO.
        """
        user = self.request.user
        if user.is_authenticated and getattr(user, 'rol', None) == 'PRODUCTOR':
            return Producto.objects.filter(
                Q(owner=user) | Q(verification_status='VERIFICADO')
            ).order_by('-id').distinct()
        return Producto.objects.filter(
            verification_status='VERIFICADO'
        ).order_by('-id')

    def get_permissions(self):
        """
        - GET list/retrieve: cualquiera puede ver productos.
        - POST create: solo usuarios autenticados con rol PRODUCTOR.
        - PUT/PATCH/DELETE: solo el dueño del producto.
        """
        if self.action in ['create']:
            permission_classes = [permissions.IsAuthenticated, IsProductor]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
        else:
            permission_classes = [permissions.AllowAny]

        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        # Al crear un producto, siempre queda pendiente de verificación.
        serializer.save(
            owner=self.request.user,
            verification_status='PENDIENTE'
        )

    def perform_update(self, serializer):
        # Si el productor edita el producto, vuelve a quedar pendiente.
        serializer.save(
            verification_status='PENDIENTE'
        )


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)