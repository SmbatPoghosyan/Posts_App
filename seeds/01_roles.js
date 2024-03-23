/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('roles').del()
  await knex('roles').insert([
    {role_name: 'user'},
    {role_name: 'creator'},
    {role_name: 'admin'},
    {role_name: 'superadmin'},
  ]);
};