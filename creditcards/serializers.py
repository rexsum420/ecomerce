from rest_framework import serializers
from .models import CreditCard

class CreditCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditCard
        fields = ['id', 'card_number', 'expiration_date', 'cvv', 'cardholder_name', 'is_default']
        extra_kwargs = {
            'card_number': {'write_only': True},
            'cvv': {'write_only': True}
        }
