from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from .models import Product, Picture
from .serializers import ProductSerializer, PictureSerializer, CreateProductSerializer, ReadProductsShortSerializer
from users.permissions import IsStoreOwnerOrReadOnly
from rest_framework.exceptions import PermissionDenied
from stores.models import Store
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.models import AnonymousUser
from django.db.models import Q
from market.utils import trim_and_case
from stores.utils import replace_spaces

class ProductListPagination(PageNumberPagination):
    page_size = 24

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    pagination_class = ProductListPagination
    
    def get_permissions(self):
        if self.request.method in ['GET', 'OPTIONS', 'HEAD']:
            return [AllowAny()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateProductSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
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

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def get_queryset(self):
        queryset = super().get_queryset()
        store = self.request.query_params.get('store', None)
        
        if store:
            try:
                store_id = int(store)
                return queryset.filter(store__id=store_id).order_by('id')
            except ValueError:
                # If store is not an integer, fallback to filtering by name
                store = replace_spaces(store)
                return queryset.filter(store__name=store).order_by('id')
        
        return queryset

class PictureViewSet(viewsets.ModelViewSet):
    serializer_class = PictureSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            prods = Product.objects.filter(store__owner=user)
            return Picture.objects.filter(product__in=prods)
        return Picture.objects.none()

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

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not self.request.user == instance.product.store.owner and not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to view this product.")
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class ProductListView(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all().order_by('id')
    serializer_class = ReadProductsShortSerializer
    pagination_class = ProductListPagination
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)
        store = self.request.query_params.get('store', None)
        queryset = super().get_queryset()

        if store:
            try:
                store_id = int(store)
                return queryset.filter(store__id=store_id).order_by('id')
            except ValueError:
                # If store is not an integer, fallback to filtering by name
                store = replace_spaces(store)
                return queryset.filter(store__name=store)

        if category:
            queryset = queryset.filter(category=category).order_by('id')

        if search:
            search = trim_and_case(search)
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(category__icontains=search) |
                Q(store__name__icontains=search) |
                Q(description__icontains=search)
            ).order_by('id')

        return queryset