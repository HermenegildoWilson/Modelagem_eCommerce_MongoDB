#!/usr/bin/env python3
"""
SCRIPT DE SEEDING: Geração de 100.000+ Produtos Realistas
Trabalho Prático de SGBD II - Catálogo de Produtos NoSQL

Autor: Bengui Bena Pedro
Data: Maio de 2026

Uso:
    python seed_data.py --db ecommerce --count 100000
"""

import sys
import argparse
import os
import random
import time
from datetime import datetime, timedelta
from typing import Dict, List, Any
from urllib.parse import urlsplit, urlunsplit

from pymongo import MongoClient
from pymongo.errors import BulkWriteError, PyMongoError

# ============================================================================
# CONFIGURAÇÃO DE DADOS
# ============================================================================

DEFAULT_MONGO_URI = (
    "mongodb+srv://hermenegildowilson7:mortadela06@cluster0.cyhnmsp.mongodb.net/"
    "?appName=Cluster0"
)
DEFAULT_DATABASE = "ecommerce"
DEFAULT_COLLECTION = "produtos"
DEFAULT_BATCH_SIZE = 1000

CATEGORIAS = {
    "Eletrônicos": {
        "subcategorias": ["Smartphones", "Laptops", "Tablets", "Acessórios", "Smartwatches"],
        "atributos": {
            "Smartphones": {
                "marca": ["Samsung", "Apple", "Xiaomi", "Huawei", "OnePlus", "Motorola"],
                "sistema_operativo": ["Android 13", "Android 14", "iOS 17", "iOS 18"],
                "ram": ["4GB", "6GB", "8GB", "12GB", "16GB"],
                "armazenamento": ["64GB", "128GB", "256GB", "512GB"],
                "tela_tamanho": ["6.0", "6.1", "6.3", "6.5", "6.7"],
                "bateria": ["3500 mAh", "4000 mAh", "4500 mAh", "5000 mAh", "5500 mAh"],
                "camera_principal": ["48MP", "50MP", "64MP", "108MP", "200MP"]
            },
            "Laptops": {
                "marca": ["Dell", "HP", "Lenovo", "Apple", "ASUS"],
                "processador": ["Intel i5", "Intel i7", "Intel i9", "AMD Ryzen 5", "AMD Ryzen 7", "Apple M1", "Apple M2"],
                "ram": ["8GB", "16GB", "32GB", "64GB"],
                "armazenamento": ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"],
                "tela_tamanho": ["13 polegadas", "14 polegadas", "15 polegadas", "17 polegadas"],
                "placa_grafica": ["Intel Iris", "NVIDIA RTX 3050", "NVIDIA RTX 4060", "AMD Radeon", "Integrated"]
            },
            "Tablets": {
                "marca": ["Apple", "Samsung", "Lenovo", "Huawei", "iPad"],
                "sistema_operativo": ["iOS", "Android"],
                "tela_tamanho": ["8 polegadas", "10 polegadas", "12 polegadas"],
                "armazenamento": ["64GB", "128GB", "256GB"]
            }
        }
    },
    "Vestuário": {
        "subcategorias": ["Camisetas", "Calças", "Vestidos", "Jaquetas", "Sapatos"],
        "atributos": {
            "Camisetas": {
                "marca": ["Nike", "Adidas", "Puma", "Zara", "H&M", "Tommy Hilfiger", "Calvin Klein"],
                "tamanho": ["XS", "S", "M", "L", "XL", "XXL"],
                "cor": ["Preto", "Branco", "Azul", "Vermelho", "Verde", "Cinza", "Amarelo"],
                "material": ["100% Algodão", "70% Algodão 30% Poliéster", "100% Poliéster", "Lã"],
                "genero": ["Masculino", "Feminino", "Unissexo"],
                "estacao": ["Primavera", "Verão", "Outono", "Inverno", "Meia-estação"]
            },
            "Calças": {
                "marca": ["Levi's", "Wrangler", "Gap", "Zara", "H&M"],
                "tamanho": ["30", "32", "34", "36", "38", "40", "42"],
                "cor": ["Azul Escuro", "Azul Claro", "Preto", "Cinza", "Bege"],
                "tipo": ["Jeans", "Chino", "Cargo", "Formal"],
                "genero": ["Masculino", "Feminino"]
            },
            "Sapatos": {
                "marca": ["Nike", "Adidas", "Puma", "Converse", "Vans", "Timberland"],
                "tamanho": ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
                "tipo": ["Tênis", "Sapato Social", "Bota", "Chinelo", "Mocassim"],
                "cor": ["Preto", "Branco", "Marrom", "Cinza", "Vermelho"]
            }
        }
    },
    "Livros": {
        "subcategorias": ["Ficção", "Não-Ficção", "Literatura Clássica", "Técnico", "Infantil"],
        "atributos": {
            "Ficção": {
                "autor": ["José Saramago", "Gonçalo M. Tavares", "Lobo Antunes", "Lídia Jorge", "Pepetela"],
                "editora": ["Companhia das Letras", "Record", "Intrínseca", "Rocco", "Sextante"],
                "genero": ["Romance", "Mistério", "Ficção Científica", "Fantasia", "Thriller"],
                "ano_publicacao": list(range(2010, 2026)),
                "idioma": ["Português", "Inglês", "Espanhol", "Francês"]
            },
            "Técnico": {
                "autor": ["Guido van Rossum", "Bjarne Stroustrup", "Donald Knuth", "Robert Martin"],
                "editora": ["O'Reilly", "Pragmatic", "Addison-Wesley", "Pearson"],
                "tema": ["Python", "C++", "JavaScript", "Database", "DevOps", "Machine Learning"],
                "ano_publicacao": list(range(2015, 2026))
            }
        }
    },
    "Casa e Cozinha": {
        "subcategorias": ["Utensílios de Cozinha", "Decoração", "Móveis", "Eletroportáteis"],
        "atributos": {
            "Utensílios de Cozinha": {
                "marca": ["Tramontina", "Brinox", "Noritake", "Pyrex"],
                "material": ["Aço Inoxidável", "Cerâmica", "Vidro", "Silicone"],
                "quantidade": ["1 peça", "2 peças", "4 peças", "6 peças", "12 peças"]
            },
            "Móveis": {
                "marca": ["Madesa", "MRV", "Politorno"],
                "tipo": ["Mesa", "Cadeira", "Sofá", "Estante", "Cama"],
                "cor": ["Madeira Clara", "Madeira Escura", "Branco", "Cinza"]
            }
        }
    },
    "Desportos": {
        "subcategorias": ["Equipamento Desportivo", "Vestuário Desportivo", "Acessórios"],
        "atributos": {
            "Equipamento Desportivo": {
                "marca": ["Nike", "Adidas", "Puma", "Decathlon"],
                "tipo": ["Bola", "Raquete", "Mochila", "Garrafa Térmica", "Capacete"],
                "modalidade": ["Futebol", "Ténis", "Natação", "Ciclismo", "Corrida"]
            },
            "Vestuário Desportivo": {
                "marca": ["Nike", "Adidas", "Puma", "Umbro"],
                "tipo": ["Calções", "Camisola", "Meia", "Bandana"],
                "tamanho": ["XS", "S", "M", "L", "XL"]
            }
        }
    }
}

