/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('posts_images', function(table) {
      table.increments('id').primary();
      table.integer('post_id').unsigned().references('posts.id').onDelete('CASCADE');
      table.integer('image_id').unsigned().references('images.id').onDelete('CASCADE');
    });
  };
  

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('posts_images');
  };


 
  