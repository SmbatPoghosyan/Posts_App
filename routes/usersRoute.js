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
const User = require("../models/userModel.js");

const router = express.Router();
const { ROLE_NAME } = require("../constants/index.js");
const checkRole = require("../middlewares/checkRole.js");

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
    console.log(req.query);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    console.log(offset);
    try {
      const result = await getUsers(limit, offset);
      console.log("result", result);

      const response = createResponseObj(
        result.users,
        {
          totalPosts: result.totalUsersCount,
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
  checkRole(ROLE_NAME.SUPERADMIN, ROLE_NAME.ADMIN),
  validate(updateUserSchema),
  async (req, res) => {
    const id = req.params.id;
    const user = await User.query().findById(id);
    if (user.role_id >= req.user.role_id) {
      return res
        .status(400)
        .send({ message: "You are not allowed to update this post" });
    }
    const data = req.body;
    try {
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
      return res.status(200).send(response);
    } catch (err) {
      console.error("error", err);
      res.status(500).send({
        message: "Something went wrong.",
      });
    }
  }
);

router.delete(
  "/:id",
  checkRole(ROLE_NAME.SUPERADMIN, ROLE_NAME.ADMIN),
  async (req, res) => {
    const userId = req.params.id;
    const user = await User.query().findById(userId);
    if (!user) {
      return res.status(403).send({
        message: `User with id ${userId} not found`,
      });
    }

    if (user.role_id > req.user.role_id) {
      return res.status(403).send({
        message: "You are not allowed to delete admin or superadmin", // how can I write this message correct?
      });
    }
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
  }
);

module.exports = router;
