### TPC 5 : JCR Pubs

1. Analisar o dataset: jcrpubs.xml(https://www4.di.uminho.pt/~jcr/datasets/jcrpubs.xml);
2. Usar o Protégé para construir a parte estrutural da ontologia e criar alguns indivíduos para servirem de modelo ao passo seguinte;
3. Criar uma stylesheet XSLT/script em python para povoar a ontologia com os indivíduos do dataset;
4. Carregar a ontologia no Ontobud:
    - criar um repo de nome (PG|A)ddddd-tp5;
    - importar ficheiro gerado em 3).
5. Criar uma API de dados com as funcionalidades de CRUD sobre o modelo criado:
    - GET /pubs
    - GET /pubs?type=(inproceedings|inbook|masterthesis|book|proceedings|...)
    - GET /pubs/{id}
    - GET /authors
    - GET /authors/{id}
    - POST /pubs
    - POST /authors
    - DELETE /pubs/{id}
    - DELETE /authors/{id}
    - PUT /pubs/{id}
    - PUT /authors/{id} (DEELETE -> POST)