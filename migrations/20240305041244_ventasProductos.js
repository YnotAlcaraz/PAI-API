/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('VentasProductos', (table) => {
    table.increments('id').primary();
    table.integer('cantidad').notNullable();
    table.integer('ventaId').unsigned();
    table.integer('productoId').unsigned();
    
    table.foreign('ventaId').references('Ventas.id');
    table.foreign('productoId').references('Productos.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('VentasProductos');
};
