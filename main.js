// installed node modules
const express = require('express');
const dotenv = require('dotenv');
const postRouter = require('./routes/posts.route')
require('./config/db');

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.time = new Date();
  next();
})

app.use('/posts', postRouter);
         
app.listen(PORT, () => { 
  console.log(`server is running on localhost:${PORT}`)
});