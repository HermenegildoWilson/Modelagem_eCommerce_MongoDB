"""Serialização de documentos BSON para JSON."""

from datetime import date, datetime
from typing import Any

from bson import ObjectId


def to_jsonable(value: Any) -> Any:
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, list):
        return [to_jsonable(item) for item in value]
    if isinstance(value, dict):
        return {key: to_jsonable(item) for key, item in value.items()}
    return value


def serialize_document(document: dict | None) -> dict | None:
    if document is None:
        return None
    return to_jsonable(document)


def serialize_documents(documents) -> list[dict]:
    return [serialize_document(document) for document in documents]

