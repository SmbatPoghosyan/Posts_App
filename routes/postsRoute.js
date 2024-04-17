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

  try {
    const result = await getPosts(limit, offset);

    const post = await Promise.all(
      result.posts.map(async (post) => {
        return await Post.query()
          .findById(post.id)
          .withGraphFetched("user")
          .withGraphFetched("comments")
          .withGraphFetched("comments.user");
      })
    );

    const response = createResponseObj(post, 200);

    return res.status(200).send(response);
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong.",
    });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const currentPost = await Post.query()
      .findById(id)
      .withGraphFetched("user")
      .withGraphFetched("comments")
      .withGraphFetched("comments.user");
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

module.exports = router;
