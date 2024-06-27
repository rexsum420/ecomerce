from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Product, Picture
from .serializers import ProductSerializer, PictureSerializer, CreateProductSerializer
from users.permissions import IsStoreOwnerOrReadOnly
from rest_framework.exceptions import PermissionDenied
from stores.models import Store

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsStoreOwnerOrReadOnly, IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        user = self.request.user
        if user is not None:
            # Retrieve all products from the stores owned by the user
            return Product.objects.filter(store__owner=user)
        return Product.objects.none()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateProductSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        store = serializer.validated_data['store']
        if not self.request.user == store.owner:
            raise PermissionDenied("You do not have permission to create products for this store.")
        serializer.save()

    def perform_update(self, serializer):
        instance = self.get_object()
        if not self.request.user == instance.store.owner:
            raise PermissionDenied("You do not have permission to update this product.")
        serializer.save()

    def perform_partial_update(self, serializer):
        instance = self.get_object()
        if not self.request.user == instance.store.owner:
            raise PermissionDenied("You do not have permission to update this product.")
        serializer.save()

    def perform_destroy(self, instance):
        if not self.request.user == instance.store.owner:
            raise PermissionDenied("You do not have permission to delete this product.")
        instance.delete()


class PictureViewSet(viewsets.ModelViewSet):
    queryset = Picture.objects.all()
    serializer_class = PictureSerializer
    permission_classes = [IsStoreOwnerOrReadOnly, IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        user = self.request.user
        if user is not None:
            prods = Product.objects.filter(store__owner=user)
            return Picture.objects.filter(product__in=prods)
        return None

    def perform_create(self, serializer):
        product = serializer.validated_data['product']
        if not self.request.user == product.store.owner:
            raise PermissionDenied("You do not have permission to create pictures for this product.")
        serializer.save()

    def perform_update(self, serializer):
        instance = self.get_object()
        if not self.request.user == instance.product.store.owner:
            raise PermissionDenied("You do not have permission to update this picture.")
        serializer.save()

    def perform_partial_update(self, serializer):
        instance = self.get_object()
        if not self.request.user == instance.product.store.owner:
            raise PermissionDenied("You do not have permission to update this picture.")
        serializer.save()

    def perform_destroy(self, instance):
        if not self.request.user == instance.product.store.owner:
            raise PermissionDenied("You do not have permission to delete this picture.")
        instance.delete()
