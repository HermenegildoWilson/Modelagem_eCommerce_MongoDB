"""Dados base usados para gerar produtos realistas."""

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
                "camera_principal": ["48MP", "50MP", "64MP", "108MP", "200MP"],
            },
            "Laptops": {
                "marca": ["Dell", "HP", "Lenovo", "Apple", "ASUS"],
                "processador": ["Intel i5", "Intel i7", "Intel i9", "AMD Ryzen 5", "AMD Ryzen 7", "Apple M1", "Apple M2"],
                "ram": ["8GB", "16GB", "32GB", "64GB"],
                "armazenamento": ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"],
                "tela_tamanho": ["13 polegadas", "14 polegadas", "15 polegadas", "17 polegadas"],
                "placa_grafica": ["Intel Iris", "NVIDIA RTX 3050", "NVIDIA RTX 4060", "AMD Radeon", "Integrated"],
            },
            "Tablets": {
                "marca": ["Apple", "Samsung", "Lenovo", "Huawei", "iPad"],
                "sistema_operativo": ["iOS", "Android"],
                "tela_tamanho": ["8 polegadas", "10 polegadas", "12 polegadas"],
                "armazenamento": ["64GB", "128GB", "256GB"],
            },
        },
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
                "estacao": ["Primavera", "Verão", "Outono", "Inverno", "Meia-estação"],
            },
            "Calças": {
                "marca": ["Levi's", "Wrangler", "Gap", "Zara", "H&M"],
                "tamanho": ["30", "32", "34", "36", "38", "40", "42"],
                "cor": ["Azul Escuro", "Azul Claro", "Preto", "Cinza", "Bege"],
                "tipo": ["Jeans", "Chino", "Cargo", "Formal"],
                "genero": ["Masculino", "Feminino"],
            },
            "Sapatos": {
                "marca": ["Nike", "Adidas", "Puma", "Converse", "Vans", "Timberland"],
                "tamanho": ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
                "tipo": ["Tênis", "Sapato Social", "Bota", "Chinelo", "Mocassim"],
                "cor": ["Preto", "Branco", "Marrom", "Cinza", "Vermelho"],
            },
        },
    },
    "Livros": {
        "subcategorias": ["Ficção", "Não-Ficção", "Literatura Clássica", "Técnico", "Infantil"],
        "atributos": {
            "Ficção": {
                "autor": ["José Saramago", "Gonçalo M. Tavares", "Lobo Antunes", "Lídia Jorge", "Pepetela"],
                "editora": ["Companhia das Letras", "Record", "Intrínseca", "Rocco", "Sextante"],
                "genero": ["Romance", "Mistério", "Ficção Científica", "Fantasia", "Thriller"],
                "ano_publicacao": list(range(2010, 2026)),
                "idioma": ["Português", "Inglês", "Espanhol", "Francês"],
            },
            "Técnico": {
                "autor": ["Guido van Rossum", "Bjarne Stroustrup", "Donald Knuth", "Robert Martin"],
                "editora": ["O'Reilly", "Pragmatic", "Addison-Wesley", "Pearson"],
                "tema": ["Python", "C++", "JavaScript", "Database", "DevOps", "Machine Learning"],
                "ano_publicacao": list(range(2015, 2026)),
            },
        },
    },
    "Casa e Cozinha": {
        "subcategorias": ["Utensílios de Cozinha", "Decoração", "Móveis", "Eletroportáteis"],
        "atributos": {
            "Utensílios de Cozinha": {
                "marca": ["Tramontina", "Brinox", "Noritake", "Pyrex"],
                "material": ["Aço Inoxidável", "Cerâmica", "Vidro", "Silicone"],
                "quantidade": ["1 peça", "2 peças", "4 peças", "6 peças", "12 peças"],
            },
            "Móveis": {
                "marca": ["Madesa", "MRV", "Politorno"],
                "tipo": ["Mesa", "Cadeira", "Sofá", "Estante", "Cama"],
                "cor": ["Madeira Clara", "Madeira Escura", "Branco", "Cinza"],
            },
        },
    },
    "Desportos": {
        "subcategorias": ["Equipamento Desportivo", "Vestuário Desportivo", "Acessórios"],
        "atributos": {
            "Equipamento Desportivo": {
                "marca": ["Nike", "Adidas", "Puma", "Decathlon"],
                "tipo": ["Bola", "Raquete", "Mochila", "Garrafa Térmica", "Capacete"],
                "modalidade": ["Futebol", "Ténis", "Natação", "Ciclismo", "Corrida"],
            },
            "Vestuário Desportivo": {
                "marca": ["Nike", "Adidas", "Puma", "Umbro"],
                "tipo": ["Calções", "Camisola", "Meia", "Bandana"],
                "tamanho": ["XS", "S", "M", "L", "XL"],
            },
        },
    },
}

