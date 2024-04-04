const express = require('express');
const bcrypt = require('bcrypt');
const { ROLES } = require('../constants')
const router = express.Router();
const User = require('../models/userModel');
const createResponseObj = require('../utils/createResponseObj');
/*
email: smbat@example.com
username: smbatp
password: 123!asdasd
*/
router.post('/signup', async (req, res) => {
  const data = req.body;
  const { email, password, username } = data;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userObject = {
      email,
      password: hashedPassword,
      username,
      role_id: ROLES.USER
    }
    const newUser = await User.query().insert(userObject)
    const responseObj = createResponseObj(newUser, {message: "You succesfully registered."}, 200);

    res.status(200).send(responseObj);
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong."
    })
  }
  
})

router.post('/signin', async (req, res) => {
  const data = req.body;
  const { email, password, username } = data;
  try {
    const userQuery = User.query();
    if (email) {
      userQuery.where('email', email)
    } else if (username) {
      userQuery.where('username', username)
    }

    const user = await userQuery.first();

    const hashedPassword = user.password;

    const isSame = await bcrypt.compare(password, hashedPassword);
    console.log(isSame);
    delete user.password
    const resObj = createResponseObj(user, { message: "You successfully loged in"}, 200, isSame);
    res.status(200).send(resObj);
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong."
    })
  }
  
})

module.exports = router