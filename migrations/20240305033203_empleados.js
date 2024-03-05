/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('Empleados', (table) => {
    table.increments('id').primary();
    table.string('nombre').notNullable();
    table.string('apellido_paterno').notNullable();
    table.string('apellido_materno');
    table.string('curp').notNullable();
    table.string('rfc').notNullable();
    table.string('numero_telefono').notNullable();
    table.boolean('masculino').notNullable();
    table.date('fecha_nacimiento').notNullable();
    table.date('fecha_inicio').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Empleados');
};
