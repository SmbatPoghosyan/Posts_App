/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("user_profiles", (table) => {
    table.increments("id");
    table
      .integer("user_id")
      .notNullable()
      .unique()
      .unsigned()
      .references("users.id")
      .onDelete("CASCADE");
    table.string("firstname", 100).notNullable();
    table.string("lastname", 100).notNullable();
    table.integer("age").notNullable();
    table.string("gender", 10).notNullable();
    table.text("about_myself");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("user_profiles");
};
