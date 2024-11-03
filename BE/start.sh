python manage.py makemigrations pong
python manage.py migrate 

exec python manage.py runsslserver 0.0.0.0:443 --certificate /app/django.crt --key /app/django.key
