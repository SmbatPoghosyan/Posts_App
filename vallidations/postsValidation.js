const Ajv = require("ajv")
const addFormats = require("ajv-formats")

const ajv = new Ajv({ allErrors: true })
addFormats(ajv);

const postsSchema = {
  type: "object",
  required: ["user_id", "title", "content", "creation_date"],
  properties: {
    user_id: {
      type: "integer",
    },
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


function validate(schema) {
  return (req, res, next) => {

    const validateSchema = ajv.compile(schema)
    
    const valid = validateSchema(req.body)

    console.log(validateSchema, "validateSchema")
    console.log(valid, "valid")

    if (!valid) {
      const errors = validateSchema.errors.map(err => {
        return err.instancePath ? err.instancePath + ' ' + err.message : err.message
      })
      res.status(400).json({ message: "Validation errors", errors });
    } else {
      next();
    }
  };
}

module.exports = {
  postsSchema,
  patchSchema,
  validate
}