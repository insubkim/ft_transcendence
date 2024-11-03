#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
# from pong import blockchain
from dotenv import load_dotenv  # Import load_dotenv to load environment variables
import os
import sys
load_dotenv()  # Load environment variables from .env

def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "BE.settings")
    from pong import blockchain  # Moved import here to ensure env variables are loaded
    blockchain.send.code()
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
