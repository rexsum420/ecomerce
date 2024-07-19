from django.db import models
from django.contrib.auth.models import User

class CreditCard(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='credit_cards')
    card_number = models.CharField(max_length=16)
    expiration_date = models.CharField(max_length=7)
    cvv = models.CharField(max_length=4)
    cardholder_name = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'card_number')

    def __str__(self):
        return f"{self.cardholder_name} - **** **** **** {self.card_number[-4:]}"

class BillingAddress(models.Model):
    card = models.ForeignKey(CreditCard, on_delete=models.CASCADE)
    address1 = models.CharField(max_length=250)
    address2 = models.CharField(max_length=250, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)