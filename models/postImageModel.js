// models/PostImage.js
const { Model } = require("objection");

class PostImage extends Model {
  static get tableName() {
    return "posts_images";
  }

  static get idColumn() {
    return ["post_id", "image_id"];
  }

  static get relationMappings() {
    const Post = require("./postModel");
    const Image = require("./imageModel");

    return {
      post: {
        relation: Model.BelongsToOneRelation,
        modelClass: Post,
        join: {
          from: "posts_images.post_id",
          to: "posts.id",
        },
      },
      image: {
        relation: Model.BelongsToOneRelation,
        modelClass: Image,
        join: {
          from: "posts_images.image_id",
          to: "images.id",
        },
      },
    };
  }
}

module.exports = PostImage;
