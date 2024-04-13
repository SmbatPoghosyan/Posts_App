const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
  } catch (err) {
    console.error("error", err);
  }
});

router.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
  } catch (err) {
    console.error("error", err);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
  } catch (err) {
    console.error("error", err);
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  try {
  } catch (err) {
    console.error("error", err);
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
  } catch (err) {
    console.error("error", err);
  }
});

module.exports = router;
