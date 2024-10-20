from django.db import models

# Create your models here.
class Player(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class GameResult(models.Model):
    GAME_MODES = [
        ('2d-1vs1', '2D 1v1'),
        ('2d-tournament', '2D Tournament'),
        ('3d-1vs1', '3D 1v1'),
        ('3d-tournament', '3D Tournament'),
    ]
    game_mode = models.CharField(max_length=20, choices=GAME_MODES)
    players = models.ManyToManyField(Player)
    winner = models.ForeignKey(Player, related_name='wins', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)