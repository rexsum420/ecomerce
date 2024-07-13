from .models import Shipping
from rest_framework import serializers

class ShippingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipping
        fields = '__all__'
        
class CreateShippingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipping
        fields = ['name', 'address1', 'address2', 'city', 'state', 'zip', 'phone', 'email']

        extra_kwargs = {
            'address2': {'required': False},
            'phone': {'required': False},
            'email': {'required': False}
        }