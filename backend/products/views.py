from rest_framework import viewsets, permissions, filters
from .models import Producto, CartItem
from .serializers import ProductoSerializer, CartItemSerializer
from .permissions import IsOwnerOrReadOnly, IsProductor


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().order_by('-id')
    serializer_class = ProductoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'origin']

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