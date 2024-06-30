const CATEGORY_CHOICES = [
    ['electronics', 'Electronics'],
    ['clothing', 'Clothing'],
    ['home_kitchen', 'Home & Kitchen'],
    ['beauty_personal_care', 'Beauty & Personal Care'],
    ['health_wellness', 'Health & Wellness'],
    ['toys_games', 'Toys & Games'],
    ['sports_outdoors', 'Sports & Outdoors'],
    ['automotive', 'Automotive'],
    ['books', 'Books'],
    ['music_movies', 'Music & Movies'],
    ['office_supplies', 'Office Supplies'],
    ['pet_supplies', 'Pet Supplies'],
    ['baby_products', 'Baby Products'],
    ['garden_outdoor', 'Garden & Outdoor'],
    ['jewelry_accessories', 'Jewelry & Accessories'],
    ['shoes_footwear', 'Shoes & Footwear'],
    ['handmade_products', 'Handmade Products'],
    ['groceries', 'Groceries'],
    ['furniture', 'Furniture'],
    ['appliances', 'Appliances'],
    ['tools_home_improvement', 'Tools & Home Improvement'],
    ['arts_crafts', 'Arts & Crafts'],
    ['travel_luggage', 'Travel & Luggage'],
    ['smart_home_devices', 'Smart Home Devices'],
    ['software', 'Software'],
    ['industrial_scientific', 'Industrial & Scientific'],
    ['collectibles_fine_art', 'Collectibles & Fine Art'],
    ['musical_instruments', 'Musical Instruments'],
    ['gift_cards', 'Gift Cards'],
    ['watches', 'Watches']
];

const getCategoryLabel = (categoryValue) => {
    const category = CATEGORY_CHOICES.find(([value, label]) => value === categoryValue);
    return category ? category[1] : null;
};

export default getCategoryLabel