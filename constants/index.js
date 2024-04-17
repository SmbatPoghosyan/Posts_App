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
  Post: "Post",
  Comment: "Comment",
  User: "User",
  UserProfile: "UserProfile",
};

module.exports = {
  ROLE_ID,
  ROLE_NAME,
  RESOURCE,
};
