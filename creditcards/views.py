from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import CreditCard
from .serializers import CreditCardSerializer

class CreditCardViewSet(viewsets.ModelViewSet):
    queryset = CreditCard.objects.all()
    serializer_class = CreditCardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
