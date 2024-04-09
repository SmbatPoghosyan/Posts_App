const postsSchema = {
  type: "object",
  required: ["title", "content", "creation_date"],
  properties: {
    title: {
      type: "string",
      minLength: 1,
      maxLength: 50,
    },
    subtitle: {
      type: "string",
      minLength: 1,
      maxLength: 50,
    },
    content: {
      type: "string",
      minLength: 1,
    },
    creation_date: {
      type: "string",
      format: "date",
    },
  },
  additionalProperties: false
};

const patchSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      minLength: 1,
      maxLength: 50,
    },
    subtitle: {
      type: "string",
      minLength: 1,
      maxLength: 50,
    },
    content: {
      type: "string",
      minLength: 1,
    }
  },
  additionalProperties: false
}

module.exports = {
  postsSchema,
  patchSchema
}