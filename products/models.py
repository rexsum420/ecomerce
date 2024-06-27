from django.db import models
from stores.models import Store

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
        ('LBU', 'Light Blue'),
        ('DGY', 'Dark Grey'),
        ('LGR', 'Light Green'),
        ('DGR', 'Dark Green'),
        ('TEA', 'Teal'),
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

    def __str__(self):
        return self.name

class Picture(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='pictures')
    image = models.ImageField(upload_to='products/pictures/')
    alt = models.CharField(max_length=256)