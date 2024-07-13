from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ShippingSerializer, CreateShippingSerializer, Shipping
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class ShippingViewSet(viewsets.ModelViewSet):
    serializer_class = ShippingSerializer
    queryset = Shipping.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user:
            return Shipping.objects.filter(user=self.request.user)
        return Shipping.objects.none()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateShippingSerializer
        return super().get_serializer_class()
    