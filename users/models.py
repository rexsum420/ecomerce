from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import models
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings
from django.urls import reverse
from market.utils import email_verification_token
from django.contrib.sites.shortcuts import get_current_site

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=24, blank=True, null=True)
    last_name = models.CharField(max_length=24, blank=True, null=True)
    phone_number = models.CharField(max_length=16, blank=True, null=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    email_confirmed = models.BooleanField(default=False)
    last_active = models.CharField(max_length=512, blank=True, null=True)

    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        Token.objects.create(user=instance)

def send_verification_email(user, request):
    tokn = Token.objects.get(user=user)
    token = tokn.key 
    current_site = get_current_site(request)
    mail_subject = 'Activate your account.'
    message = render_to_string('acc_active_email.html', {
        'user': user,
        'domain': current_site.domain,
        'token': token,
    })
    send_mail(
        mail_subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
