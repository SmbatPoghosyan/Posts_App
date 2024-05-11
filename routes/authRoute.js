const express = require("express");
const router = express.Router();
const createResponseObj = require("../utils/createResponseObj");
const validate = require("../vallidations");
const {
  signinSchema,
  signupSchema,
  resetPasswordSchema,
  newPasswordSchema,
} = require("../vallidations/authValidations");
const { updateUser } = require("../controllers/usersControllers");
const { signin, signup, resetPassword } = require("../services/authService");
const emailTemplate = require("../html_templates/reset_password");

const { sendVerificationEmail } = require("../services/verificationService");
const User = require("../models/userModel");

const resetPasswordHTML = require("../htmlPages/resetPassword");
const { v4: uuidv4 } = require("uuid");
const redis = require("../config/redis");

router.post("/signup", validate(signupSchema), async (req, res) => {
  const data = req.body;
  const { email, password, username } = data;

  try {
    const currentCode = await sendVerificationEmail(data.email, data.username);
    const newUser = await signup(email, password, username, currentCode);
    newUser.verification_code = currentCode;

    let responseObj;
    responseObj = createResponseObj(
      newUser,
      { message: "You succesfully registered." },
      200
    );
    res.status(200).send(responseObj);
  } catch (err) {
    res.status(500).send({
      message: "User with this username or email already exsists!",
    });
  }
});

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *       500:
 *         description: User with this username or email already exists
 */

router.post("/signin", validate(signinSchema), async (req, res) => {
  const data = req.body;
  const { email, password, username } = data;
  try {
    const { user, token } = await signin(email, password, username);
    const resObj = createResponseObj(
      user,
      { message: "You successfully loged in", token },
      200
    );
    res.status(200).send(resObj);
  } catch (err) {
    let errorMessage;
    if (email) {
      errorMessage = "Wrong email or password!";
    } else if (username) {
      errorMessage = "Wrong username or password!";
    }
    console.error("error", err);
    res.status(500).send({
      message: errorMessage,
    });
  }
});

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Log in with existing user credentials
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       500:
 *         description: Wrong email/username or password
 */

router.post("/verify", async (req, res) => {
  try {
    const code = req.body.code;
    if (!code) {
      return res.status(401).send({ message: "Code is empty" });
    }
    const user = await User.query().findOne({ verification_code: code });
    if (!user) {
      return res.status(401).send({ message: "Invalid code" });
    } else {
      await User.query().patchAndFetchById(user.id, { is_active: true });

      const resObj = createResponseObj(
        {},
        { message: "You successfully verified your email." },
        200
      );

      res.status(200).send(resObj);
    }
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong.",
    });
  }
});

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: Verify your account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verification_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: You successfully verified your email.
 *       401:
 *         description: Invalid code!
 *       500:
 *         description: Something went wrong!
 */

router.post("/forgot", validate(resetPasswordSchema), async (req, res) => {
  try {
    const code = uuidv4();
    const recipient = req.body.email;

    const userQuery = User.query();
    if (recipient) {
      userQuery.where("email", recipient);
    }
    const user = await userQuery.first();

    const recipient_name = user.username;
    const id = user.id;

    const sendSucces = await resetPassword(
      recipient,
      recipient_name,
      emailTemplate,
      code
    );

    const resultOfRedis = await redis.set(code, id, "EX", 3600);
    if (sendSucces && resultOfRedis) {
      res.status(250).send({ message: "Email was succesfully send." });
    } else {
      res.status(502).send({ message: "Email was not send!" });
    }
  } catch (err) {
    console.error("error", err);
    res.status(500).send({ message: "Something went wrong" });
  }
});

/**
 * @swagger
 * /auth/forgot:
 *   post:
 *     summary: Recover password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       250:
 *         description: Email was succesfully send.
 *       500:
 *         description: Something went wrong!
 *       502:
 *         description: Email was not send!
 */

router.get("/recover-password", async (req, res) => {
  const code = req.query.code;
  try {
    const id = await redis.get(code);
    if (id) {
      res.status(200).send(resetPasswordHTML.replace("${code}", code));
    } else {
      res
        .status(404)
        .send({ message: "The code for reset password not found!" });
    }
  } catch (err) {
    console.error("error", err);
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.post(
  "/recover-password",
  validate(newPasswordSchema),
  async (req, res) => {
    const data = { password: req.body.newPassword };
    const code = req.query.code;

    try {
      const id = await redis.get(code);
      if (req.body.newPassword === req.body.repeatPassword) {
        const result = await updateUser(id, data);
        if (!result) {
          res.send("Could not update user");
        } else {
          res.status(200).send("User password was updated successfully");
        }
      } else {
        res.status(500).send("New password and it's repeat are different");
      }
    } catch (err) {
      console.error("error", err);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

module.exports = router;
