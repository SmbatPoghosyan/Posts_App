/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('users').insert([
    {role_id: 3, username: 'admin', email: 'admin@mail.com', password: 'admin'},
  ]);
};