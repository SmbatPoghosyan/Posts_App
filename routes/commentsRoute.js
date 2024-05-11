const express = require("express");
const Post = require("../models/postModel");

const router = express.Router();
const { ROLE_NAME, RESOURCE } = require("../constants");
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  getCommentById,
} = require("../controllers/commentControllers.js");
const { followPost } = require("../controllers/postControllers.js");
const createResponseObj = require("../utils/createResponseObj.js");
const {
  commentPostSchema,
  commentPatchSchema,
} = require("../vallidations/commentsVallidations.js");
const validate = require("../vallidations");
const checkRole = require("../middlewares/checkRole.js");
const checkIfUserAllowed = require("../middlewares/checkIfUserAllowed.js");

router.post(
  "/",
  checkRole(ROLE_NAME.CREATOR, ROLE_NAME.USER),
  validate(commentPostSchema),
  async (req, res) => {
    try {
      const data = req.body;
      data.user_id = req.user.id;
      const id = data.post_id;
      const post = await Post.query().findById(id);
      if (!post) {
        res.status(404).send({ message: `Post with id ${id} not found!` });
        return;
      }
      const followedPost = await followPost(id, data.user_id);
      if (!followedPost) {
        return res.status(404).send({
          message: `Post with id ${postId} not found`,
        });
      }
      const newcomment = await createComment(data);
      const response = createResponseObj(
        newcomment,
        { message: "Comment created Successfully." },
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
 *  /comments:
 *    post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post_id:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *
 *       500:
 *         description: Internal server error
 */

router.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const comment = await getComments(limit, offset);

    const response = createResponseObj(comment, 200);

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
 *  /comments:
 *     get:
 *     summary: Get a list of comments
 *     tags: [Comments]
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
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *
 *       500:
 *         description: Internal server error
 */

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const currentComment = await getCommentById(id);
    if (!currentComment) {
      return res.status(404).send({
        message: `Comment with id ${id} not found.`,
      });
    }
    const response = createResponseObj(currentComment, {}, 200);
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
 *   /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to get
 *     responses:
 *       200:
 *         description: Comment found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */

router.put(
  "/:id",
  checkRole(ROLE_NAME.CREATOR, ROLE_NAME.USER),
  checkIfUserAllowed("COMMENT"),
  validate(commentPatchSchema),
  async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
      const updatedComment = await updateComment(id, data);
      if (!updatedComment) {
        return res.status(404).send({
          message: `Comment with id ${id} not found.`,
        });
      }
      const response = createResponseObj(
        updatedComment,
        { message: `Comment with id ${id} updated successfully.` },
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

/**
 * @swagger
 *  /comments/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */

router.delete(
  "/:id",
  checkRole(
    ROLE_NAME.ADMIN,
    ROLE_NAME.SUPERADMIN,
    ROLE_NAME.CREATOR,
    ROLE_NAME.USER
  ),
  checkIfUserAllowed(RESOURCE.COMMENT),
  async (req, res) => {
    const id = req.params.id;
    try {
      const result = await deleteComment(id);
      if (!result) {
        return res.status(404).send({
          message: "Comment not found.",
        });
      }
      const response = createResponseObj(
        result,
        { message: `Comment with id ${id} deleted successfully.` },
        200
      );
      return res.status(200).send(response);
    } catch (err) {
      console.error("error", err);
    }
  }
);

/**
 * @swagger
 *  /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */

module.exports = router;
