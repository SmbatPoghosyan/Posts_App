const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const s3 = new aws.S3();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("file", file);
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    console.log("file", file);

    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const storageS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: "posts.app.images",
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
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
const uploadAvatarS3 = multer({ storageS3 });
const uploadPostimagesS3 = multer({
  storageS3,
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

module.exports = { uploadAvatar, uploadPostimages, resizeAndCheckAvatar,uploadAvatarS3,uploadPostimagesS3 };
