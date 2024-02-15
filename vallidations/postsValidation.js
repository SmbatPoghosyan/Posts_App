const Ajv = require("ajv")

const ajv = new Ajv({ allErrors: true })

const postsSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      minLength: 1,
      maxLength: 10
    },
    subtitle: {
      type: "string",
      minLength: 1,
      maxLength: 10
    },
    author: {
      type: "object",
      properties: {
        firstName: {
          type: "string",
          minLength: 1,
          maxLength: 10
        }, 
        lastName: {
          type: "string",
          minLength: 1,
          maxLength: 10
        },
        age: {
          type: "number", 
          minimum: 18,
          maximum: 100
        }
      },
      required: ["firstName", "lastName"]
    }
  },
  required: ["title", "author"],
  additionalProperties: false
}

const patchSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      minLength: 1,
      maxLength: 10
    },
    subtitle: {
      type: "string",
      minLength: 1,
      maxLength: 10
    },
    author: {
      type: "object",
      properties: {
        firstName: {
          type: "string",
          minLength: 1,
          maxLength: 10
        }, 
        lastName: {
          type: "string",
          minLength: 1,
          maxLength: 10
        },
        age: {
          type: "number", 
          minimum: 18,
          maximum: 100
        }
      },
      required: ["firstName", "lastName"]
    }
  },
  minProperties: 1,
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