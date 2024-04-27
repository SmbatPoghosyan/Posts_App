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
} = require("../controllers/user_profilesControllers");
const createResponseObj = require("../utils/createResponseObj");
const validate = require("../vallidations/index");

const router = express.Router();
const { RESOURCE } = require("../constants");
const checkIfUserAllowed = require("../middlewares/checkIfUserAllowed.js");

router.post("/", validate(createUserProfilesSchema), async (req, res) => {
  try {
    const newUserProfile = await createUserProfile(req.body);
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
});

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

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const userProfile = await getUserProfileById(id);
    if (!userProfile) {
      return res.status(404).send({
        message: `UserProfile with id ${id} not found`,
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

router.put(
  "/:id",
  checkIfUserAllowed(RESOURCE.UserProfile),
  validate(updateUserProfilesSchema),
  async (req, res) => {
    const id = req.params.id;
    try {
      const updatedUserProfile = await updateUserProfile(id, req.body);
      if (!updatedUserProfile) {
        return res
          .status(404)
          .send({ message: `UserProfile with id ${id} not found` });
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

router.delete(
  "/:id",
  checkIfUserAllowed(RESOURCE.UserProfile),
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

module.exports = router;
