from django.shortcuts import render
# products/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import Product, Cart
from .serializers import ProductSerializer, CartSerializer


@api_view(['GET', 'POST'])
def product_list(request):
    if request.method == 'GET':
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Product created successfully', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'message': 'Failed to create product', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response({'message': 'Product retrieved successfully', 'data': serializer.data})

    elif request.method == 'PUT':
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Product updated successfully', 'data': serializer.data})
        return Response({'message': 'Failed to update product', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        product.delete()
        return Response({'message': 'Product deleted successfully'}, status=status.HTTP_204_NO_CONTENT)



# Add To Cart
@api_view(['GET', 'POST'])
def cart_list(request):
    if request.method == 'GET':
        cart_items = Cart.objects.all()
        serializer = CartSerializer(cart_items, many=True)
        return Response({'message': 'Cart Fetched SuccessFully', 'data': serializer.data})

    elif request.method == 'POST':
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = Cart.objects.get_or_create(product=product)

        if not created:
            cart_item.quantity += int(quantity)
            cart_item.save()

        serializer = CartSerializer(cart_item)
        return JsonResponse({'message': 'Add To Cart SuccessFully', 'data': serializer.data})



@api_view(['GET', 'PUT', 'DELETE'])
def cart_detail(request, cart_item_id):
    try:
        cart_item = Cart.objects.get(id=cart_item_id)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CartSerializer(cart_item)
        return Response({'message': 'Cart Item get SuccessFully', 'data': serializer.data})

    elif request.method == 'PUT':
        new_quantity = request.data.get('quantity', cart_item.quantity)
        cart_item.quantity = int(new_quantity)
        cart_item.save()

        serializer = CartSerializer(cart_item)
        return Response({'message': 'Cart Update SuccessFully', 'data': serializer.data})

    elif request.method == 'DELETE':
        cart_item.delete()
        return JsonResponse({'message': 'Item removed SuccessFully'})


@api_view(['POST'])
def adjust_cart(request, cart_item_id):
    try:
        cart_item = Cart.objects.get(product=cart_item_id)
        print(cart_item)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

    action = request.data.get('action', 'add')  # 'add' or 'remove'
    quantity = int(request.data.get('quantity', 1))

    if action == 'remove':
        if quantity >= cart_item.quantity:
            cart_item.delete()
        else:
            cart_item.quantity -= quantity
            cart_item.save()
    else:
        cart_item.quantity += quantity
        cart_item.save()

    serializer = CartSerializer(cart_item)
    return Response(serializer.data)
