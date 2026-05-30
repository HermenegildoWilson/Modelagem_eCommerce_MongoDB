"""Small CORS middleware for the API deployment."""

from __future__ import annotations

import os

from django.http import HttpResponse


def _split_env_list(value: str) -> set[str]:
    return {item.strip().rstrip("/") for item in value.split(",") if item.strip()}


DEFAULT_CORS_ALLOWED_ORIGINS = {
    "https://coreonmarket.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
}


class CorsMiddleware:
    """Allow browser clients from known frontend origins to call the API."""

    def __init__(self, get_response):
        self.get_response = get_response
        configured_origins = os.getenv("CORS_ALLOWED_ORIGINS", "")
        self.allowed_origins = DEFAULT_CORS_ALLOWED_ORIGINS | _split_env_list(
            configured_origins
        )

    def __call__(self, request):
        if request.method == "OPTIONS":
            response = HttpResponse(status=204)
        else:
            response = self.get_response(request)

        origin = request.headers.get("Origin", "").rstrip("/")
        if origin in self.allowed_origins:
            response["Access-Control-Allow-Origin"] = origin
            response["Access-Control-Allow-Credentials"] = "true"
            response["Access-Control-Allow-Methods"] = (
                "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            )
            response["Access-Control-Allow-Headers"] = (
                "Authorization, Content-Type, Accept, Origin, X-Requested-With"
            )
            response["Access-Control-Max-Age"] = "86400"
            vary = response.get("Vary")
            response["Vary"] = f"{vary}, Origin" if vary else "Origin"

        return response
