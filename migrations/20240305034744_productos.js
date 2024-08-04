/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('Productos', (table) => {
      table.increments('id').primary();
      table.string('codigo').notNullable();
      table.string('nombre').notNullable();
      table.string('descripcion').notNullable();
      table.binary('imagen');
      table.decimal('precio').notNullable();
      table.integer('stock').defaultTo(0);
      table.integer('categoriaId').unsigned();
      
      table.foreign('categoriaId').references('id').inTable('Categorias').onDelete('CASCADE');
      // table.foreign('categoriaId').references('Categorias.id');
      // table.foreign("user_id").references("user_id").inTable("users").onDelete("CASCADE");
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('Productos');
  };
  