const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const getUsers = async (limit, offset) => {
  try {
    const users = await User.query()
      .limit(limit)
      .offset(offset)
      .withGraphFetched("comments")
      .withGraphFetched("posts");

    const totalUsersCount = await User.query().resultSize();

    return { users, totalUsersCount };
  } catch (err) {
    throw new Error(err);
  }
};

const createUser = async (user) => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    const newUser = await User.query().insert(user);
    return newUser;
  } catch (err) {
    throw new Error(err);
  }
};

const updateUser = async (userId, data) => {
  try {
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }
    const user = await User.query().patchAndFetchById(userId, data);
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const getUserById = async (id) => {
  try {
    return await User.query().findById(id);
  } catch (err) {
    throw new Error(err);
  }
};

const deleteUser = async (userId) => {
  try {
    const res = await User.query().deleteById(userId);
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  createUser,
  updateUser,
  getUsers,
  deleteUser,
  getUserById,
};
