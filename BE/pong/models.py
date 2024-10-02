from django.db import models

# Create your models here.
class Tournament(models.Model):
	name = models.CharField(max_length=100)
	date = models.DateField()

class Score(models.Model):
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
	player_name = models.CharField(max_length=100)
	score = models.IntegerField()