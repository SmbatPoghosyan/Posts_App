const User = require("../models/userModel");
const UserProfile = require("../models/userProfileModel");
const Image = require("../models/imageModel");
const {
  createUserProfilesSchema,
} = require("../vallidations/userProfilesValidation");

const createUserProfile = async (profile, image) => {
  try {
    const newImage = await Image.query().insert(image);
    const image_id = newImage.id; 
    profile.avatar = image_id;
    const newUserProfile = await UserProfile.query().insert(profile);
    newUserProfile.images = [newImage];
    return newUserProfile;
  } catch (err) {
    throw new Error(err);
  }
};

const getUserProfiles = async () => {
  try {
    const userProfiles = UserProfile.query();
    return userProfiles;
  } catch (err) {
    throw new Error(err);
  }
};

const getUserProfileById = async (id) => {
  try {
    const userProfile = await UserProfile.query().findById(id);
    return userProfile;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteUserPorfile = async (id) => {
  try {
    const deletedUserProfile = UserProfile.query().deleteById(id);
    return deletedUserProfile;
  } catch (err) {
    throw new Error(err);
  }
};

const updateUserProfile = async (id, data) => {
  try {
    const updatedUserPorfile = await UserProfile.query().patchAndFetchById(
      id,
      data
    );
    return updatedUserPorfile;
  } catch (err) {
    throw new Error(err);
  }
};

const uploadProfileAvatar = async (id, image) => {
  try {
    const newImage = await Image.query().insert(image);
    const image_id = newImage.id;
    const obj = { avatar: image_id };
    const uploadProfileAvatar = await UserProfile.query().patchAndFetchById(
      id,
      obj
    );

    uploadProfileAvatar.image = newImage;
    return { uploadProfileAvatar };
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  createUserProfile,
  getUserProfiles,
  getUserProfileById,
  updateUserProfile,
  deleteUserPorfile,
  uploadProfileAvatar,
};
