const express = require("express");
const {
  createUserProfilesSchema,
  updateUserProfilesSchema,
} = require("../vallidations/userProfilesValidation");

const {
  createUserProfile,
  getUserProfiles,
  getUserProfileById,
  updateUserProfile,
  deleteUserPorfile,
  uploadProfileAvatar,
} = require("../controllers/user_profilesControllers");
const createResponseObj = require("../utils/createResponseObj");
const validate = require("../vallidations/index");

const router = express.Router();
const { RESOURCE } = require("../constants");
const checkIfUserAllowed = require("../middlewares/checkIfUserAllowed.js");
const {
  uploadAvatarS3,
  resizeAndCheckAvatar,
} = require("../middlewares/upload.js");

router.post(
  "/",
  uploadAvatarS3.single("avatar"),
  resizeAndCheckAvatar,
  validate(createUserProfilesSchema),
  async (req, res) => {
    try {
      req.body.age = Number(req.body.age);
      const { key, size, mimetype: format, location } = req.file;
      const image = {
        url: `${location}`,
        name: key,
        size,
        format,
      };
      userId = req.user.id;
      const newUserProfile = await createUserProfile(req.body, userId, image);
      const response = createResponseObj(
        newUserProfile,
        { message: "UserProfile created successfully" },
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
 * /userProfiles:
 *   post:
 *     summary: Create a new user profile
 *     tags: [User Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: User profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *
 *       500:
 *         description: Internal server error
 */

router.get("/", async (req, res) => {
  try {
    const userProfiles = await getUserProfiles();
    const response = createResponseObj(userProfiles, {}, 200);
    res.status(201).send(response);
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong.",
    });
  }
});

/**
 * @swagger
 * /userProfiles:
 *   get:
 *     summary: Get all user profiles
 *     tags: [User Profiles]
 *     responses:
 *       200:
 *         description: List of user profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *
 *       500:
 *         description: Internal server error
 */

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const userProfile = await getUserProfileById(id);
    if (!userProfile) {
      return res.status(404).send({
        message: `User profile with id ${id} not found`,
      });
    }
    const response = createResponseObj(userProfile, {}, 200);
    res.status(200).send(response);
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong.",
    });
  }
});

/**
 * @swagger
 *   /userProfiles/{id}:
 *   get:
 *     summary: Get a user profile by ID
 *     tags: [User Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user profile to get
 *     responses:
 *       200:
 *         description: User profile found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *
 *       404:
 *         description: User profile not found
 *       500:
 *         description: Internal server error
 */

router.put(
  "/:id",
  checkIfUserAllowed(RESOURCE.USERPROFILE),
  validate(updateUserProfilesSchema),
  async (req, res) => {
    const id = req.params.id;
    try {
      const updatedUserProfile = await updateUserProfile(id, req.body);
      if (!userProfile) {
        return res.status(404).send({
          message: `User profile with id ${id} not found`,
        });
      }
      const response = createResponseObj(
        updatedUserProfile,
        { message: `UserProfile with id ${id} updated successfully` },
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
 * /userProfiles/{id}:
 *   put:
 *     summary: Update a user profile by ID
 *     tags: [User Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user profile to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *
 *       404:
 *         description: User profile not found
 *       500:
 *         description: Internal server error
 */

router.put(
  "/:id/avatar",
  checkIfUserAllowed(RESOURCE.USERPROFILE),
  uploadAvatarS3.single("avatar"),
  resizeAndCheckAvatar,
  validate(updateUserProfilesSchema),
  async (req, res) => {
    const id = req.params.id;
    try {
      const { key, size, mimetype: format } = req.file;
      const image = {
        url: `${req.file.location}`,
        name: key,
        size,
        format,
      };
      const uploadedProfileAvatar = await uploadProfileAvatar(id, image);
      const response = createResponseObj(
        uploadedProfileAvatar,
        { message: `UserProfile with id ${id} updated successfully` },
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
 * /userProfiles/{id}:
 *   put:
 *     summary: Update a user profile by ID
 *     tags: [User Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user profile to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *
 *       404:
 *         description: User profile not found
 *       500:
 *         description: Internal server error
 */

router.put(
  "/:id/avatar",
  checkIfUserAllowed(RESOURCE.USERPROFILE),
  uploadAvatarS3.single("avatar"),
  resizeAndCheckAvatar,
  validate(updateUserProfilesSchema),
  async (req, res) => {
    const id = req.params.id;
    try {
      const { key, size, mimetype: format } = req.file;
      const image = {
        url: `${req.file.location}`,
        name: key,
        size,
        format,
      };
      const uploadedProfileAvatar = await uploadProfileAvatar(id, image);
      const response = createResponseObj(
        uploadedProfileAvatar,
        { message: `UserProfile with id ${id} updated successfully` },
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

router.delete(
  "/:id",
  checkIfUserAllowed(RESOURCE.USERPROFILE),
  async (req, res) => {
    const id = req.params.id;
    try {
      const deletedUserProfile = await deleteUserPorfile(id, req.body);
      if (!deletedUserProfile) {
        return res
          .status(404)
          .send({ message: `UserProfile with id ${id} not found` });
      }
      const response = createResponseObj(deletedUserProfile, {
        message: `UserProfile with id ${id} was successfully deleted`,
      });
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
 * /userProfiles/{id}:
 *   delete:
 *     summary: Delete a user profile by ID
 *     tags: [User Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user profile to delete
 *     responses:
 *       200:
 *         description: User profile deleted successfully
 *       404:
 *         description: User profile not found
 *       500:
 *         description: Internal server error
 */

module.exports = router;
