// models/Image.js
const { Model } = require("objection");

class Image extends Model {
  static get tableName() {
    return "images";
  }

  static get relationMappings() {
    const Post = require("./postModel");
    const PostImage = require("./postImageModel");
    const UserProfile = require("./userProfileModel");

    return {
      posts: {
        relation: Model.BelongsToOneRelation,
        modelClass: Post,
        join: {
          from: "images.id",
          through: {
            from: "posts_images.image_id",
            to: "posts_images.post_id",
          },
          to: "posts.id",
        },
      },
      userProfiles: {
        relation: Model.HasManyRelation,
        modelClass: UserProfile,
        join: {
          from: "images.id",
          to: "user_profiles.avatar",
        },
      },
    };
  }
}

module.exports = Image;
