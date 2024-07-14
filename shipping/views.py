from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_list_or_404
from .models import Shipping
from .serializers import ShippingSerializer, CreateShippingSerializer

class ShippingViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Shipping.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateShippingSerializer
        return ShippingSerializer

    @action(detail=False, methods=['get'], url_path='(?P<username>[^/.]+)')
    def by_username(self, request, username=None):
        shipping = get_list_or_404(Shipping, user__username=username)
        serializer = self.get_serializer(shipping, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
