from django.urls import path
from .views import activate

urlpatterns = [
    path('activate/<uidb64>/<token>/', activate, name='activate'),
]