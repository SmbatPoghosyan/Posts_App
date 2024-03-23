const { Model } = require('objection');
const Knex = require('knex');
const dotenv = require('dotenv');

dotenv.config();

// Initialize knex.
const knex = Knex({
  client: 'postgresql',
  connection: {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  }
});

// Give the knex instance to objection.
Model.knex(knex);

module.exports = knex;