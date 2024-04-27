/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('user_profiles', function(table) {
      table.integer('avatar').unsigned().references('images.id').onDelete('SET NULL');
    });
  };
  

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('user_profiles', function(table) {
      table.dropColumn('avatar');
    });
  };
  


  