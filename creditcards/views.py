from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import CreditCard, BillingAddress
from .serializers import CreditCardSerializer, BillingSerializer

class CreditCardViewSet(viewsets.ModelViewSet):
    queryset = CreditCard.objects.all()
    serializer_class = CreditCardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BillingViewSet(viewsets.ModelViewSet):
    queryset = BillingAddress.objects.all()
    serializer_class = BillingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        queryset = queryset.filter(card__user=user)

        card_number = self.request.query_params.get('card')
        if card_number:
            try:
                card = CreditCard.objects.get(user=user, card_number=card_number)
                queryset = queryset.filter(card=card)
            except CreditCard.DoesNotExist:
                queryset = queryset.none()
        
        return queryset

    def perform_create(self, serializer):
        serializer.save()