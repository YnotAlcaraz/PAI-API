# PAI-API
Restful API para Proyecto-PAI

# Tener instalado Docker Desktop
> docker compose up --build

Crear migraciones
>npx knex migrate:make [nombre de la migracion]

Correr migraciones
>docker-compose app npx knex migrate:latest

Deshacer migraciones
>docker-compose app npx knex migrate:rollback


<!-- # Instalar dependencias

npx knex migrate:make [nombre de la migracion]
docker-compose run app npx knex migrate:latest
docker-compose run app npx knex migrate:rollback
docker-compose run app npx knex migrate:up name_of_migration_file.js

npm i

# Correr el server de manera local
npm run dev -->
