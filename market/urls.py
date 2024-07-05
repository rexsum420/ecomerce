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
from users.views import UserViewSet, ProfileViewSet, activate, CheckTokenView
from stores.views import StoreViewSet, StoreListView, ReadStoreViewSet
from products.views import ProductViewSet, PictureViewSet, ProductListView
from orders.views import OrderViewSet, LineItemViewSet
from django.conf import settings
from django.conf.urls.static import static
from . import views

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'stores', StoreViewSet, basename='store')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'pictures', PictureViewSet, basename='picture')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'lineitems', LineItemViewSet, basename='lineitem')
router.register(r'homepage', ProductListView, basename='homepage')
router.register(r'my-stores', StoreListView, basename='my_store')
router.register(r'search', ProductListView, basename='search')
router.register(r'get-store', ReadStoreViewSet, basename='get_store')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('auth/', ObtainAuthToken.as_view()),
    path('activate/<token>/', activate, name='activate'),
    path('check/<token>/', CheckTokenView.as_view(), name='check'),
    path('', views.index, name='react')
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)