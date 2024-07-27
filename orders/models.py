from django.db import models
from stores.models import Store
from products.models import Product
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Order(models.Model):
    transaction_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    store = models.ForeignKey(Store, on_delete=models.DO_NOTHING, related_name='invoices')
    customer = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='receipts')
    order_date = models.DateField(auto_now_add=True)

    @property
    def total(self):
        total_sum = 0
        line_items=LineItem.objects.filter(order=self)
        for line in line_items:
            total_sum += line.total_line_price
        return total_sum

    def __str__(self):
        return f'Order {self.transaction_id}-{self.customer.first_name} {self.customer.last_name} at {self.store.name} ${self.total}'

class LineItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='line_items')
    product = models.ForeignKey(Product, on_delete=models.DO_NOTHING, related_name='line_items')
    quantity = models.PositiveIntegerField()

    @property
    def total_line_price(self):
        return float(self.product.price * self.quantity)

    def __str__(self):
        return f'{self.quantity} of {self.product.name}'