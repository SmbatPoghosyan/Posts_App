const ROLE_ID = {
  USER: 1,
  CREATOR: 2,
  ADMIN: 3,
  SUPERADMIN: 4,
};
const ROLE_NAME = {
  USER: "USER",
  CREATOR: "CREATOR",
  ADMIN: "ADMIN",
  SUPERADMIN: "SUPERADMIN",
};

const RESOURCE = {
  Post: "POST",
  Comment: "COMMENT",
  User: "USER",
  UserProfile: "USERPROFILE",
};

const HTTP_METHOD = {
  DELETE: "DELETE",
  PUT: "PUT",
  GET: "GET",
  POST: "POST",
};

module.exports = {
  ROLE_ID,
  ROLE_NAME,
  RESOURCE,
  HTTP_METHOD,
};
