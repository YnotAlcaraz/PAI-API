/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('Ventas', (table) => {
    table.increments('id').primary();
    table.date('fecha').notNullable();
    table.boolean('cancelada').notNullable(false);
    table.integer('empleadoId').unsigned();
    table.integer('tipoPagoId').unsigned();
    
    table.foreign('empleadoId').references('Empleados.id');
    table.foreign('tipoPagoId').references('TiposPagos.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Ventas');
};
