const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
dotenv.config();

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

const s3 = new S3Client({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const bucketName = process.env.AWS_S3_BUCKET_NAME;

const storageS3 = multerS3({
  s3: s3,
  bucket: bucketName,
  acl: "public-read",
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    req.fileValidationError =
      "Invalid file type. Only JPEG, JPG, and PNG files are allowed.";
    return cb(null, false, req.fileValidationError);
  }
};

const collectStream = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });

const resizeAndCheckAvatar = async (req, res, next) => {
  try {
    const getObjectParams = {
      Bucket: req.file.bucket,
      Key: req.file.key,
    };

    const s3Object = await s3.send(new GetObjectCommand(getObjectParams));
    const fileBuffer = await collectStream(s3Object.Body);

    const resizedImageBuffer = await sharp(fileBuffer)
      .resize({ width: 50, height: 50 })
      .toBuffer();

    if (resizedImageBuffer.length > 500 * 1024) {
      return res
        .status(400)
        .json({ message: "Avatar size exceeds the limit of 500 KB." });
    }

    const putObjectParams = {
      Bucket: req.file.bucket,
      Key: `resized/${req.file.key}`,
      Body: resizedImageBuffer,
    };

    await s3.send(new PutObjectCommand(putObjectParams));

    next();
  } catch (error) {
    res.status(415).send({
      message: "Invalid file type. Only JPEG, JPG, and PNG files are allowed.",
    });
    return;
  }
};

const uploadAvatar = multer({ storage });
const uploadPostimages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
const uploadAvatarS3 = multer({ storage: storageS3 });
const uploadPostimagesS3 = multer({
  storage: storageS3,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = {
  uploadAvatar,
  uploadPostimages,
  resizeAndCheckAvatar,
  uploadAvatarS3,
  uploadPostimagesS3,
};
