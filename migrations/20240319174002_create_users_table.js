/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.integer("role_id").unsigned().notNullable();
    table.foreign("role_id").references("roles.id").onDelete("CASCADE");
    table.string("username").unique().notNullable();
    table.string("email").unique();
    table.string("password").notNullable();
    table.string("verification_code").unique();
    table.boolean("is_active").defaultTo(false).notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
