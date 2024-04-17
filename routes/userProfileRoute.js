const express = require("express");
const router = express.Router();
const { ROLE_NAME, RESOURCE } = require("../constants");
const validate = require("../vallidations");
const checkRole = require("../middlewares/checkRole.js");
const checkIfUserAllowed = require("../middlewares/checkIfUserAllowed.js");

router.post("/", async (req, res) => {
  try {
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong.",
    });
  }
});

router.get("/", async (req, res) => {
  try {
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
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
  async (req, res) => {
    try {
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
    try {
    } catch (err) {
      console.error("error", err);
      res.status(500).send({
        message: "Something went wrong.",
      });
    }
  }
);

module.exports = router;
