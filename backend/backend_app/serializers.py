from rest_framework import serializers
from .models import Product , Cart

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer()  # Use nested serializer for the product

    class Meta:
        model = Cart
        fields = ['id', 'quantity', 'product']