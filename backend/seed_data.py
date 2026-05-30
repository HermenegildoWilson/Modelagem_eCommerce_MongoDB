#!/usr/bin/env python3
"""
SCRIPT DE SEEDING: Geração de 100.000+ Produtos Realistas
Trabalho Prático de SGBD II - Catálogo de Produtos NoSQL

Autor: Bengui Bena Pedro
Data: Maio de 2026

Uso:
    python seed_data.py --db ecommerce --count 100000
"""

from eCommerce.backend.seed.cli import main


if __name__ == "__main__":
    main()
