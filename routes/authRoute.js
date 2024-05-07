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
const redis = require("../config/redisConfig");

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
      message: "Something went wrong.",
    });
  }
});

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
      res.status(200).send({ message: "Email was succesfully send." });
    } else {
      res.status(500).send({ message: "Email was not send!" });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.get("/recover-password", async (req, res) => {
  const code = req.query.code;
  try {
    const id = await redis.get(code);
    console.log("id", id);
    if (id) {
      res.status(200).send(resetPasswordHTML.replace("${code}", code));
    } else {
      res
        .status(404)
        .send({ message: "The code for reset password not found!" });
    }
  } catch (err) {
    console.error(err);
    throw new Error(err);
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
      }else{
        res.status(500).send("New password and it's repeat are different")
      }
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }
);

module.exports = router;
