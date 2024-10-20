from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Player, GameResult
from django.http import HttpResponse

#example homepage
def home(request):
    return HttpResponse("<h1>Welcome to ft_transcendence</h1>")

# Create your views here.
# Receive Game Data from Frontend
@api_view(['POST'])
def save_game_result(request):
    data = request.data
    game_mode = data.get('game-mode')
    players_names = data.get('players')
    winner_name = data.get('winner-name')

    players = [Player.objects.get_or_create(name=name)[0] for name in players_names]
    winner, _ = Player.objects.get_or_create(name=winner_name)

    game_result = GameResult.objects.create(game_mode=game_mode, winner=winner)
    game_result.players.set(players)
    game_result.save()

    return Response({"message": "Game result saved successfully"})

#Return Game rankings
@api_view(['GET'])
def game_rankings(request):
    rankings = {
        '2d-1vs1-top5': [player.name for player in Player.objects.filter(gameresult__game_mode='2d-1vs1').order_by('-wins')[:5]],
        '2d-tournament-top5': [player.name for player in Player.objects.filter(gameresult__game_mode='2d-tournament').order_by('-wins')[:5]],
        '3d-1vs1-top5': [player.name for player in Player.objects.filter(gameresult__game_mode='3d-1vs1').order_by('-wins')[:5]],
        '3d-tournament-top5': [player.name for player in Player.objects.filter(gameresult__game_mode='3d-tournament').order_by('-wins')[:5]],
    }
    return Response(rankings)