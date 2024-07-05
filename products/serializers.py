from rest_framework import serializers
from .models import Product, Picture
from stores.serializers import StoreSerializer

class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = ['product', 'image', 'alt', 'main']
        extra_kwargs = {
            'main': {'required': False}
        }

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
        fields = [
            'store', 'name', 'description', 'price', 'size', 'color', 
            'variations', 'barcode_number', 'model_number', 'manufacturer', 
            'inventory_count', 'category'
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

    def validate_store(self, value):
        if not value.owner == self.context['request'].user:
            raise serializers.ValidationError("You do not have permission to create products for this store.")
        return value

class ReadProductsShortSerializer(serializers.ModelSerializer):
    pictures = serializers.SerializerMethodField(read_only=True)
    store = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description', 'pictures', 'store', 'category']

    def get_pictures(self, obj):
        main_pic = Picture.objects.filter(product=obj, main=True).first()
        if main_pic:
            return main_pic.image.url
        return None

    def get_store(self, obj):
        return obj.store.name