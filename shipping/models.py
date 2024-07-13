from django.db import models
from django.contrib.auth.models import User

class Shipping(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    address1 = models.CharField(max_length=150)
    address2 = models.CharField(max_length=150, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip = models.CharField(max_length=100)
    phone = models.CharField(max_length=100, blank=True)
    email = models.CharField(max_length=100, blank=True)
    def __str__(self):
        return self.name