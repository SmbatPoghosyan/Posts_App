const Ajv = require("ajv")
const addFormats = require("ajv-formats")
const ajvErrors = require("ajv-errors")

const ajv = new Ajv({ allErrors: true })
addFormats(ajv);
ajvErrors(ajv)

function validate(schema) {
  return (req, res, next) => {

    const validateSchema = ajv.compile(schema)
    
    const valid = validateSchema(req.body)

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

module.exports = validate;