# ============================================================================
# FUNÇÕES DE GERAÇÃO DE DADOS
# ============================================================================

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
                "5_estrelas": 0, "4_estrelas": 0, "3_estrelas": 0,
                "2_estrelas": 0, "1_estrela": 0
            }
        }
    
    # Curva de avaliações realista (mais 5 estrelas, menos 1 estrela)
    dist_5 = int(total_avaliacoes * 0.50)
    dist_4 = int(total_avaliacoes * 0.30)
    dist_3 = int(total_avaliacoes * 0.12)
    dist_2 = int(total_avaliacoes * 0.05)
    dist_1 = total_avaliacoes - dist_5 - dist_4 - dist_3 - dist_2
    
    rating_medio = round(
        (5*dist_5 + 4*dist_4 + 3*dist_3 + 2*dist_2 + 1*dist_1) / total_avaliacoes,
        2
    )
    
    return {
        "rating_medio": rating_medio,
        "total_avaliacoes": total_avaliacoes,
        "distribuicao": {
            "5_estrelas": dist_5,
            "4_estrelas": dist_4,
            "3_estrelas": dist_3,
            "2_estrelas": dist_2,
            "1_estrela": dist_1
        }
    }


def gerar_vendas() -> Dict[str, int]:
    """Gera estatísticas de venda realistas."""
    total_vendido = random.randint(0, 1000)
    vendas_este_mes = random.randint(0, min(100, total_vendido // 12))
    vendas_esta_semana = random.randint(0, min(20, vendas_este_mes // 4))
    
    return {
        "total_vendido": total_vendido,
        "vendas_este_mes": vendas_este_mes,
        "vendas_esta_semana": vendas_esta_semana
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
    
    # Gerar nome baseado em atributos
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
    
    # Data de criação aleatória (últimos 2 anos)
    dias_atras = random.randint(0, 730)
    data_criacao = datetime.now() - timedelta(days=dias_atras)
    data_atualizacao = data_criacao + timedelta(
        hours=random.randint(0, dias_atras * 24)
    )
    
    produto = {
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
            {"cidade": "Huambo", "quantidade": random.randint(0, estoque // 4)}
        ],
        
        "imagens": [
            {
                "url": f"https://cdn.ecommerce.ao/produtos/{sku}.jpg",
                "tipo": "principal",
                "ordem": 1
            }
        ],
        
        "avaliacao": gerar_avaliacao(),
        "vendas": gerar_vendas(),
        
        "tags": [
            categoria.lower(),
            subcategoria.lower(),
            *[v.lower() for v in atributos.values() if isinstance(v, str)]
        ][:10],
        
        "info_administrativo": {
            "fornecedor_id": f"SUPPLIER-{categoria.upper()}-{random.randint(1, 50):03d}",
            "custo_unitario": custo_unitario,
            "margem_lucro_percentual": margem_lucro,
            "data_criacao": data_criacao,
            "data_atualizacao": data_atualizacao,
            "ativo": random.random() > 0.05,  # 95% ativos
            "motivo_desativacao": None,
            "data_desativacao": None
        },
        
        "seo": {
            "titulo": f"{nome} | Loja Online",
            "descricao_meta": f"Compre {nome} online. Melhor preço em Angola. Frete grátis.",
            "url_amigavel": sku.lower().replace("_", "-")
        }
    }
    
    return produto


# ============================================================================
# FUNÇÃO PRINCIPAL DE SEEDING
# ============================================================================

def mascarar_uri(uri: str) -> str:
    """Oculta credenciais da URI antes de imprimir no terminal."""
    parts = urlsplit(uri)
    if "@" not in parts.netloc:
        return uri

    _, host = parts.netloc.rsplit("@", 1)
    return urlunsplit((parts.scheme, f"***:***@{host}", parts.path, parts.query, parts.fragment))


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


def seed_database(
    count: int,
    uri: str,
    database_name: str,
    collection_name: str,
    batch_size: int,
) -> None:
    """Popula a base de dados com produtos."""

    if count <= 0:
        print("❌ ERRO: --count deve ser maior que zero")
        sys.exit(1)
    if batch_size <= 0:
        print("❌ ERRO: --batch-size deve ser maior que zero")
        sys.exit(1)

    uri_segura = mascarar_uri(uri)
    print(f"\n{'='*70}")
    print(f"SEEDING MongoDB: {uri_segura} - {count} produtos")
    print(f"{'='*70}\n")
    
    # Conectar ao MongoDB
    client = None
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        db = client[database_name]
        collection = db[collection_name]
        
        # Testar conexão
        client.admin.command('ping')
        print(f"✅ Conectado a MongoDB em {uri_segura}")
        print(f"📦 Base de dados: {database_name} | Coleção: {collection_name}")
    except PyMongoError as e:
        print(f"❌ ERRO: Não foi possível conectar a MongoDB em {uri_segura}")
        print(f"❌ ERRO: {e}")
        sys.exit(1)
    
    # Limpar coleção (opcional)
    resposta = input(f"\nDeseja limpar a coleção '{collection_name}' existente? (S/N): ").strip().upper()
    if resposta == "S":
        collection.drop()
        print(f"✅ Coleção '{collection_name}' eliminada")

    try:
        produto_index_inicial = collection.estimated_document_count()
    except PyMongoError as e:
        print(f"❌ ERRO: Não foi possível contar documentos existentes: {e}")
        sys.exit(1)
    
    print("\n📝 Gerando e inserindo produtos...\n")
    
    start_time = time.time()
    produtos_por_categoria = {}
    produto_index = produto_index_inicial
    
    # Distribuir produtos por categoria
    categorias_list = list(CATEGORIAS.keys())
    produtos_por_cat = count // len(categorias_list)
    
    for categoria in categorias_list:
        produtos_por_categoria[categoria] = produtos_por_cat
    
    # Distribuir restante
    for i in range(count % len(categorias_list)):
        produtos_por_categoria[categorias_list[i]] += 1
    
    # Gerar e inserir produtos
    total_inserido = 0
    produtos_batch = []
    for categoria in categorias_list:
        subcategorias = CATEGORIAS[categoria]["subcategorias"]
        num_produtos = produtos_por_categoria[categoria]
        produtos_por_subcat = num_produtos // len(subcategorias)
        
        for subcat_idx, subcategoria in enumerate(subcategorias):
            num_nesta_subcat = produtos_por_subcat
            # Adicionar restante à última subcategoria
            if subcat_idx == len(subcategorias) - 1:
                num_nesta_subcat += num_produtos % len(subcategorias)
            
            for i in range(num_nesta_subcat):
                produto = gerar_produto(categoria, subcategoria, produto_index)
                produtos_batch.append(produto)
                produto_index += 1
                
                # Inserir em batch
                if len(produtos_batch) >= batch_size:
                    total_inserido += inserir_batch(collection, produtos_batch)
                    print(f"  ✅ Progresso: {total_inserido}/{count} produtos inseridos")
                    produtos_batch = []
    
    # Inserir restante
    if produtos_batch:
        total_inserido += inserir_batch(collection, produtos_batch)
        print(f"  ✅ Batch final: {total_inserido}/{count} produtos inseridos")
    
    elapsed = time.time() - start_time
    
    # Estatísticas
    print(f"\n{'='*70}")
    print(f"📊 ESTATÍSTICAS DE SEEDING")
    print(f"{'='*70}")
    print(f"Produtos inseridos: {total_inserido}")
    print(f"Tempo total: {elapsed:.2f} segundos")
    velocidade = total_inserido / elapsed if elapsed > 0 else 0
    print(f"Velocidade: {velocidade:.0f} docs/segundo")
    print(f"\nDistribuição por categoria:")
    
    for categoria in categorias_list:
        count_cat = collection.count_documents({"categoria": categoria})
        print(f"  {categoria}: {count_cat} produtos")
    
    # Criar índices
    print(f"\n{'='*70}")
    print(f"🔍 CRIANDO ÍNDICES")
    print(f"{'='*70}\n")
    
    indices = [
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
    
    for idx_spec, idx_options in indices:
        try:
            idx_name = collection.create_index(idx_spec, **idx_options)
            print(f"  ✅ Índice criado: {idx_name}")
        except Exception as e:
            print(f"  ⚠️ Erro ao criar índice {idx_spec}: {e}")
    
    print(f"\n{'='*70}")
    print(f"✅ SEEDING CONCLUÍDO COM SUCESSO!")
    print(f"{'='*70}\n")
    
    if client:
        client.close()


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
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
    parser.add_argument("--batch-size", type=int, default=DEFAULT_BATCH_SIZE, help="Tamanho dos lotes de inserção")
    
    args = parser.parse_args()
    
    seed_database(args.count, args.uri, args.db, args.collection, args.batch_size)
