const express = require("express");
const router = express.Router();
const createResponseObj = require("../utils/createResponseObj");
const validate = require("../vallidations");
const {
  signinSchema,
  signupSchema,
} = require("../vallidations/authValidations");
const { signin, signup } = require("../services/authService");

router.post("/signup", validate(signupSchema), async (req, res) => {
  const data = req.body;
  const { email, password, username } = data;
  try {
    const newUser = await signup(email, password, username);

    const responseObj = createResponseObj(
      newUser,
      { message: "You succesfully registered." },
      200
    );
    delete responseObj.created_at;
    delete responseObj.updated_at;
    res.status(200).send(responseObj);
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "User with this username or email already exsists!",
    });
  }
});

router.post("/signin", validate(signinSchema), async (req, res) => {
  const data = req.body;
  const { email, password, username } = data;
  try {
    const { user, token } = await signin(email, password, username);
    const responseObj = createResponseObj(
      user,
      { message: "You successfully loged in", token },
      200
    );

    delete responseObj.data.created_at;
    delete responseObj.data.updated_at;
    res.status(200).send(responseObj);
  } catch (err) {
    let errorMessage;
    if (email) {
      errorMessage = "Wrong email or password!";
    } else if (username) {
      errorMessage = "Wrong username or password";
    }
    console.error("error", err);
    res.status(500).send({
      message: errorMessage,
    });
  }
});

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupInput'
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: User with this username or email already exists
 */

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Log in with existing user credentials
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SigninInput'
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       500:
 *         description: Wrong email/username or password
 */

module.exports = router;
