from rest_framework import serializers
from .models import CreditCard

class CreditCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditCard
        fields = ['id', 'card_number', 'expiration_date', 'cvv', 'cardholder_name', 'is_default']

    
    def validate_card_number(self, value):
        user = self.context['request'].user
        if CreditCard.objects.filter(user=user, card_number=value).exists():
            raise serializers.ValidationError("You have already added this credit card.")
        return value
