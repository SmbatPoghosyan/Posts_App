const postsSchema = {
  title: {
    type: "string",
    maxLength: 15,
    minLength: 8,
    required: true
  },
  subtitle: {
    type: "string",
    maxLength: 50,
    minLength: 10,
    required: false
  },
  author: {
    type: "object",
    schema: {
      firstName: {
        type: "string",
        maxLength: 15,
        minLength: 1,
        required: true
      },
      lastName: {
        type: "string",
        maxLength: 20,
        minLength: 1,
        required: true
      },
      age: {
        type: "number",
        min: 18,
        max: 100,
        required: true
      }
    },
    required: true
  }
};

const patchSchema = {
  title: {
    type: "string",
    maxLength: 15,
    minLength: 8,
    required: false
  },
  subtitle: {
    type: "string",
    maxLength: 50,
    minLength: 10,
    required: false
  },
  author: {
    type: "object",
    schema: {
      firstname: {
        type: "string",
        maxLength: 15,
        minLength: 0,
        required: true
      },
      lastname: {
        type: "string",
        maxLength: 20,
        minLength: 0,
        required: true
      },
      age: {
        type: "number",
        min: 18,
        max: 100,
        required: true
      }
    },
    required: false
  }
};

const validateObject = (obj, schema) => {
  let isValid = true;
  let errors = [];
  
  Object.keys(schema).forEach(key => {
    const field = schema[key];
    const value = obj[key];

    if (field.required && (value === undefined || value === null)) {
      isValid = false;
      errors.push(`${key} is required`);
      return;
    }

    if (value === undefined) {
      return;
    }

    if (typeof value !== field.type) {
      isValid = false;
      errors.push(`${key} must be a ${field.type}`);
      return;
    }

    if (field.type === "string") {
      if (value.length < field.minLength || value.length > field.maxLength) {
        isValid = false;
        errors.push(`${key} must be between ${field.minLength} and ${field.maxLength} characters`);
      }
    } else if (field.type === "number") {
      if (value < field.min || value > field.max) {
        isValid = false;
        errors.push(`${key} must be between ${field.min} and ${field.max}`);
      }
    }

    if (field.type === "object") {
      const result = validateObject(value, field.schema);
      if (!result.isValid) {
        isValid = false;
        // Append nested errors with key prefix
        result.errors.forEach(error => {
          errors.push(`${key}.${error}`);
        });
      }
    }
  });

  return { isValid, errors };
}

function validate(schema) {
  return (req, res, next) => {
    const { isValid, errors } = validateObject(req.body, schema);
    if (!isValid) {
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