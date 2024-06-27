from django.utils.deprecation import MiddlewareMixin
from django.utils.timezone import now
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.authentication import get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
from .encryption import encrypt, decrypt
from users.models import Profile

User = get_user_model()

class UserActivityUpdateMiddleware(MiddlewareMixin):
    def process_request(self, request):
        try:
            self.authenticate_user(request)
            if hasattr(request, 'user') and request.user.is_authenticated:
                self.update_active(request)
                self.update_ip_address(request)
        except AuthenticationFailed:
            # If authentication fails, return a 401 response
            return self._unauthorized_response()

    def authenticate_user(self, request):
        auth = get_authorization_header(request).split()
        if not auth or auth[0].lower() != b'token':
            return

        if len(auth) == 1:
            raise AuthenticationFailed('Invalid token header. No credentials provided.')
        elif len(auth) > 2:
            raise AuthenticationFailed('Invalid token header. Token string should not contain spaces.')

        try:
            token = auth[1].decode()
        except UnicodeError:
            raise AuthenticationFailed('Invalid token header. Token string should not contain invalid characters.')

        try:
            token_obj = Token.objects.get(key=token)
        except Token.DoesNotExist:
            raise AuthenticationFailed('Invalid token.')

        request.user = token_obj.user

    def update_active(self, request):
        profile = Profile.objects.get(user=request.user)
        if profile.last_active != now():
            profile.last_active = now()
            profile.save(update_fields=['last_active'])

    def update_ip_address(self, request):
        profile = Profile.objects.get(user=request.user)
        ip_address = request.META.get('REMOTE_ADDR')
        if ip_address and profile.ip_address != ip_address:
            profile.ip_address = ip_address
            profile.save(update_fields=['ip_address'])

    def _unauthorized_response(self):
        from django.http import JsonResponse
        return JsonResponse({'detail': 'Invalid token.'}, status=401)
    
class EncryptionMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.body:
            try:
                decrypted_data = decrypt(request.body.decode())
                request._body = decrypted_data.encode()
            except Exception as e:
                print(f"Decryption error: {e}")
    
    def process_response(self, request, response):
        if response.content:
            try:
                encrypted_data = encrypt(response.content.decode())
                response.content = encrypted_data.encode()
                response['Content-Length'] = len(response.content)
            except Exception as e:
                print(f"Encryption error: {e}")
        return response