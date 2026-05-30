"""Orquestração do processo de seeding."""

import sys
import time

from pymongo.errors import PyMongoError

from seed.categories import CATEGORIAS
from seed.generator import gerar_produto
from seed.mongo import conectar, criar_indices, inserir_batch, mascarar_uri


def distribuir_por_categoria(count: int) -> dict:
    """Distribui a quantidade total de produtos entre as categorias."""
    categorias = list(CATEGORIAS.keys())
    produtos_por_cat = count // len(categorias)
    distribuicao = {categoria: produtos_por_cat for categoria in categorias}

    for i in range(count % len(categorias)):
        distribuicao[categorias[i]] += 1

    return distribuicao


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

    client = None
    try:
        client, collection = conectar(uri, database_name, collection_name)
        print(f"✅ Conectado a MongoDB em {uri_segura}")
        print(f"📦 Base de dados: {database_name} | Coleção: {collection_name}")
    except PyMongoError as e:
        print(f"❌ ERRO: Não foi possível conectar a MongoDB em {uri_segura}")
        print(f"❌ ERRO: {e}")
        sys.exit(1)

    resposta = input(f"\nDeseja limpar a coleção '{collection_name}' existente? (S/N): ").strip().upper()
    if resposta == "S":
        collection.drop()
        print(f"✅ Coleção '{collection_name}' eliminada")

    try:
        produto_index = collection.estimated_document_count()
    except PyMongoError as e:
        print(f"❌ ERRO: Não foi possível contar documentos existentes: {e}")
        sys.exit(1)

    print("\n📝 Gerando e inserindo produtos...\n")

    start_time = time.time()
    categorias_list = list(CATEGORIAS.keys())
    produtos_por_categoria = distribuir_por_categoria(count)
    total_inserido = 0
    produtos_batch = []

    for categoria in categorias_list:
        subcategorias = CATEGORIAS[categoria]["subcategorias"]
        num_produtos = produtos_por_categoria[categoria]
        produtos_por_subcat = num_produtos // len(subcategorias)

        for subcat_idx, subcategoria in enumerate(subcategorias):
            num_nesta_subcat = produtos_por_subcat
            if subcat_idx == len(subcategorias) - 1:
                num_nesta_subcat += num_produtos % len(subcategorias)

            for _ in range(num_nesta_subcat):
                produtos_batch.append(gerar_produto(categoria, subcategoria, produto_index))
                produto_index += 1

                if len(produtos_batch) >= batch_size:
                    total_inserido += inserir_batch(collection, produtos_batch)
                    print(f"  ✅ Progresso: {total_inserido}/{count} produtos inseridos")
                    produtos_batch = []

    if produtos_batch:
        total_inserido += inserir_batch(collection, produtos_batch)
        print(f"  ✅ Batch final: {total_inserido}/{count} produtos inseridos")

    elapsed = time.time() - start_time
    velocidade = total_inserido / elapsed if elapsed > 0 else 0

    print(f"\n{'='*70}")
    print("📊 ESTATÍSTICAS DE SEEDING")
    print(f"{'='*70}")
    print(f"Produtos inseridos: {total_inserido}")
    print(f"Tempo total: {elapsed:.2f} segundos")
    print(f"Velocidade: {velocidade:.0f} docs/segundo")
    print("\nDistribuição por categoria:")

    for categoria in categorias_list:
        count_cat = collection.count_documents({"categoria": categoria})
        print(f"  {categoria}: {count_cat} produtos")

    criar_indices(collection)

    print(f"\n{'='*70}")
    print("✅ SEEDING CONCLUÍDO COM SUCESSO!")
    print(f"{'='*70}\n")

    if client:
        client.close()
