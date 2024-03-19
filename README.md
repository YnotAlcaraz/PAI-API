# PAI-API
Restful API para Proyecto-PAI

# Tener instalado Docker Desktop
> docker compose up --build

Correr migraciones
>docker-compose run app npx knex migrate:latest

En caso de crear nuevas migraciones ejecutar este comando
>npx knex migrate:make [nombre de la migracion]


Deshacer migraciones
>docker-compose run app npx knex migrate:rollback


<!-- # Instalar dependencias
docker-compose run app npx knex seeds:run


npx knex migrate:make [nombre de la migracion]
docker-compose run app npx knex migrate:latest
docker-compose run app npx knex migrate:rollback
docker-compose run app npx knex migrate:up name_of_migration_file.js

TODO: Agregar seeds

npm i

# Correr el server de manera local
npm run dev -->
