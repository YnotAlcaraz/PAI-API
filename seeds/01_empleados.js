/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('table_name').del()
  await knex('table_name').insert([
    {
      id: 1,
      nombre: 'John',
      apellido_paterno: 'Doe',
      apellido_materno: '',
      curp: 'XXXX010101XXXXXXX0',
      rfc: 'XXXX011010XXXX',
      numero_telefono: '123456789',
      masculino: true,
      fecha_nacimiento: '2000-01-01',
      fecha_inicio: '2024-01-01'
    },
  ]);
};
