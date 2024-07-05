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

class StoreViewSet(viewsets.ModelViewSet):
    serializer_class = StoreSerializer
    permission_classes = [IsStoreOwnerOrReadOnly, IsAuthenticated]
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
    
class ReadStoreViewSet(mixins.RetrieveModelMixin,
                   mixins.ListModelMixin,
                   viewsets.GenericViewSet):
    queryset = Store.objects.all()
    serializer_class = GetStoreByNameSerializer

    @action(detail=False, methods=['get'], url_path='name/(?P<name>[^/.]+)')
    def get_by_name(self, request, name=None):
        store = Store.objects.filter(name=name).first()
        if store:
            serializer = self.get_serializer(store)
            return Response(serializer.data)
        return Response({"detail": "Not found."}, status=404)
