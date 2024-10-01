from django.db import models

# Create your models here.
from django.db import models

class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)

class Tournament(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    users = models.ManyToManyField(User)
    winner = models.CharField(max_length=100, blank=True)
    score = models.IntegerField(default=0)