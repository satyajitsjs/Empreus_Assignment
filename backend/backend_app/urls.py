from django.urls import path
from backend_app import views as v

urlpatterns = [
    path('products', v.product_list, name='product-list'),
    path('products/<int:pk>', v.product_detail, name='product-detail'),
    path('cart', v.cart_list, name='cart-list'),
    path('cart/<int:cart_item_id>', v.cart_detail, name='cart-detail'),
    path('adjust_cart/<int:cart_item_id>', v.adjust_cart, name='cart-detail'),
]
