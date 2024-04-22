const { Model } = require("objection");

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
        firstname: { type: "string", minLength: 1, maxLength: 50 },
        lastname: { type: "string", minLength: 1, maxLength: 50 },
        age: { type: "integer" },
        gender: { type: "string", minLength: 1, maxLength: 10 },
      },
    };
  }

  static get relationMappings() {
    const User = require("./userModel");
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "user_profiles.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = UserProfile;
