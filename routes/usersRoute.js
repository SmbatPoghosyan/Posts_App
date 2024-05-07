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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to users
 */

/**
 * @swagger
 *  /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *       500:
 *         description: Internal server error
 */

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

/**
 * @swagger
 *  /users:
 *  get:
 *     summary: Get a list of users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       username:
 *                         type: string
 *                 totalUsers:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */

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

/**
 * @swagger
 *  /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to get
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.put(
  "/:id",
  checkIfUserAllowed(RESOURCE.USER),
  validate(updateUserSchema),
  async (req, res) => {
    const id = req.params.id;
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

/**
 * @swagger
 *  /users/{id}:
 *    put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.delete("/:id", checkIfUserAllowed(RESOURCE.USER), async (req, res) => {
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

/**
 * @swagger
 *   /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

module.exports = router;
