const express = require("express");
const {
  createUserSchema,
  updateUserSchema,
} = require("../vallidations/usersValidation");
const validate = require("../vallidations");
const {
  createUser,
  updateUser,
  getUsers,
  deleteUser,
  getUserById,
} = require("../controllers/usersControllers.js");
const createResponseObj = require("../utils/createResponseObj.js");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const router = express.Router();
const { ROLE_NAME, RESOURCE } = require("../constants/index.js");
const checkRole = require("../middlewares/checkRole.js");
const checkIfUserAllowed = require("../middlewares/checkIfUserAllowed.js");

router.post(
  "/",
  checkRole(ROLE_NAME.SUPERADMIN, ROLE_NAME.ADMIN),
  validate(createUserSchema),
  async (req, res) => {
    try {
      const newUser = await createUser(req.body);

      const response = createResponseObj(
        newUser,
        { message: "User created Successfully" },
        201
      );
      res.status(201).send(response);
    } catch (err) {
      console.error("error", err);
      res.status(500).send({
        message: "Something went wrong.",
      });
    }
  }
);

router.get(
  "/",
  checkRole(ROLE_NAME.SUPERADMIN, ROLE_NAME.ADMIN),
  async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
      const result = await getUsers(limit, offset);
      result.users.forEach((el) => {
        delete el.password;
        delete el.created_at;
        delete el.updated_at;
        delete el.comments;
        delete el.posts;
      });

      const response = createResponseObj(
        result.users,
        {
          totalUsers: result.totalUsersCount,
          currentPage: page,
          limit,
        },
        200
      );

      res.status(200).send(response);
    } catch (err) {
      console.error("error", err);
      res.status(500).send({
        message: "Something went wrong.",
      });
    }
  }
);

router.get(
  "/:id",
  checkRole(ROLE_NAME.SUPERADMIN, ROLE_NAME.ADMIN),
  async (req, res) => {
    const id = req.params.id;
    try {
      const currentUser = await getUserById(id);

      if (!currentUser) {
        return res.status(404).send({
          message: `User with id ${id} not found`,
        });
      }

      delete currentUser.password;
      delete currentUser.created_at;
      delete currentUser.updated_at;

      const response = createResponseObj(currentUser, {}, 200);
      return res.status(200).send(response);
    } catch (err) {
      console.error("error", err);
      res.status(500).send({
        message: "Something went wrong.",
      });
    }
  }
);

router.put(
  "/:id",
  checkIfUserAllowed(RESOURCE.User),
  validate(updateUserSchema),
  async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const username = req.user.username;
    try {
      const userQuery = User.query().where("username", username);
      const user = await userQuery.first();
      const hashedPassword = user.password;
      const isSame = await bcrypt.compare(data.password, hashedPassword);
      if (!isSame) {
        return res.status(400).send({
          message: `Wrong password!`,
        });
      }
      delete data.password;

      const updatedUser = await updateUser(id, data);
      if (!updatedUser) {
        return res.status(404).send({
          message: `User with id ${id} not found`,
        });
      }
      const response = createResponseObj(
        updatedUser,
        { message: `User with id ${id} updated successfully` },
        200
      );
      delete response.data.created_at;
      delete response.data.updated_at;
      return res.status(200).send(response);
    } catch (err) {
      console.error("error", err);
      res.status(500).send({
        message: "Something went wrong.",
      });
    }
  }
);

router.delete("/:id", checkIfUserAllowed(RESOURCE.User), async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await deleteUser(userId);
    if (!result) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const response = createResponseObj(
      result,
      { message: `User with id ${userId} deleted successfully` },
      200
    );
    return res.status(200).send(response);
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong.",
    });
  }
});

module.exports = router;
