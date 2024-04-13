/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 */
const bcrypt = require("bcrypt");
exports.seed = async function (knex) {
  const user = await knex
    .select("password", "id")
    .from("users")
    .where({ username: "admin" })
    .first();
  const hashedPassword = await bcrypt.hash(user.password, 10);
  await knex("users")
    .where({ id: user.id })
    .update({ password: hashedPassword });
};


