from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Order, LineItem
from .serializers import OrderSerializer, LineItemSerializer, CreateLineItemSerializer, CreateOrderSerializer
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        user = self.request.user
        queryset = Order.objects.filter(customer=user) | Order.objects.filter(store__owner=user)
        return queryset.order_by('-order_date')  # Ensure the queryset is ordered

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateOrderSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not self.request.user == instance.store.owner or self.request.user == instance.customer:
            raise PermissionDenied("You do not have permission to view this product.")
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
class LineItemViewSet(viewsets.ModelViewSet):
    serializer_class = LineItemSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        user = self.request.user
        queryset = LineItem.objects.filter(order__customer=user) | LineItem.objects.filter(order__store__owner=user)
        return queryset.order_by('-id')  # Ensure the queryset is ordered

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateLineItemSerializer
        return LineItemSerializer

    def perform_create(self, serializer):
        serializer.save()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not self.request.user == instance.order.store.owner or self.request.user == instance.order.customer:
            raise PermissionDenied("You do not have permission to view this product.")
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
