const Role = require("../models/roleModel");

const checkRole =
  (...roles) =>
  async (req, res, next) => {
    try {
      const userRoleId = req.user.role_id;
      const userRole = await Role.query().findById(userRoleId);
      const userRoleName = userRole.role_name.toUpperCase();
      const allowed = roles.includes(userRoleName);
      req.userRole = userRoleName;

      if (allowed) {
        next();
      } else {
        res.status(403).send({
          message: "Not allowed",
        });
      }
    } catch (err) {
      console.error(err.message);
      throw new Error(err);
    }
  };

module.exports = checkRole;
