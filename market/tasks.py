from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_order_confirmation_email(order_id):
    from orders.models import Order
    order = Order.objects.get(id=order_id)
    send_mail(
        'Order Confirmation',
        f'Your order {order.id} has been confirmed.',
        'from@example.com',
        [order.user.email],
        fail_silently=False,
    )
@shared_task
def update_inventory(product_id, quantity):
    from products.models import Product
    product = Product.objects.get(id=product_id)
    product.inventory_count -= quantity
    product.save()
