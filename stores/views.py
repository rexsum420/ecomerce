from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Store
from .serializers import StoreSerializer, CreateStoreSerializer, ListStoresSerializer, GetStoreByNameSerializer
from users.permissions import IsStoreOwnerOrReadOnly
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import mixins
from rest_framework.decorators import action
from market.utils import trim_and_case
from .utils import replace_spaces
import logging

class StoreViewSet(viewsets.ModelViewSet):
    serializer_class = StoreSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        if self.request.user is not None:
            return Store.objects.filter(owner=self.request.user)
        return Store.objects.none()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateStoreSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.owner != self.request.user:
            raise PermissionDenied('You are not the owner of this store')
        serializer.save()

    def perform_partial_update(self, serializer):
        instance = self.get_object()
        if instance.owner != self.request.user:
            raise PermissionDenied('You are not the owner of this store')
        serializer.save()

    def perform_destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.owner != self.request.user:
            raise PermissionDenied('You are not the owner of this store')
        instance.delete()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not self.request.user == instance.owner:
            raise PermissionDenied("You do not have permission to view this product.")
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class StoreListView(viewsets.ReadOnlyModelViewSet):
    queryset = Store.objects.all()
    serializer_class = ListStoresSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Store.objects.filter(owner=self.request.user).order_by('id')
        return Store.objects.none()
    
logger = logging.getLogger(__name__)

class ReadStoreViewSet(mixins.RetrieveModelMixin,
                       mixins.ListModelMixin,
                       viewsets.GenericViewSet):
    queryset = Store.objects.all()
    serializer_class = GetStoreByNameSerializer

    def get_queryset(self):
        store_name = self.request.query_params.get('store', None)
        store_list = self.request.query_params.get('list', None)
        
        logger.debug(f"Received query parameters - store: {store_name}, list: {store_list}")
        
        if store_name:
            # Remove any trailing slash or whitespace from the store_name
            store_name = replace_spaces(store_name.rstrip('/').strip())
            logger.debug(f"Querying store by name: {store_name}")
            # Filter stores by name (case-insensitive)
            stores = Store.objects.filter(name__iexact=store_name)
            if stores.exists():
                logger.debug(f"Store found: {stores}")
                return stores
            logger.debug(f"Store not found: {store_name}")
        elif store_list is not None:
            logger.debug("Querying all stores")
            return Store.objects.all()
        logger.debug("No valid query parameters provided")
        return Store.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if queryset.exists():
            if 'list' in request.query_params:
                serializer = ListStoresSerializer(queryset, many=True)
            else:
                serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return Response({"detail": "Not found."}, status=404)