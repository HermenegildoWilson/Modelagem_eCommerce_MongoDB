"""Consultas MongoDB orientadas pelos padrões de acesso do relatório."""

from bson import ObjectId
from pymongo.collection import Collection


PRODUCT_PROJECTION = {
    "sku": 1,
    "nome": 1,
    "descricao": 1,
    "categoria": 1,
    "subcategoria": 1,
    "preco": 1,
    "preco_original": 1,
    "desconto_percentual": 1,
    "moeda": 1,
    "atributos_dinamicos": 1,
    "estoque": 1,
    "em_stock": 1,
    "avaliacao": 1,
    "vendas": 1,
    "imagens": 1,
    "imagem_principal": 1,
    "tags": 1,
    "info_administrativo": 1,
    "seo": 1,
}


def build_price_filter(min_price: float | None, max_price: float | None) -> dict | None:
    price_filter = {}
    if min_price is not None:
        price_filter["$gte"] = min_price
    if max_price is not None:
        price_filter["$lte"] = max_price
    return price_filter or None


def find_product(collection: Collection, identifier: str) -> dict | None:
    if ObjectId.is_valid(identifier):
        product = collection.find_one({"_id": ObjectId(identifier)}, PRODUCT_PROJECTION)
        if product:
            return product
    return collection.find_one({"sku": identifier}, PRODUCT_PROJECTION)


def faceted_search(
    collection: Collection,
    categoria: str,
    min_price: float | None,
    max_price: float | None,
    marca: str | None,
    em_stock: bool | None,
    rating_min: float | None,
    page: int,
    limit: int,
) -> tuple[list[dict], int]:
    query = {}
    if categoria:
        query["categoria"] = categoria
    if marca:
        query["atributos_dinamicos.marca"] = marca
    if em_stock is not None:
        query["em_stock"] = em_stock
    if rating_min is not None:
        query["avaliacao.rating_medio"] = {"$gte": rating_min}

    price_filter = build_price_filter(min_price, max_price)
    if price_filter:
        query["preco"] = price_filter

    skip = (page - 1) * limit
    cursor = (
        collection.find(query, PRODUCT_PROJECTION)
        .sort("avaliacao.rating_medio", -1)
        .skip(skip)
        .limit(limit)
    )
    return list(cursor), collection.count_documents(query)


def category_sales(collection: Collection) -> list[dict]:
    return list(
        collection.aggregate(
            [
                {
                    "$group": {
                        "_id": "$categoria",
                        "total_produtos": {"$sum": 1},
                        "total_vendido_categoria": {"$sum": "$vendas.total_vendido"},
                        "receita_estimada": {
                            "$sum": {"$multiply": ["$preco", "$vendas.total_vendido"]}
                        },
                        "preco_medio": {"$avg": "$preco"},
                        "rating_medio_categoria": {"$avg": "$avaliacao.rating_medio"},
                    }
                },
                {"$sort": {"total_vendido_categoria": -1}},
                {
                    "$project": {
                        "_id": 0,
                        "categoria": "$_id",
                        "total_produtos": 1,
                        "total_vendido": "$total_vendido_categoria",
                        "receita_estimada": {"$round": ["$receita_estimada", 2]},
                        "preco_medio": {"$round": ["$preco_medio", 2]},
                        "rating_medio": {"$round": ["$rating_medio_categoria", 2]},
                    }
                },
            ]
        )
    )


def full_text_search(collection: Collection, term: str, limit: int) -> list[dict]:
    projection = dict(PRODUCT_PROJECTION)
    projection["score"] = {"$meta": "textScore"}
    return list(
        collection.find(
            {"$text": {"$search": term}, "em_stock": True},
            projection,
        )
        .sort([("score", {"$meta": "textScore"})])
        .limit(limit)
    )


def dynamic_attributes_search(
    collection: Collection,
    marca: str,
    ram_options: list[str],
    storage_options: list[str],
    rating_min: float,
    limit: int,
) -> list[dict]:
    return list(
        collection.find(
            {
                "categoria": "Eletrônicos",
                "subcategoria": "Smartphones",
                "atributos_dinamicos.marca": marca,
                "atributos_dinamicos.ram": {"$in": ram_options},
                "atributos_dinamicos.armazenamento": {"$in": storage_options},
                "avaliacao.rating_medio": {"$gte": rating_min},
                "em_stock": True,
            },
            PRODUCT_PROJECTION,
        )
        .sort("preco", 1)
        .limit(limit)
    )


def profitability(collection: Collection) -> list[dict]:
    return list(
        collection.aggregate(
            [
                {"$match": {"info_administrativo.ativo": True}},
                {
                    "$group": {
                        "_id": "$categoria",
                        "total_produtos_ativos": {"$sum": 1},
                        "produtos_estoque_zero": {
                            "$sum": {"$cond": [{"$eq": ["$estoque", 0]}, 1, 0]}
                        },
                        "produtos_baixo_rating": {
                            "$sum": {
                                "$cond": [{"$lt": ["$avaliacao.rating_medio", 3.5]}, 1, 0]
                            }
                        },
                        "receita_potencial": {"$sum": {"$multiply": ["$preco", "$estoque"]}},
                        "custo_total": {
                            "$sum": {
                                "$multiply": [
                                    "$info_administrativo.custo_unitario",
                                    "$estoque",
                                ]
                            }
                        },
                        "margem_lucro_media": {
                            "$avg": "$info_administrativo.margem_lucro_percentual"
                        },
                        "valor_estoque_total": {
                            "$sum": {"$multiply": ["$preco", "$estoque"]}
                        },
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "categoria": "$_id",
                        "total_produtos": "$total_produtos_ativos",
                        "produtos_sem_stock": "$produtos_estoque_zero",
                        "produtos_baixo_rating": "$produtos_baixo_rating",
                        "receita_potencial": {"$round": ["$receita_potencial", 2]},
                        "custo_total": {"$round": ["$custo_total", 2]},
                        "lucro_estimado": {
                            "$round": [
                                {"$subtract": ["$receita_potencial", "$custo_total"]},
                                2,
                            ]
                        },
                        "margem_media": {"$round": ["$margem_lucro_media", 2]},
                        "valor_estoque": {"$round": ["$valor_estoque_total", 2]},
                    }
                },
                {"$sort": {"lucro_estimado": -1}},
            ]
        )
    )


def similar_products(collection: Collection, reference_product: dict, limit: int) -> list[dict]:
    margem_preco = reference_product["preco"] * 0.2
    return list(
        collection.find(
            {
                "_id": {"$ne": reference_product["_id"]},
                "categoria": reference_product["categoria"],
                "preco": {
                    "$gte": reference_product["preco"] - margem_preco,
                    "$lte": reference_product["preco"] + margem_preco,
                },
                "em_stock": True,
            },
            PRODUCT_PROJECTION,
        )
        .sort("avaliacao.rating_medio", -1)
        .limit(limit)
    )
