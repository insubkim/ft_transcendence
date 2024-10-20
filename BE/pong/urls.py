from django.urls import path
from .views import save_game_result, game_rankings

urlpatterns = [
    path('save-game-result/', save_game_result, name='save_game_result'),
    path('game-rankings/', game_rankings, name='game_rankings'),
]