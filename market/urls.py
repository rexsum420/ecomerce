"""
URL configuration for local_market project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet, ProfileViewSet, activate
from stores.views import StoreViewSet
from products.views import ProductViewSet, PictureViewSet
from orders.views import OrderViewSet, LineItemViewSet
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'stores', StoreViewSet, basename='store')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'pictures', PictureViewSet, basename='picture')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'lineitems', LineItemViewSet, basename='lineitem')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('auth/', ObtainAuthToken.as_view()),
    path('activate/<token>/', activate, name='activate'),
]
