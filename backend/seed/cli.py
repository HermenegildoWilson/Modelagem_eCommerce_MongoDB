"""Interface de linha de comando do seed."""

import argparse
import os

from eCommerce.backend.seed.config import (
    DEFAULT_BATCH_SIZE,
    DEFAULT_COLLECTION,
    DEFAULT_DATABASE,
    DEFAULT_MONGO_URI,
)
from eCommerce.backend.seed.runner import seed_database


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Script de seeding para MongoDB - Catálogo de Produtos"
    )
    parser.add_argument("--count", type=int, default=100000, help="Número de produtos")
    parser.add_argument(
        "--uri",
        default=os.getenv("MONGODB_URI", DEFAULT_MONGO_URI),
        help="URI de conexão MongoDB. Também pode ser definida por MONGODB_URI.",
    )
    parser.add_argument("--db", default=DEFAULT_DATABASE, help="Nome da base de dados")
    parser.add_argument("--collection", default=DEFAULT_COLLECTION, help="Nome da coleção")
    parser.add_argument(
        "--batch-size",
        type=int,
        default=DEFAULT_BATCH_SIZE,
        help="Tamanho dos lotes de inserção",
    )
    return parser


def main() -> None:
    args = build_parser().parse_args()
    seed_database(args.count, args.uri, args.db, args.collection, args.batch_size)

