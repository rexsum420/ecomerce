from rest_framework import serializers
from .models import Store
from users.serializers import UserSerializer

class StoreSerializer(serializers.ModelSerializer):
    owner = UserSerializer()
    class Meta:
        model = Store
        fields = [
            'id', 'owner', 'name', 'description', 'website', 'phone', 
            'verified', 'created_at'
        ]
        extra_kwargs = {
            'description': {'required': False},
            'website': {'required': False},
            'phone': {'required': False},
            'verified': {'required': False},
        }

class CreateStoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = [
            'owner', 'name', 'description', 'website', 'phone'
        ]
        extra_kwargs = {
            'owner': {'required': False},
            'description': {'required': False},
            'website': {'required': False},
            'phone': {'required': False},
        }

        def create(self, instance):
            instance.owner = self.context['request'].user
            return super().create(instance)


class ListStoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['id', 'name']