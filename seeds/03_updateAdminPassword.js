/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 */
const bcrypt = require("bcrypt");
exports.seed = async function (knex) {
  let user = await knex.select("password").from("users").first();

  const hashedPassword = await bcrypt.hash(user.password, 10);
  await knex("users")
    .where({ role_id: 3 })
    .update({ password: hashedPassword });
};
