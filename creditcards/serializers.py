from rest_framework import serializers
from .models import CreditCard, BillingAddress

class CreditCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditCard
        fields = ['id', 'card_number', 'expiration_date', 'cvv', 'cardholder_name', 'is_default']

    
    def validate_card_number(self, value):
        user = self.context['request'].user
        if CreditCard.objects.filter(user=user, card_number=value).exists():
            raise serializers.ValidationError("You have already added this credit card.")
        return value

class BillingSerializer(serializers.ModelSerializer):
    card_number = serializers.CharField(write_only=True)
    card = CreditCardSerializer(read_only=True)
    
    class Meta:
        model = BillingAddress
        fields = ['id', 'card_number', 'card', 'address1', 'address2', 'city', 'state', 'zip_code']
        extra_kwargs = {
            'address2': {'required': False},
        }

    def create(self, validated_data):
        card_number = validated_data.pop('card_number')
        user = self.context['request'].user
        card = CreditCard.objects.get(user=user, card_number=card_number)
        validated_data['card'] = card
        return super().create(validated_data)

    def update(self, instance, validated_data):
        card_number = validated_data.pop('card_number', None)
        if card_number:
            user = self.context['request'].user
            card = CreditCard.objects.get(user=user, card_number=card_number)
            instance.card = card
        return super().update(instance, validated_data)