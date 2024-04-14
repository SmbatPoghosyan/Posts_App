const commentPostSchema = {
  type: "object",
  required: ["post_id", "comment", "creation_date"],
  properties: {
    post_id: {
      type: "integer",
    },
    comment: {
      type: "string",
      minLength: 1,
    },
    creation_date: {
      type: "string",
      format: "date",
    },
  },
  additionalProperties: false,
};

const commentPatchSchema = {
  type: "object",
  required: ["comment"],
  properties: {
    comment: {
      type: "string",
      minLength: 1,
    },
  },
  additionalProperties: false,
};

module.exports = {
    commentPostSchema,
  commentPatchSchema,
};
