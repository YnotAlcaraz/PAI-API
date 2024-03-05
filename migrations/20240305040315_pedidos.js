/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('Pedidos', (table) => {
    table.increments('id').primary();
    table.integer('cantidad').notNullable();
    table.boolean('entregado').notNullable();
    table.integer('productoId').unsigned();
    table.integer('proveedorId').unsigned();
    table.integer('tipoPagoId').unsigned();

    table.foreign('productoId').references('Productos.id');
    table.foreign('proveedorId').references('Proveedores.id');
    table.foreign('tipoPagoId').references('TiposPagos.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Pedidos');
};
