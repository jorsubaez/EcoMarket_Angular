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
        Instantiates and returns the list of permissions that this view requires.
        - GET list/retrieve: Allow any.
        - POST create: Must be authenticated AND have role PRODUCTOR.
        - PUT/PATCH/DELETE: Must be authenticated AND be the owner.
        """
        if self.action in ['create']:
            permission_classes = [permissions.IsAuthenticated, IsProductor]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        # Automatically assign the producer that makes the request as owner
        serializer.save(owner=self.request.user)

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
