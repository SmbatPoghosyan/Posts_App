// installed node modules
const express = require("express");
const dotenv = require("dotenv");
const postRouter = require("./routes/postsRoute");
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/usersRoute");
const commentsRouter = require("./routes/commentsRoute");

require("./config/db");
const passportConfig = require("./config/passport");

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(passportConfig.initialize());

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
app.use("/comments", commentsRouter);

app.listen(PORT, () => {
  console.log(`server is running on localhost:${PORT}`);
});
