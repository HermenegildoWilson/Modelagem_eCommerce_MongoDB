"""Views HTTP que expõem as queries avançadas como API REST."""

from time import perf_counter

from pymongo.errors import PyMongoError
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from apps.catalog import services
from apps.catalog.mongo import get_client, get_collection
from apps.catalog.query_params import get_bool, get_csv, get_float, get_int
from apps.catalog.serializers import serialize_document, serialize_documents, to_jsonable


def with_timing(callback):
    started_at = perf_counter()
    result = callback()
    elapsed_ms = round((perf_counter() - started_at) * 1000, 2)
    return result, elapsed_ms


def mongo_error_response(error: PyMongoError) -> Response:
    return Response(
        {
            "erro": "Falha ao consultar MongoDB",
            "detalhes": str(error),
        },
        status=status.HTTP_503_SERVICE_UNAVAILABLE,
    )


@api_view(["GET"])
def api_root(request):
    return Response(
        {
            "nome": "API Catálogo de Produtos MongoDB",
            "conceitos": [
                "Query-Driven Design",
                "atributos dinâmicos",
                "busca facetada",
                "agregações analíticas",
                "recomendação por similaridade",
            ],
            "endpoints": {
                "health": "/api/health/",
                "detalhe_produto": "/api/products/{sku-ou-objectid}/",
                "query_1_busca_facetada": "/api/products/faceted/",
                "facetas_produtos": "/api/products/facets/",
                "query_2_vendas_categoria": "/api/analytics/category-sales/",
                "query_3_full_text": "/api/search/?q=samsung smartphone android",
                "query_4_atributos_dinamicos": "/api/products/dynamic-attributes/",
                "query_5_rentabilidade": "/api/analytics/profitability/",
                "query_6_similares": "/api/products/{sku-ou-objectid}/similar/",
            },
        }
    )


@api_view(["GET"])
def health_check(request):
    try:
        get_client().admin.command("ping")
        total = get_collection().estimated_document_count()
    except PyMongoError as e:
        return mongo_error_response(e)

    return Response({"status": "ok", "mongodb": "connected", "total_produtos": total})


@api_view(["GET"])
def product_detail(request, identifier: str):
    try:
        product = services.find_product(get_collection(), identifier)
    except PyMongoError as e:
        return mongo_error_response(e)

    if not product:
        return Response({"erro": "Produto não encontrado"}, status=status.HTTP_404_NOT_FOUND)

    return Response(serialize_document(product))


@api_view(["GET"])
def faceted_search(request):
    params = request.query_params
    limit = get_int(params, "limit", 20, minimum=1, maximum=100)
    page = get_int(params, "page", 1, minimum=1)

    try:
        (documents, total), elapsed_ms = with_timing(
            lambda: services.faceted_search(
                get_collection(),
                categoria=params.get("categoria", "Eletrônicos"),
                min_price=get_float(params, "preco_min", 10000),
                max_price=get_float(params, "preco_max", 50000),
                marca=params.get("marca") or None,
                em_stock=get_bool(params, "em_stock", True),
                rating_min=get_float(params, "rating_min"),
                page=page,
                limit=limit,
            )
        )
    except PyMongoError as e:
        return mongo_error_response(e)

    return Response(
        {
            "query": "Busca facetada com múltiplos filtros",
            "conceito": "Query-Driven Design com compound index e paginação",
            "tempo_ms": elapsed_ms,
            "page": page,
            "limit": limit,
            "total": total,
            "results": serialize_documents(documents),
        }
    )


@api_view(["GET"])
def product_facets(request):
    try:
        documents, elapsed_ms = with_timing(lambda: services.product_facets(get_collection()))
    except PyMongoError as e:
        return mongo_error_response(e)

    return Response(
        {
            "query": "Facetas disponíveis para filtros do catálogo",
            "conceito": "Agregação por categoria e marca para filtros dependentes",
            "tempo_ms": elapsed_ms,
            "results": to_jsonable(documents),
        }
    )


