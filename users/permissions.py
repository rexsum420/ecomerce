from rest_framework import permissions
from rest_framework.permissions import BasePermission

class UserModelMixin:
    def get_permissions(self):
        if self.request.method in ['DELETE']:
            self.permission_classes = [permissions.IsAdminUser]
        elif self.request.method in ['POST']:
            self.permission_classes = [permissions.AllowAny]
        else:
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()

class IsStoreOwnerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        return obj.store.owner == request.user

class IsCustomerOrStoreReadOnly(BasePermission):
    def has_permission(self, request, view):
        return False

    def has_object_permission(self, request, view, obj):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return obj.customer == request.user or obj.store.owner == request.user
        if request.method == 'POST':
            return True        
        return False
