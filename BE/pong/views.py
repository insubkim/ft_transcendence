from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Player, GameResult
from django.http import HttpResponse
from pong import blockchain
from django.http import JsonResponse
from django.db.models import Count, Q

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

    blockchain.send.log(game_mode, players_names, winner_name)
    players = [Player.objects.get_or_create(name=name)[0] for name in players_names]
    winner, _ = Player.objects.get_or_create(name=winner_name)

    game_result = GameResult.objects.create(game_mode=game_mode, winner=winner)
    game_result.players.set(players)
    game_result.save()

    return Response({"message": "Game result saved successfully"})

def game_rankings(request):
    # 상위 3명의 플레이어 조회 (기존 코드)
    top_2d_1vs1 = Player.objects.annotate(
        win_count=Count('wins', filter=Q(wins__game_mode='2d-1vs1'))
    ).filter(win_count__gt=0).order_by('-win_count')[:3]

    # 상위 5명의 플레이어 조회 - 2d-tournament
    top_2d_tournament = Player.objects.annotate(
        win_count=Count('wins', filter=Q(wins__game_mode='2d-tournament'))
    ).filter(win_count__gt=0).order_by('-win_count')[:3]

    # 상위 5명의 플레이어 조회 - 3d-1vs1
    top_3d_1vs1 = Player.objects.annotate(
        win_count=Count('wins', filter=Q(wins__game_mode='3d-1vs1'))
    ).filter(win_count__gt=0).order_by('-win_count')[:3]

    # 상위 5명의 플레이어 조회 - 3d-tournament
    top_3d_tournament = Player.objects.annotate(
        win_count=Count('wins', filter=Q(wins__game_mode='3d-tournament'))
    ).filter(win_count__gt=0).order_by('-win_count')[:3]

    # JSON 응답을 위한 데이터 준비
    data = {
        '2d-1vs1-top3': [
            {
                'name': player.name,
                'win_count': player.win_count
            }
            for player in top_2d_1vs1
        ],
        '2d-tournament-top3': [
            {
                'name': player.name,
                'win_count': player.win_count
            }
            for player in top_2d_tournament
        ],
        '3d-1vs1-top3': [
            {
                'name': player.name,
                'win_count': player.win_count
            }
            for player in top_3d_1vs1
        ],
        '3d-tournament-top3': [
            {
                'name': player.name,
                'win_count': player.win_count
            }
            for player in top_3d_tournament
        ],
    }

    return JsonResponse(data)
