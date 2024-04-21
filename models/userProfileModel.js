const { Model } = require("objection");
const User = require("../models/userModel");

class UserProfile extends Model {
  static get tableName() {
    return "user_profiles";
  }
  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "firstname", "lastname", "age", "gender"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        firstname: { type: "string", minlength: 1, maxlength: 50 },
        lastname: { type: "string", minlength: 1, maxlength: 50 },
        age: { type: "integer" },
        gender: { type: "string", minlength: 1, maxlength: 10 },
      },
    };
  }

  static get relationMappings() {
    const User = require("./userModel");
    const Image = require("./imageModel");
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "user_profiles.user_id",
          to: "users.id",
        },
      },
      avatar: {
        relation: Model.BelongsToOneRelation,
        modelClass: Image,
        join: {
          from: "user_profiles.avatar",
          to: "images.id",
        },
      },
    };
  }
}

module.exports = UserProfile;
