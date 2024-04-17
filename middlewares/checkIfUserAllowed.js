const { ROLE_NAME, RESOURCE } = require("../constants/index.js");
const Comment = require("../models/commentModel");
const Post = require("../models/postModel.js");
const User = require("../models/userModel.js");

const checkIfUserAllowed = (resource) => async (req, res, next) => {
  try {
    const id = req.params.id;
    if (resource === RESOURCE.User) {
      if (
        req.method === "DELETE" ||
        ("PUT" &&
          (req.userRole === ROLE_NAME.ADMIN ||
            req.userRole === ROLE_NAME.SUPERADMIN))
      ) {
        console.log(req.method);
        console.log(req.userRole);
        next();
        return;
      }
    }
    if (
      req.method === "DELETE" &&
      (req.userRole === ROLE_NAME.ADMIN ||
        req.userRole === ROLE_NAME.SUPERADMIN)
    ) {
      console.log(req.method);
      console.log(req.userRole);
      next();
      return;
    }

    let currentResource;
    switch (resource) {
      case RESOURCE.User:
        currentResource = await User.query().findById(id);
        break;
      case RESOURCE.UserProfile:
        currentResource = await UserProfile.query().findById(id);

        break;

      case RESOURCE.Post:
        currentResource = await Post.query().findById(id);

        break;
      case RESOURCE.Comment:
        currentResource = await Comment.query().findById(id);
        break;
      default:
        throw new Error(err);
    }

    const user_id = currentResource.user_id
      ? currentResource.user_id
      : currentResource.id;

    if (user_id !== req.user.id) {
      console.log(user_id);
      resource = resource.toLowerCase();
      return res.status(400).send({
        message: `You are not allowed to update this ${resource}.`,
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
