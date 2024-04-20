const Role = require("../models/roleModel");

const checkRoleName = async (role_id) => {
    const userRole = await Role.query().findById(role_id);
    const userRoleName = userRole.role_name.toUpperCase()

}