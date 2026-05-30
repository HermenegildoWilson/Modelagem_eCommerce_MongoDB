"""Operações de persistência e índices no MongoDB."""

from typing import Any, Dict, List
from urllib.parse import urlsplit, urlunsplit

from pymongo import MongoClient
from pymongo.errors import BulkWriteError


INDICES_PRODUTOS = [
    ({"sku": 1}, {"unique": True}),
    ({"categoria": 1}, {}),
    ({"preco": 1}, {}),
    ({"avaliacao.rating_medio": -1}, {}),
    ({"categoria": 1, "preco": 1, "avaliacao.rating_medio": -1}, {}),
    ({"em_stock": 1}, {}),
    ({"nome": "text", "descricao": "text"}, {}),
    ({"atributos_dinamicos.marca": 1}, {}),
    ({"info_administrativo.data_criacao": -1}, {}),
]


def mascarar_uri(uri: str) -> str:
    """Oculta credenciais da URI antes de imprimir no terminal."""
    parts = urlsplit(uri)
    if "@" not in parts.netloc:
        return uri

    _, host = parts.netloc.rsplit("@", 1)
    return urlunsplit((parts.scheme, f"***:***@{host}", parts.path, parts.query, parts.fragment))


def conectar(uri: str, database_name: str, collection_name: str):
    """Cria cliente, seleciona base de dados e coleção."""
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    collection = client[database_name][collection_name]
    client.admin.command("ping")
    return client, collection


def inserir_batch(collection, produtos_batch: List[Dict[str, Any]]) -> int:
    """Insere um lote e retorna quantos documentos foram gravados."""
    if not produtos_batch:
        return 0

    try:
        result = collection.insert_many(produtos_batch, ordered=False)
        return len(result.inserted_ids)
    except BulkWriteError as e:
        inserted = e.details.get("nInserted", 0)
        write_errors = e.details.get("writeErrors", [])
        duplicate_errors = [err for err in write_errors if err.get("code") == 11000]
        other_errors = [err for err in write_errors if err.get("code") != 11000]

        if duplicate_errors:
            print(f"  ⚠️ SKUs duplicados ignorados: {len(duplicate_errors)}")
        if other_errors:
            print(f"  ⚠️ Outros erros no batch: {len(other_errors)}")

        return inserted


def criar_indices(collection) -> None:
    """Cria os índices usados pelas consultas avançadas."""
    print(f"\n{'='*70}")
    print("🔍 CRIANDO ÍNDICES")
    print(f"{'='*70}\n")

    for idx_spec, idx_options in INDICES_PRODUTOS:
        try:
            idx_name = collection.create_index(idx_spec, **idx_options)
            print(f"  ✅ Índice criado: {idx_name}")
        except Exception as e:
            print(f"  ⚠️ Erro ao criar índice {idx_spec}: {e}")

