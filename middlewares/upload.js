const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, JPG, and PNG files are allowed."
      ),
      false
    );
  }
};

const uploadAvatar = multer({ storage });
const uploadPostimages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const resizeAndCheckAvatar = async (req, res, next) => {
  try {

    const resizedImage = await sharp(req.file)
      .resize({ width: 50, height: 50 })
      .toFile(`./public/images/${req.file.filename}`)
      .then(() => {
        console.log(`resolve!`);
      })
      .catch((err) => {
        console.log(err);
        return Promise.reject();
      });

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

module.exports = { uploadAvatar, uploadPostimages, resizeAndCheckAvatar };
