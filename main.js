// installed node modules
const express = require("express");
const dotenv = require("dotenv");
const postRouter = require("./routes/postsRoute");
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/usersRoute");
const commentsRouter = require("./routes/commentsRoute");
const userProfileRouter = require("./routes/userProfileRoute");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const path = require("path");
const cors = require("cors");


require("./config/redis.js");
require("./config/db");
const passportConfig = require("./config/passport");

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PostsApp API",
      version: "1.0.0",
      description: "A simple Express PostsApp API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.json());
app.use(passportConfig.initialize());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.time = new Date();
  next();
});

app.use(
  "/posts",
  passportConfig.authenticate("jwt", { session: false }),
  postRouter
);
app.use("/auth", authRouter);
app.use(
  "/users",
  passportConfig.authenticate("jwt", { session: false }),
  userRouter
);
app.use(
  "/comments",
  passportConfig.authenticate("jwt", { session: false }),
  commentsRouter
);
app.use(
  "/user_profiles",
  passportConfig.authenticate("jwt", { session: false }),
  userProfileRouter
);

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`server is running on localhost:${PORT}`);
});
