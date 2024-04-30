
const multer = require("multer");

const storage = multer.diskStorage();

const resizeAndCheckAvatar = async (req, res, next) => {
  try {
    console.log(req.file);
    const resizedImage = await sharp(req.file)
      .resize({ width: 50, height: 50 })
      .toFile();

    if (resizedImage.size > 500 * 1024) {
      return res
        .status(400)
        .json({ message: "Avatar size exceeds the limit of 500 KB." });
    }

    next();
  } catch (error) {
    next(error);
  }
};

const resizedAvatar = multer({ storage }).single("avatar");

module.exports = { resizeAndCheckAvatar, resizedAvatar };