@api_view(["GET"])
def category_sales(request):
    try:
        documents, elapsed_ms = with_timing(lambda: services.category_sales(get_collection()))
    except PyMongoError as e:
        return mongo_error_response(e)

    return Response(
        {
            "query": "Agregação de vendas por categoria",
            "conceito": "$group, $sort e métricas de receita estimada",
            "tempo_ms": elapsed_ms,
            "results": to_jsonable(documents),
        }
    )


@api_view(["GET"])
def full_text_search(request):
    term = request.query_params.get("q", "samsung smartphone android").strip()
    limit = get_int(request.query_params, "limit", 15, minimum=1, maximum=50)
    if not term:
        return Response({"erro": "Parâmetro q é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        documents, elapsed_ms = with_timing(
            lambda: services.full_text_search(get_collection(), term, limit)
        )
    except PyMongoError as e:
        return mongo_error_response(e)

    return Response(
        {
            "query": "Busca full-text com relevância",
            "conceito": "Text index e score por relevância",
            "termo": term,
            "tempo_ms": elapsed_ms,
            "total": len(documents),
            "results": serialize_documents(documents),
        }
    )


@api_view(["GET"])
def dynamic_attributes_search(request):
    params = request.query_params
    limit = get_int(params, "limit", 10, minimum=1, maximum=50)

    try:
        documents, elapsed_ms = with_timing(
            lambda: services.dynamic_attributes_search(
                get_collection(),
                marca=params.get("marca", "Samsung"),
                ram_options=get_csv(params, "ram", ["8GB", "12GB", "16GB"]),
                storage_options=get_csv(params, "armazenamento", ["128GB", "256GB", "512GB"]),
                rating_min=get_float(params, "rating_min", 4.0),
                limit=limit,
            )
        )
    except PyMongoError as e:
        return mongo_error_response(e)

    return Response(
        {
            "query": "Busca com atributos dinâmicos",
            "conceito": "Subdocumentos aninhados e filtros específicos por categoria",
            "tempo_ms": elapsed_ms,
            "total": len(documents),
            "results": serialize_documents(documents),
        }
    )


@api_view(["GET"])
def profitability(request):
    try:
        documents, elapsed_ms = with_timing(lambda: services.profitability(get_collection()))
    except PyMongoError as e:
        return mongo_error_response(e)

    total_receita = sum(item.get("receita_potencial", 0) for item in documents)
    total_custo = sum(item.get("custo_total", 0) for item in documents)
    lucro_total = total_receita - total_custo
    margem_global = round((lucro_total / total_receita) * 100, 2) if total_receita else 0

    return Response(
        {
            "query": "Análise avançada de margens e rentabilidade",
            "conceito": "$match, $group, $cond, $multiply e indicadores BI",
            "tempo_ms": elapsed_ms,
            "totais": {
                "receita_potencial_total": round(total_receita, 2),
                "custo_total": round(total_custo, 2),
                "lucro_total_estimado": round(lucro_total, 2),
                "margem_global": margem_global,
            },
            "results": to_jsonable(documents),
        }
    )


@api_view(["GET"])
def similar_products(request, identifier: str):
    limit = get_int(request.query_params, "limit", 5, minimum=1, maximum=30)

    try:
        collection = get_collection()
        reference = services.find_product(collection, identifier)
        if not reference:
            return Response({"erro": "Produto de referência não encontrado"}, status=status.HTTP_404_NOT_FOUND)

        documents, elapsed_ms = with_timing(
            lambda: services.similar_products(collection, reference, limit)
        )
    except PyMongoError as e:
        return mongo_error_response(e)

    return Response(
        {
            "query": "Produtos similares",
            "conceito": "Mesma categoria, preço ±20% e ordenação por rating",
            "tempo_ms": elapsed_ms,
            "produto_referencia": serialize_document(reference),
            "total": len(documents),
            "results": serialize_documents(documents),
        }
    )
