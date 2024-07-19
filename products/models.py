from django.db import models
from stores.models import Store
import uuid
from django.utils.deconstruct import deconstructible
from django.conf import settings
import boto3

class Product(models.Model):
    SIZE_CHOICES = [
        ('XS', 'Extra Small'),
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
        ('XL', 'Extra Large'),
        ('XXL', 'Double XL'),
        ('XXXL', 'Triple XL'),
    ]

    COLOR_CHOICES = [
        ('RED', 'Red'),
        ('BLU', 'Blue'),
        ('GRN', 'Green'),
        ('BLK', 'Black'),
        ('WHT', 'White'),
        ('YEL', 'Yellow'),
        ('ORN', 'Orange'),
        ('PUR', 'Purple'),
        ('PNK', 'Pink'),
        ('NVY', 'Navy'),
        ('GRY', 'Grey'),
        ('BRN', 'Brown'),
        ('TAN', 'Tan'),
        ('OTH', 'Other')
    ]

    CATEGORY_CHOICES = [
        ('electronics', 'Electronics'),
        ('clothing', 'Clothing'),
        ('home_kitchen', 'Home & Kitchen'),
        ('beauty_personal_care', 'Beauty & Personal Care'),
        ('health_wellness', 'Health & Wellness'),
        ('toys_games', 'Toys & Games'),
        ('sports_outdoors', 'Sports & Outdoors'),
        ('automotive', 'Automotive'),
        ('books', 'Books'),
        ('music_movies', 'Music & Movies'),
        ('office_supplies', 'Office Supplies'),
        ('pet_supplies', 'Pet Supplies'),
        ('baby_products', 'Baby Products'),
        ('garden_outdoor', 'Garden & Outdoor'),
        ('jewelry_accessories', 'Jewelry & Accessories'),
        ('shoes_footwear', 'Shoes & Footwear'),
        ('handmade_products', 'Handmade Products'),
        ('groceries', 'Groceries'),
        ('furniture', 'Furniture'),
        ('appliances', 'Appliances'),
        ('tools_home_improvement', 'Tools & Home Improvement'),
        ('arts_crafts', 'Arts & Crafts'),
        ('travel_luggage', 'Travel & Luggage'),
        ('smart_home_devices', 'Smart Home Devices'),
        ('software', 'Software'),
        ('industrial_scientific', 'Industrial & Scientific'),
        ('collectibles_fine_art', 'Collectibles & Fine Art'),
        ('musical_instruments', 'Musical Instruments'),
        ('gift_cards', 'Gift Cards'),
        ('watches', 'Watches'),
    ]

    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    size = models.CharField(max_length=4, choices=SIZE_CHOICES, blank=True, null=True)
    color = models.CharField(max_length=3, choices=COLOR_CHOICES, blank=True, null=True)
    variations = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, blank=True, null=True)
    barcode_number = models.CharField(max_length=100, blank=True, null=True)
    model_number = models.CharField(max_length=100, blank=True, null=True)
    manufacturer = models.CharField(max_length=255, blank=True, null=True)
    inventory_count = models.PositiveIntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    views = models.PositiveIntegerField(default=0)
    bought = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


@deconstructible
class PathAndRename:
    def __init__(self, path):
        self.path = path

    def __call__(self, instance, filename):
        ext = filename.split('.')[-1]
        filename = f'{uuid.uuid4()}.{ext}'
        return f'{self.path}/{filename}'

def product_picture_upload_to(instance, filename):
    return PathAndRename('products/pictures/')(instance, filename)

class Picture(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='pictures')
    image = models.ImageField(upload_to=product_picture_upload_to)
    alt = models.CharField(max_length=256)
    main = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.main:
            super().save(*args, **kwargs)
            pics = Picture.objects.filter(product=self.product).exclude(id=self.id)
            for pic in pics:
                if pic.main:
                    pic.main = False
                    pic.save()
        else:
            super().save(*args, **kwargs)
            pics = Picture.objects.filter(product=self.product)
            if len(pics) == 1:
                pics[0].main = True
                pics[0].save()

    def delete(self, *args, **kwargs):
        # Delete the file from S3
        s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )
        s3.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=self.image.name)
        
        # Call the parent class delete method
        super().delete(*args, **kwargs)