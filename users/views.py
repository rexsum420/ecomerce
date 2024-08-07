from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from .serializers import UserSerializer, ProfileSerializer, Profile
from .permissions import UserModelMixin
from django.contrib.auth import get_user_model
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import render, HttpResponse
from django.contrib.auth.models import User
from django.contrib import messages
from rest_framework.status import HTTP_200_OK
from rest_framework.views import APIView
from rest_framework import permissions
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

class CheckTokenView(APIView):
    def get(self, request, token, format=None):
        try:
            tokn = Token.objects.get(key=token)
            return Response({'detail': 'Token verified', 'user': tokn.user.username}, status=HTTP_200_OK)
        except Token.DoesNotExist:
            raise PermissionDenied('Token doesn\'t match any user tokens')

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
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not self.request.user == instance:
            raise PermissionDenied("You do not have permission to view this product.")
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Profile.objects.all()
    lookup_field = 'user__username'
    pagination_class=None

    def get_queryset(self):
        username = self.request.query_params.get('user')
        if username:
            return Profile.objects.filter(user__username=username)
        return Profile.objects.all()

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
        raise PermissionDenied('Profiles cannot be deleted')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)