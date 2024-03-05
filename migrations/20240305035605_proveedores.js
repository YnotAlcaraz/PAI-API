/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('Proveedores', (table) => {
    table.increments('id').primary();
    table.string('nombre').notNullable();
    table.string('correo_electronico').notNullable();
    table.string('nombre_empresa').notNullable();
    table.string('numero_telefono').notNullable();
    table.string('direccion').notNullable();
    table.string('direccion_facturacion');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Proveedores');
};
