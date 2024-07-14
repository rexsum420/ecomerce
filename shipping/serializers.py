from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Shipping

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']

class ShippingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

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