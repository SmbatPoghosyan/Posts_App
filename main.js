// installed node modules
const express = require('express');
const dotenv = require('dotenv');

// local modules
const {postsSchema, patchSchema,  validate } = require('./vallidations/postsValidation.js');
const {getPosts, createPost, deletePost, updatePost} = require('./controllers/postControllers.js');

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
// app.use(express.text())


app.use((req, res, next) => {
  req.time = new Date();
  next();
})

// app.post('/posts', validate(postsSchema), (req, res) => {
//   createPost(req.body).then(createdPost =>{
//     res.status(201).send(createdPost);
//   }).catch(err => {
//     console.error("error", err);
//     res.status(500).send({
//       message: "Something went wrong."
//     })
//   }) 
// });

// app.get('/posts', (req, res) => {
//   const { page, limit } = req.query;

//   getPosts(offset, limit).then(posts => {
//     res.status(200).send(posts);
//   }).catch(err => {
//     console.error("error", err);
//     res.status(500).send({
//       message: "Something went wrong."
//     })
//   })
// })

// app.get('/posts/:id', (req, res) => {
//   const id = req.params.id;
//   getPosts().then(receivedPosts => {
//     const postIndex = receivedPosts.findIndex((el) => el.id == id);
//     if (postIndex === -1) {
//       res.status(404).send({
//         message: "Post not found."
//       })
//     }else{
//       res.status(200).send(receivedPosts[postIndex])
//     }
//   })
//   .catch(err => {
//     console.error("error", err);
//     res.status(500).send({
//       message: "Something went wrong."
//     })
//   }) 
// })

// app.put('/posts/:id', isPostExist, validate(postsSchema), (req, res) => {
//   const id = req.params.id;
//   const updatedPost = req.body;
//   getPosts().then(receivedPosts => {
//     const postIndex = receivedPosts.findIndex((el) => el.id == id);
//     if (postIndex === -1) {
//         res.status(404).send({
//         message: "Post not found."
//       })
//     } else {
//       updatePost(receivedPosts, postIndex, updatedPost, isPatch = "PATCH").then(post => {
//         console.log("post updated", post);
//         res.status(200).send(post);
//       })
//     }; 
//   })
//   .catch(err => {
//     console.error("error", err);
//     res.status(500).send({
//       message: validation.error.message
//     })
//   })
// })

// app.patch('/posts/:id', validate(patchSchema), (req, res) => {
//   const id = req.params.id;
//   const updatedPost = req.body;
//   getPosts().then(receivedPosts => {
//     const postIndex = receivedPosts.findIndex((el) => el.id == id);
//     if (postIndex === -1) {
//       res.status(404).send({
//         message: "Post not found."
//       })
//     }else{
//       updatePost(receivedPosts, postIndex, updatedPost, isPatch = "PATCH").then(post => {
//         res.status(200).send(post);
//       })
//     }; 
//   })
//   .catch(err => {
//     console.error("error", err);
//     res.status(500).send({
//       message: validation.error.message
//     })
//   })
// })

// app.delete('/posts/:id', (req, res) =>{
//   getPosts().then(receivedPosts => {
//     const id = req.params.id;
//       const postIndex = receivedPosts.findIndex((el) => el.id == id);
//       if (postIndex === -1) {
//         res.status(404).send({
//           message: "Post not found."
//         })
//       }else{
//         deletePost(receivedPosts, postIndex).then(() => {
//           res.status(200).send({
//               message: `Post with id - ${id} successfully deleted`
//           })
//         }) .catch(err => {
//           console.error("error", err)
//           res.status(500).send({
//           message: "Something went wrong."
//           })
//         })
//       }
//     }) 
// })
         
app.listen(PORT, () => { 
  console.log(`server is running on localhost:${PORT}`)
});