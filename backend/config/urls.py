"""URLs principais da API."""

from django.urls import include, path

urlpatterns = [
    path("api/", include("apps.catalog.urls")),
]
