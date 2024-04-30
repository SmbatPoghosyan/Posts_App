const express = require("express");
const {
  postsSchema,
  patchSchema,
  commentSchema,
} = require("../vallidations/postsValidation.js");

const validate = require("../vallidations");
const {
  getPosts,
  createPost,
  deletePost,
  updatePost,
  getPostById,
  createPostComment,
  getCreatorsPosts,
} = require("../controllers/postControllers.js");
const createResponseObj = require("../utils/createResponseObj.js");

const router = express.Router();
const { ROLE_NAME, RESOURCE } = require("../constants/index.js");
const checkRole = require("../middlewares/checkRole.js");
const checkIfUserAllowed = require("../middlewares/checkIfUserAllowed.js");

router.post(
  "/",
  checkRole(ROLE_NAME.CREATOR),
  validate(postsSchema),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const newPost = await createPost(req.body, userId);
      const response = createResponseObj(
        newPost,
        { message: "Post created Successfully" },
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

router.post(
  "/:id/comment",
  checkRole(ROLE_NAME.CREATOR, ROLE_NAME.USER),
  validate(commentSchema),
  async (req, res) => {
    const postId = req.params.id;
    try {
      const userId = req.user.id;
      const newcomment = await createPostComment(postId, userId, req.body);
      const response = createResponseObj(
        newcomment,
        { message: "Comment created Successfully" },
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

router.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const withComments = req.query.withComments;

  try {
    const result = await getPosts(limit, offset, withComments);

    const response = createResponseObj(result, 200);

    return res.status(200).send(response);
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const withComments = req.query.withComments;
    const currentPost = await getPostById(id, withComments);
    if (!currentPost) {
      return res.status(404).send({
        message: `Post with id ${id} not found`,
      });
    }
    const response = createResponseObj(currentPost, {}, 200);
    return res.status(200).send(response);
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong.",
    });
  }
});

router.put(
  "/:id",
  checkRole(ROLE_NAME.CREATOR),
  checkIfUserAllowed(RESOURCE.Post),
  validate(patchSchema),
  async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
      const updatedPost = await updatePost(id, data);
      if (!updatedPost) {
        return res.status(404).send({
          message: `Post with id ${id} not found`,
        });
      }
      const response = createResponseObj(
        updatedPost,
        { message: `Post with id ${id} updated successfully` },
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
  checkRole(ROLE_NAME.ADMIN, ROLE_NAME.SUPERADMIN, ROLE_NAME.CREATOR),
  checkIfUserAllowed(RESOURCE.Post),
  async (req, res) => {
    const id = req.params.id;
    try {
      const result = await deletePost(id);
      if (!result) {
        return res.status(404).send({
          message: "Post not found",
        });
      }
      const response = createResponseObj(
        result,
        { message: `Post with id ${id} deleted successfully` },
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

router.get("/self", checkRole(ROLE_NAME.CREATOR), async (req, res) => {
  try {
    const posts = await getCreatorsPosts(req.user.id);
    if (!posts.length) {
      return res.status(404).send({ error: "You don't have posts yet :(" });
    }
    const response = createResponseObj(posts, {}, 200);
    res.status(200).send(response);
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong",
    });
  }
});

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Operations related to posts
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /posts/{id}/comment:
 *   post:
 *     summary: Create a comment on a post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get a list of posts
 *     tags: [Posts]
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
 *       - in: query
 *         name: withComments
 *         schema:
 *           type: boolean
 *         description: Include comments with the posts (true/false)
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to get
 *       - in: query
 *         name: withComments
 *         schema:
 *           type: boolean
 *         description: Include comments with the post (true/false)
 *     responses:
 *       200:
 *         description: Post found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchPostInput'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /posts/self:
 *   get:
 *     summary: Get posts created by the authenticated user
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of posts created by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *         description: User has not created any posts
 *       500:
 *         description: Internal server error
 */

module.exports = router;
