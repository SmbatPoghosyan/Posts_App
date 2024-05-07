const { Model } = require("objection");

class postFollowers extends Model {
  static get tableName() {
    return "post_followers";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["post_id", "user_id"],

      properties: {
        id: { type: "integer" },
        post_id: { type: "integer" },
        user_id: { type: "integer" },
        created_at: { type: "string" },
        updated_at: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    const { Post } = require("./postModel");
    const { User } = require("./userModel");

    return {
      post: {
        relation: Model.BelongsToOneRelation,
        modelClass: Post,
        join: {
          from: "post_followers.post_id",
          to: "posts.id",
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "post_followers.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = postFollowers;
