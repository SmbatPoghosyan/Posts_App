const createUserSchema = {
  type: "object",
  required: ["username", "email", "password", "role_id"],
  properties: {
    username: {
      type: "string",
      minLength: 1,
      maxLength: 50,
    },
    email: {
      type: "string",
      format: "email",
    },
    role_id: {
      type: "number",
      minimum: 1,
      maximum: 2,
    },
    password: {
      type: "string",
      pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
      errorMessage:
        "Password should be min 8 characters, must contain one uppercase English letter, must contain minimum one lowercase English letter, must contain at least one special character (#?!@$%^&*-), must contain at least one digit",
    },
  },
  additionalProperties: false,
};

const updateUserSchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      minLength: 1,
      maxLength: 50,
    },
    email: {
      type: "string",
      format: "email",
    },
    role_id: {
      type: "number",
      minimum: 1,
      maximum: 4,
    },
    password: {
      type: "string",
      pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
      errorMessage:
        "Password should be min 8 characters, must contain one uppercase English letter, must contain minimum one lowercase English letter, must contain at least one special character (#?!@$%^&*-), must contain at least one digit",
    },
  },
  additionalProperties: false,
};

module.exports = { createUserSchema, updateUserSchema };
