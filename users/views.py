from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from .serializers import UserSerializer, ProfileSerializer, Profile
from .permissions import UserModelMixin
from django.contrib.auth import get_user_model
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import redirect, render, HttpResponse
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib import messages
from market.utils import email_verification_token
from .models import send_verification_email
from rest_framework.authtoken.models import Token

def activate(request, token):
    try:
        tokn = Token.objects.get(key=token)
        user = tokn.user
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None:
        user.profile.email_confirmed = True
        user.profile.save()
        messages.success(request, 'Your email has been confirmed.')
        return render(request, 'email_verified.html', {'user': user})
    else:
        messages.warning(request, 'The confirmation link was invalid, possibly because it has already been used.')
        return HttpResponse('email not verified')
User = get_user_model()

class UserViewSet(UserModelMixin, viewsets.ModelViewSet):
    serializer_class = UserSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated:
            if user.is_staff:
                return User.objects.all()
            else:
                return User.objects.filter(id=user.id)
        return User.objects.none()

    def get_permissions(self):
        if self.request.method == 'POST':
            # Allow everyone to create an account
            return []
        return super().get_permissions()

    def get_authenticators(self):
        if self.request.method == 'POST':
            # Disable authentication for create action
            return []
        return super().get_authenticators()

    def perform_create(self, serializer):

        serializer.save()

    def perform_destroy(self, instance):
        return PermissionDenied('Users can not be deleted')

class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Profile.objects.all()

    def perform_create(self, serializer):
        raise PermissionDenied('Profiles are created by the server automatically')
    
    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.user != self.request.user:
            raise PermissionDenied('You can only update your own profile')
        serializer.save()

    def perform_partial_update(self, serializer):
        instance = self.get_object()
        if instance.user != self.request.user:
            raise PermissionDenied('You can only update your own profile')
        serializer.save()

    def perform_destroy(self, serializer):
        raise PermissionDenied('Profiles can not be deleted')
