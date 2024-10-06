from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if username and password:
        user = User.objects.create_user(username=username, password=password)
        return JsonResponse({"message": "User registered successfully"}, status=201)
    return JsonResponse({"error": "Invalid data"}, status=400)

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        return JsonResponse({"message": "Login successful"}, status=200)
    return JsonResponse({"error": "Invalid credentials"}, status=401)