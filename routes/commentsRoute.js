const express = require("express");

const router = express.Router();
const { ROLE_NAME, RESOURCE } = require("../constants");
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  getCommentById,
} = require("../controllers/commentControllers.js");
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

router.delete(
  "/:id",
  checkRole(
    ROLE_NAME.ADMIN,
    ROLE_NAME.SUPERADMIN,
    ROLE_NAME.CREATOR,
    ROLE_NAME.USER
  ),
  checkIfUserAllowed(RESOURCE.Comment),
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

module.exports = router;
