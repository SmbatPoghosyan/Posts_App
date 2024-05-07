const { ROLE_NAME, RESOURCE, HTTP_METHOD } = require("../constants/index.js");
const Comment = require("../models/commentModel");
const Post = require("../models/postModel.js");
const User = require("../models/userModel.js");
const UserProfile = require("../models/userProfileModel.js");

const checkIfUserAllowed = (resource) => async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.query()
      .findById(req.user.id)
      .withGraphFetched("role");

    const userRole = user.role.role_name.toUpperCase();
    if (
      req.method === HTTP_METHOD.DELETE &&
      (userRole === ROLE_NAME.ADMIN || userRole === ROLE_NAME.SUPERADMIN)
    ) {
      next();
      return;
    }

    let currentResource;
    switch (resource) {
      case RESOURCE.USER:
        if (
          req.method === HTTP_METHOD.PUT &&
          (userRole === ROLE_NAME.ADMIN || userRole === ROLE_NAME.SUPERADMIN)
        ) {
          next();
          return;
        } else if (
          req.method === HTTP_METHOD.PUT &&
          userRole !== ROLE_NAME.ADMIN &&
          userRole !== ROLE_NAME.SUPERADMIN
        ) {
          if (req.body.hasOwnProperty("role_id")) {
            return res.status(400).send({
              message: "You are not allowed to update or delete your role",
            });
          } else {
            currentResource = await User.query().findById(id);
            break;
          }
        }
      case RESOURCE.USERPROFILE:
        currentResource = await UserProfile.query().findById(id);
        break;
      case RESOURCE.POST:
        currentResource = await Post.query().findById(id);
        break;
      case RESOURCE.COMMENT:
        currentResource = await Comment.query().findById(id);
        break;
      default:
        throw new Error("Resource type is not supported.");
    }

    if (!currentResource) {
      return res.status(404).send({
        message: `${resource} with id ${id} not found!`,
      });
    }

    const user_id = currentResource.user_id
      ? currentResource.user_id
      : currentResource.id;

    if (user_id !== req.user.id) {
      return res.status(400).send({
        message: `You are not allowed to update or delete this ${resource.toLowerCase()}.`,
      });
    } else {
      next();
    }
  } catch (err) {
    console.error(err.message);
    throw new Error(err);
  }
};

module.exports = checkIfUserAllowed;
