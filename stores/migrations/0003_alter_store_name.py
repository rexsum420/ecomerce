# Generated by Django 5.0.6 on 2024-07-05 06:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stores', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='store',
            name='name',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
