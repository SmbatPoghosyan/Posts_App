const signupSchema = {
  type: "object",
  required: ["username", "email", "password"],
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
    password: {
      type: "string",
      pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
      errorMessage:
        "Password should be min 8 characters, must contain one uppercase English letter, must contain minimum one lowercase English letter, must contain at least one special character (#?!@$%^&*-), must contain at least one digit",
    },
  },
  additionalProperties: false,
};

const signinSchema = {
  type: "object",
  required: ["password"],
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
    password: {
      type: "string",
      minLength: 1,
    },
  },
  minProperties: 2,
  additionalProperties: false,
};

const resetPasswordSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
    },
  },
  minProperties: 1,
  additionalProperties: false,
};

const newPasswordSchema = {
  type: "object",
  properties: {
    newPassword: {
      type: "string",
      pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
      errorMessage:
        "Password should be min 8 characters, must contain one uppercase English letter, must contain minimum one lowercase English letter, must contain at least one special character (#?!@$%^&*-), must contain at least one digit",
    },
    repeatPassword: {
      type: "string",
      pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
      errorMessage:
        "Password should be min 8 characters, must contain one uppercase English letter, must contain minimum one lowercase English letter, must contain at least one special character (#?!@$%^&*-), must contain at least one digit",
    },
  },
  minProperties: 2,
  additionalProperties: false,
};

module.exports = {
  signinSchema,
  signupSchema,
  resetPasswordSchema,
  newPasswordSchema,
};
