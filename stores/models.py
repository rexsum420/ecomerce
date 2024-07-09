from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

class Store(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stores')
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, default='')
    website = models.URLField(blank=True, default='')
    phone = models.CharField(max_length=16, blank=True, default='')
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name