const { Model } = require("objection");
const Role = require("./roleModel");
const Post = require("./postModel");
//const Comment = require("./commentModel");

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "id";
  }

  $formatJson(json) {
    // Remember to call the super class's implementation.
    json = super.$formatJson(json);

    if (json.password) {
      delete json.password;
    }
    // Do your conversion here.
    return json;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["role_id", "email", "password"],
      properties: {
        id: { type: "integer" },
        role_id: { type: "integer" },
        username: { type: "string", minLength: 1, maxLength: 255 },
        email: { type: "string", format: "email", maxLength: 255 },
        password: { type: "string", minLength: 1 },
      },
    };
  }

  static get relationMappings() {
    const Comment = require("./commentModel");
    return {
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: "users.role_id",
          to: "roles.id",
        },
      },
      posts: {
        relation: Model.HasManyRelation,
        modelClass: Post,
        join: {
          from: "users.id",
          to: "posts.user_id",
        },
      },
      comments: {
        relation: Model.HasManyRelation,
        modelClass: Comment,
        join: {
          from: "users.id",
          to: "comments.user_id",
        },
      },
    };
  }
}

module.exports = User;
