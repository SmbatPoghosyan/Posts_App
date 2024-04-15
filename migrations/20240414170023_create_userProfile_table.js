/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("userProfile", (table) => {
    table.increments("id");
    table
      .integer("user_id")
      .unique()
      .unsigned()
      .references("users.id")
      .onDelete("CASCADE");
    table.string("firstname").notNullable();
    table.string("lastname").notNullable();
    table.integer("age").notNullable();
    table.string("gender").notNullable();
    table.text("about myself");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("userProfile");
};
