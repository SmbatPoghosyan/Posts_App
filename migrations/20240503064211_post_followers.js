/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("post_followers", (table) => {
    table.increments("id");
    table
      .integer("post_id")
      .unsigned()
      .references("posts.id")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .unsigned()
      .references("users.id")
      .onDelete("CASCADE");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("post_followers");
};
