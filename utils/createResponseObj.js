//implement createResponseObj function
/* {
  data: your data,
  meta: additional props,
  status: status code - 200, 201
  success: true or false
} */

const createResponseObj = (data, metadata, statusCode, success = true) => {
  if (data?.password) {
    delete data.password;
  }
  return {
    data,
    meta: metadata,
    status: statusCode,
    success,
  };
};

module.exports = createResponseObj;
