const createUserProfilesSchema = {
  type: "object",
  required: ["firstname", "lastname", "age", "gender"],
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
      type: "string",
      minLength: 1,
    },
    age: {
      type: "string",
      minLength: 1,
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
  },
  additionalProperties: false,
};

module.exports = { createUserProfilesSchema, updateUserProfilesSchema };
