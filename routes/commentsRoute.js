const express = require("express");

const router = express.Router();
const { ROLE_NAME } = require("../constants");
const checkRole = require("../middlewares/checkRole.js");
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentControllers.js");
const createResponseObj = require("../utils/createResponseObj.js");
const Comment = require("../models/commentModel");
const {
  commentPostSchema,
  commentPatchSchema,
} = require("../vallidations/commentsVallidations.js");
const validate = require("../vallidations");

router.post(
  "/",
  checkRole(ROLE_NAME.CREATOR, ROLE_NAME.USER),
  validate(commentPostSchema),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const postId = req.body.id;
      const newcomment = await createComment(req.body, userId, postId);
      const response = createResponseObj(
        newcomment,
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

router.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const result = await getComments(limit, offset);

    const comment = await Promise.all(
      result.comments.map(async (post) => {
        return await Comment.query()
          .findById(post.id)
          .withGraphFetched("user")
          .withGraphFetched("post")
          .withGraphFetched("post.user");
      })
    );

    const response = createResponseObj(comment, 200);

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
    const currentComment = await Comment.query()
      .findById(id)
      .withGraphFetched("user")
      .withGraphFetched("post")
      .withGraphFetched("post.user");
    if (!currentComment) {
      return res.status(404).send({
        message: `Comment with id ${id} not found`,
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

router.put(
  "/:id",
  checkRole(ROLE_NAME.CREATOR, ROLE_NAME.USER),
  validate(commentPatchSchema),
  async (req, res) => {
    const id = req.params.id;
    const comment = await Comment.query().findById(id);
    if (comment.user_id !== req.user.id) {
      return res
        .status(400)
        .send({ message: "You are not allowed to update this post" });
    }
    const data = req.body;
    try {
      const updatedComment = await updateComment(id, data);
      if (!updatedComment) {
        return res.status(404).send({
          message: `Comment with id ${id} not found`,
        });
      }
      const response = createResponseObj(
        updatedComment,
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
  checkRole(
    ROLE_NAME.ADMIN,
    ROLE_NAME.SUPERADMIN,
    ROLE_NAME.CREATOR,
    ROLE_NAME.USER
  ),
  async (req, res) => {
    const id = req.params.id;
    const comment = await Comment.query().findById(id);
    if (
      comment.user_id !== req.user.id &&
      (req.userRole === ROLE_NAME.CREATOR || req.userRole === ROLE_NAME.USER)
    ) {
      return res.status(403).send({
        message: "You are not allowed to delete other's comments",
      });
    }
    try {
      const result = await deleteComment(id);
      if (!result) {
        return res.status(404).send({
          message: "comment not found",
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
    }
  }
);

module.exports = router;
