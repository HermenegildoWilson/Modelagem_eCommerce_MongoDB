"""Acesso centralizado à coleção MongoDB."""

from functools import lru_cache

from django.conf import settings
from pymongo import MongoClient


@lru_cache(maxsize=1)
def get_client() -> MongoClient:
    return MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=settings.MONGODB_TIMEOUT_MS)


def get_collection():
    client = get_client()
    return client[settings.MONGODB_DATABASE][settings.MONGODB_COLLECTION]

