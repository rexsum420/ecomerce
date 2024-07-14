from django.db import models
from django.contrib.auth.models import User

class CreditCard(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='credit_cards')
    card_number = models.CharField(max_length=16, unique=True)
    expiration_date = models.CharField(max_length=7)
    cvv = models.CharField(max_length=4)
    cardholder_name = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.cardholder_name} - **** **** **** {self.card_number[-4:]}"
