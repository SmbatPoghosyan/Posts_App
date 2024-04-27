const createUserProfilesSchema = {
  type: "object",
  required: ["firstname", "lastname", "age", "gender", "user_id"],
  properties: {
    firstname: {
      type: "string",
      minLength: 1,
      maxLength: 50,
    },
    lastname: {
      type: "string",
      minLength: 1,
      maxLength: 50,
    },
    user_id: {
      type: "number",
      minimum: 1,
      maximum: 2,
    },
    age: {
      type: "number",
    },
    gender: {
      type: "string",
      minLength: 1,
      maxLength: 10,
    },
  },
  additionalProperties: false,
};

const updateUserProfilesSchema = {
  type: "object",
  properties: {
    firstname: {
      type: "string",
      minLength: 1,
      maxLength: 50,
    },
    lastname: {
      type: "string",
      minLength: 1,
      maxLength: 50,
    },
    age: {
      type: "number",
    },
    gender: {
      type: "string",
      minLength: 1,
      maxLength: 10,
    },
    user_id: {
      type: "number",
      minimum: 1,
      maximum: 4,
    },
  },
  additionalProperties: false,
};

module.exports = { createUserProfilesSchema, updateUserProfilesSchema };
