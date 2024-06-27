from rest_framework import serializers
from .models import Order, LineItem
from products.serializers import ProductSerializer
from stores.serializers import StoreSerializer
from users.serializers import UserSerializer

class LineItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = LineItem
        fields = ['product', 'quantity', 'total_line_price']

class CreateLineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LineItem
        fields = ['product', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    line_items = LineItemSerializer(many=True, read_only=True)
    store = StoreSerializer()
    customer = UserSerializer()
    class Meta:
        model = Order
        fields = ['transaction_id', 'store', 'customer', 'order_date', 'total', 'line_items']

class CreateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['store', 'customer']
