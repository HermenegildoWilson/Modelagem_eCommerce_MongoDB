"""Settings mínimos para expor as queries MongoDB via Django REST."""

import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-only-sgbd-ecommerce-secret")
DEBUG = os.getenv("DJANGO_DEBUG", "false").lower() == "true"

default_allowed_hosts = [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    ".onrender.com",
]

render_external_hostname = os.getenv("RENDER_EXTERNAL_HOSTNAME")
if render_external_hostname:
    default_allowed_hosts.append(render_external_hostname)

ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv("DJANGO_ALLOWED_HOSTS", ",".join(default_allowed_hosts)).split(",")
    if host.strip()
]

INSTALLED_APPS = [
    "rest_framework",
    "apps.catalog",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

LANGUAGE_CODE = "pt-ao"
TIME_ZONE = "Africa/Luanda"
USE_I18N = True
USE_TZ = True
STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ],
    "UNAUTHENTICATED_USER": None,
}

MONGODB_URI = os.getenv(
    "MONGODB_URI",
    "mongodb+srv://hermenegildowilson7:mortadela06@cluster0.cyhnmsp.mongodb.net/?appName=Cluster0",
)
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "ecommerce")
MONGODB_COLLECTION = os.getenv("MONGODB_COLLECTION", "produtos")
MONGODB_TIMEOUT_MS = int(os.getenv("MONGODB_TIMEOUT_MS", "5000"))
