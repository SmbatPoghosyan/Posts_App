const express = require("express");
const {
  postsSchema,
  patchSchema,
} = require("../vallidations/postsValidation.js");
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
  uploadPostImages,
} = require("../controllers/postControllers.js");
const createResponseObj = require("../utils/createResponseObj.js");

const router = express.Router();
const { ROLE_NAME, RESOURCE } = require("../constants/index.js");
const checkRole = require("../middlewares/checkRole.js");
const checkIfUserAllowed = require("../middlewares/checkIfUserAllowed.js");
const { uploadPostimagesS3 } = require("../middlewares/upload.js");

router.post(
  "/",
  checkRole(ROLE_NAME.CREATOR),
  uploadPostimagesS3.array("images", 5),
  validate(postsSchema),
  async (req, res) => {
    try {
      const images = [];
      for (const file of req.files) {
        const { filename, size, mimetype: format } = file;
        const image = {
          url: `${process.env.BASE_URL}/images/${filename}`,
          name: filename,
          size,
          format,
        };
        images.push(image);
      }
      const userId = req.user.id;
      const newPost = await createPost(req.body, userId, images);
      const imagesLocations = "";
      for (let i = 0; i < images.length; i++) {
        if (i < images.length - 1) {
          ImagesLocations += `${images[i].location} ; `;
        } else {
          ImagesLocations += `${images[i].location}.`;
        }
      }
      newPost.location = imagesLocations;
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

router.put(
  "/:id/images",
  checkRole(ROLE_NAME.CREATOR),
  checkIfUserAllowed(RESOURCE.POST),
  uploadPostimagesS3.array("images", 5),
  validate(patchSchema),
  async (req, res) => {
    const id = req.params.id;
    try {
      const images = [];
      for (const file of req.files) {
        const { filename, size, mimetype: format } = file;
        const image = {
          url: `${process.env.BASE_URL}/images/${filename}`,
          name: filename,
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

module.exports = router;
