from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Order, LineItem
from .serializers import OrderSerializer, LineItemSerializer, CreateLineItemSerializer, CreateOrderSerializer
from users.permissions import IsCustomerOrStoreReadOnly

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsCustomerOrStoreReadOnly, IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        user = self.request.user
        if user is not None:
            return Order.objects.filter(customer=user) | Order.objects.filter(store__owner=user)
        return None

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateOrderSerializer
        return super().get_serializer_class

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

class LineItemViewSet(viewsets.ModelViewSet):
    serializer_class = LineItemSerializer
    permission_classes = [IsCustomerOrStoreReadOnly, IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        user = self.request,user
        if user is not None:
            return LineItem.objects.filter(order__customer=user) | LineItem.objects.filter(order__store__owner=user)
        return None
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateLineItemSerializer
        return super().get_serializer_class

    def perform_create(self, serializer):
        serializer.save()
