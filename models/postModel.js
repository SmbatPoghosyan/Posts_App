const { Model } = require("objection");
const User = require("./userModel");
const Comment = require("./commentModel");
const Image = require("./imageModel");

class Post extends Model {
  static get tableName() {
    return "posts";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "title", "content"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        title: { type: "string", minLength: 1, maxLength: 255 },
        subtitle: { type: "string", maxLength: 255 },
        content: { type: "string", minLength: 1 },
        creation_date: { type: "string", format: "date" },
        view_count: { type: "integer", minimum: 0 },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "posts.user_id",
          to: "users.id",
        },
      },
      comments: {
        relation: Model.HasManyRelation,
        modelClass: Comment,
        join: {
          from: "posts.id",
          to: "comments.post_id",
        },
      },
      images: {
        relation: Model.HasManyRelation,
        modelClass: Image,
        join: {
          from: 'posts.id',
          through: {
            from: 'posts_images.post_id',
            to: 'posts_images.image_id',
          },
          to: 'images.id',
        },
      },
    };
  }
}

module.exports = Post;
