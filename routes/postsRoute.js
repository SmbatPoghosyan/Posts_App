const express = require("express");
const {
  postsSchema,
  patchSchema,
} = require("../vallidations/postsValidation.js");

const postFollowers = require("../models/postFollowersModel");
const { commentSchema } = require("../vallidations/commentsVallidations.js");

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
const { uploadPostimagesS3, fileFilter } = require("../middlewares/upload.js");

router.post(
  "/",
  checkRole(ROLE_NAME.CREATOR),
  uploadPostimagesS3.single("image1"),
  async (req, res) => {
    try {
      if (req.fileValidationError) {
        return res.status(415).json({ message: `${req.fileValidationError}` });
      }
      const images = [];
      for (const file of req.files) {
        const { key, size, mimetype: format, location } = file;
        const image = {
          url: `${location}`,
          name: key,
          size,
          format,
        };
        images.push(image);
      }
      const userId = req.user.id;
      const newPost = await createPost(req.body, userId, images);
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

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Operations related to posts
 */

/**
 * @swagger
 *  /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image1:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - image1
 *               - title
 *               - content
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *       500:
 *         description: Internal server error
 */

router.post(
  "/:id/comment",
  checkRole(ROLE_NAME.CREATOR, ROLE_NAME.USER),
  validate(commentSchema),
  async (req, res) => {
    const postId = req.params.id;
    try {
      const userId = req.user.id;
      const newcomment = await createPostComment(postId, userId, req.body);
      await followPost(postId, userId);

      const response = createResponseObj(
        newcomment,
        {
          message:
            "Comment created successfully. Now you are following this post",
        },
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
 * /posts/{id}/comment:
 *   post:
 *     summary: Create a comment for a post
 *     description: Creates a new comment for the specified post.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post to comment on
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: comment
 *         description: Comment object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             text:
 *               type: string
 *               description: The content of the comment
 *     responses:
 *       '201':
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the created comment
 *       '500':
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */

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

/**
 * @swagger
 *  /posts:
 *    get:
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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         text:
 *                           type: string
 *       500:
 *         description: Internal server error
 */

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
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

router.put(
  "/:id",
  checkRole(ROLE_NAME.CREATOR),
  checkIfUserAllowed(RESOURCE.POST),
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

/**
 * @swagger
 *  /posts/{id}:
 *    put:
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
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - title
 *               - content
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

router.put(
  "/:id/images",
  checkRole(ROLE_NAME.CREATOR),
  checkIfUserAllowed(RESOURCE.POST),
  uploadPostimagesS3.array("images", 5),
  validate(patchSchema),
  async (req, res) => {
    const id = req.params.id;
    try {
      if (req.fileValidationError) {
        return res.status(415).json({ message: `${req.fileValidationError}` });
      }
      const images = [];
      for (const file of req.files) {
        const { key, size, mimetype: format } = file;
        const image = {
          url: `${location}`,
          name: key,
          size,
          format,
        };
        images.push(image);
      }
      const uploadedPostImages = await uploadPostImages(id, images);
      const imagesLocations = "";
      for (let i = 0; i < images.length; i++) {
        if (i < images.length - 1) {
          imagesLocations += `${images[i].location} ; `;
        } else {
          imagesLocations += `${images[i].location}.`;
        }
      }
      uploadedPostImages.location = imagesLocations;
      if (!uploadedPostImages) {
        return res.status(404).send({
          message: `Post with id ${id} not found`,
        });
      }
      const response = createResponseObj(
        uploadedPostImages,
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
  checkIfUserAllowed(RESOURCE.POST),
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

/**
 * @swagger
 *  /posts/{id}:
 *  delete:
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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *       404:
 *         description: User has not created any posts
 *       500:
 *         description: Internal server error
 */

router.post(
  "/:id/follow",
  checkRole(ROLE_NAME.USER, ROLE_NAME.CREATOR),
  async (req, res) => {
    const postId = Number(req.params.id);
    const userId = req.user.id;
    try {
      const post = await followPost(postId, userId);
      if (!post) {
        return res.status(404).send({
          message: `Post with id ${postId} not found`,
        });
      }
      const response = createResponseObj(
        post,
        { message: "Now you are following this post" },
        201
      );
      return res.status(201).send(response);
    } catch (err) {
      console.error("error", err);
      res.status(500).send({
        message: "Something went wrong.",
      });
    }
  }
);

router.delete(
  "/:id/unfollow",
  checkRole(ROLE_NAME.USER, ROLE_NAME.CREATOR),
  async (req, res) => {
    const postId = Number(req.params.id);

    const userId = req.user.id;
    try {
      const postFollowers = await unfollowPost(postId, userId);
      if (!postFollowers) {
        return res.status(404).send({
          message: `Post with id ${postId} not found`,
        });
      }

      const response = createResponseObj(
        postFollowers,
        { message: "You are no longer following this post." },
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
