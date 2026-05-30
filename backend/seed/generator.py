"""Funções responsáveis por gerar documentos de produto."""

import random
from datetime import datetime, timedelta
from typing import Any, Dict

from eCommerce.backend.seed.categories import CATEGORIAS


def gerar_sku(categoria: str, subcategoria: str, index: int) -> str:
    """Gera SKU único baseado em categoria e índice."""
    cat_abbr = categoria[:3].upper()
    subcat_abbr = subcategoria[:4].upper()
    return f"{cat_abbr}-{subcat_abbr}-{index:06d}"


def gerar_preco_com_desconto() -> tuple:
    """Gera preço original e desconto realista."""
    preco_original = round(random.choice(range(1000, 100000, 500)), 2)
    desconto_percentual = random.choice([0, 5, 10, 12.5, 15, 20, 25, 30])
    preco_final = round(preco_original * (1 - desconto_percentual / 100), 2)
    return preco_final, preco_original, desconto_percentual


def gerar_atributos_dinamicos(categoria: str, subcategoria: str) -> Dict[str, Any]:
    """Gera atributos dinâmicos específicos da categoria."""
    attrs = {}

    if categoria in CATEGORIAS and subcategoria in CATEGORIAS[categoria]["atributos"]:
        atributos_config = CATEGORIAS[categoria]["atributos"][subcategoria]

        for attr_name, valores in atributos_config.items():
            if isinstance(valores, list) and len(valores) > 0:
                attrs[attr_name] = random.choice(valores)

    return attrs


def gerar_avaliacao() -> Dict[str, Any]:
    """Gera dados realistas de avaliação."""
    total_avaliacoes = random.randint(0, 500)

    if total_avaliacoes == 0:
        return {
            "rating_medio": 0,
            "total_avaliacoes": 0,
            "distribuicao": {
                "5_estrelas": 0,
                "4_estrelas": 0,
                "3_estrelas": 0,
                "2_estrelas": 0,
                "1_estrela": 0,
            },
        }

    dist_5 = int(total_avaliacoes * 0.50)
    dist_4 = int(total_avaliacoes * 0.30)
    dist_3 = int(total_avaliacoes * 0.12)
    dist_2 = int(total_avaliacoes * 0.05)
    dist_1 = total_avaliacoes - dist_5 - dist_4 - dist_3 - dist_2

    rating_medio = round(
        (5 * dist_5 + 4 * dist_4 + 3 * dist_3 + 2 * dist_2 + dist_1) / total_avaliacoes,
        2,
    )

    return {
        "rating_medio": rating_medio,
        "total_avaliacoes": total_avaliacoes,
        "distribuicao": {
            "5_estrelas": dist_5,
            "4_estrelas": dist_4,
            "3_estrelas": dist_3,
            "2_estrelas": dist_2,
            "1_estrela": dist_1,
        },
    }


def gerar_vendas() -> Dict[str, int]:
    """Gera estatísticas de venda realistas."""
    total_vendido = random.randint(0, 1000)
    vendas_este_mes = random.randint(0, min(100, total_vendido // 12))
    vendas_esta_semana = random.randint(0, min(20, vendas_este_mes // 4))

    return {
        "total_vendido": total_vendido,
        "vendas_este_mes": vendas_este_mes,
        "vendas_esta_semana": vendas_esta_semana,
    }


def gerar_estoque() -> tuple:
    """Gera quantidade em stock."""
    quantidade = random.randint(0, 500)
    em_stock = quantidade > 0
    return quantidade, em_stock


def gerar_produto(categoria: str, subcategoria: str, index: int) -> Dict[str, Any]:
    """Gera um documento de produto completo."""
    sku = gerar_sku(categoria, subcategoria, index)
    preco, preco_original, desconto = gerar_preco_com_desconto()
    custo_unitario = round(preco * random.uniform(0.3, 0.6), 2)
    margem_lucro = round(((preco - custo_unitario) / preco) * 100, 2)
    estoque, em_stock = gerar_estoque()
    atributos = gerar_atributos_dinamicos(categoria, subcategoria)

    nome_partes = [categoria.title()]
    if "marca" in atributos:
        nome_partes.append(atributos["marca"])
    if "modelo" in atributos:
        nome_partes.append(atributos["modelo"])
    if "tamanho" in atributos:
        nome_partes.append(f"Tamanho {atributos['tamanho']}")
    if "cor" in atributos:
        nome_partes.append(atributos["cor"])

    nome = " - ".join(nome_partes[:3]) if len(nome_partes) > 1 else f"{categoria} #{index}"

    dias_atras = random.randint(0, 730)
    data_criacao = datetime.now() - timedelta(days=dias_atras)
    data_atualizacao = data_criacao + timedelta(hours=random.randint(0, dias_atras * 24))

    return {
        "sku": sku,
        "nome": nome[:255],
        "descricao": f"Produto de alta qualidade na categoria {categoria}. Descrição detalhada de características, benefícios e especificações técnicas.",
        "categoria": categoria,
        "subcategoria": subcategoria,
        "preco": preco,
        "preco_original": preco_original,
        "desconto_percentual": desconto,
        "moeda": "AOA",
        "atributos_dinamicos": atributos,
        "estoque": estoque,
        "estoque_minimo": random.randint(3, 20),
        "em_stock": em_stock,
        "localizacoes_armazem": [
            {"cidade": "Luanda", "quantidade": random.randint(0, estoque // 2)},
            {"cidade": "Benguela", "quantidade": random.randint(0, estoque // 4)},
            {"cidade": "Huambo", "quantidade": random.randint(0, estoque // 4)},
        ],
        "imagens": [
            {
                "url": f"https://cdn.ecommerce.ao/produtos/{sku}.jpg",
                "tipo": "principal",
                "ordem": 1,
            }
        ],
        "avaliacao": gerar_avaliacao(),
        "vendas": gerar_vendas(),
        "tags": [
            categoria.lower(),
            subcategoria.lower(),
            *[v.lower() for v in atributos.values() if isinstance(v, str)],
        ][:10],
        "info_administrativo": {
            "fornecedor_id": f"SUPPLIER-{categoria.upper()}-{random.randint(1, 50):03d}",
            "custo_unitario": custo_unitario,
            "margem_lucro_percentual": margem_lucro,
            "data_criacao": data_criacao,
            "data_atualizacao": data_atualizacao,
            "ativo": random.random() > 0.05,
            "motivo_desativacao": None,
            "data_desativacao": None,
        },
        "seo": {
            "titulo": f"{nome} | Loja Online",
            "descricao_meta": f"Compre {nome} online. Melhor preço em Angola. Frete grátis.",
            "url_amigavel": sku.lower().replace("_", "-"),
        },
    }

