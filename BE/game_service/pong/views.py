from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse

def start_game(request):
    # Add logic to start the game
    return JsonResponse({"message": "Game started successfully"}, status=200)