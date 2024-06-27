from rest_framework import serializers
from .models import Product, Picture
from stores.serializers import StoreSerializer

class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = ['product', 'image', 'alt']

class ProductSerializer(serializers.ModelSerializer):
    pictures = PictureSerializer(many=True, read_only=True)
    store = StoreSerializer(read_only=True)
    class Meta:
        model = Product
        fields = [
            'id', 'store', 'name', 'description', 'price', 'size', 'color', 
            'variations', 'barcode_number', 'model_number', 'manufacturer', 
            'inventory_count', 'created_at', 'pictures', 'category'
        ]
        extra_kwargs = {
            'description': {'required': False},
            'size': {'required': False},
            'color': {'required': False},
            'variations': {'required': False},
            'barcode_number': {'required': False},
            'model_number': {'required': False},
            'manufacturer': {'required': False},
            'inventory_count': {'required': False},
            'category': {'required': False},
        }

class CreateProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['store', 'name', 'description', 'price', 'size', 'color', 
            'variations', 'barcode_number', 'model_number', 'manufacturer', 
            'inventory_count', 'category']
        extra_kwargs = {
            'description': {'required': False},
            'size': {'required': False},
            'color': {'required': False},
            'variations': {'required': False},
            'barcode_number': {'required': False},
            'model_number': {'required': False},
            'manufacturer': {'required': False},
            'inventory_count': {'required': False},
            'category': {'required': False},
        }