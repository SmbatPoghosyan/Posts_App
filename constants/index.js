const UserProfile = require("../models/userProfileModel");

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
  POST: "POST",
  COMMENT: "COMMENT",
  USER: "USER",
  USERPROFILE: "USERPROFILE",
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
