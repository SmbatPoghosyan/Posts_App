const express = require('express');

const {postsSchema, patchSchema,  validate } = require('../vallidations/postsValidation.js');
const {getPosts, createPost, deletePost, updatePost} = require('../controllers/postControllers.js');

const router = express.Router();

router.post('/', validate(postsSchema), async (req, res) => {
  try {
    const newPost = await createPost(req.body);
    //create response object similar to get
    res.status(201).send(newPost)
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong."
    })
  }
});

router.get('/', async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const result = await getPosts(limit, offset);

    const response = {
      data: result.posts,
      meta: {
        totalPosts: result.totalPostsCount,
        currentPage: page,
        limit
      }
    }

    res.status(200).send(response);
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong."
    })
  }

})

router.get('/:id', (req, res) => {
  // change current implementation
  const id = req.params.id;
  getPosts().then(receivedPosts => {
    const postIndex = receivedPosts.findIndex((el) => el.id == id);
    if (postIndex === -1) {
      res.status(404).send({
        message: "Post not found."
      })
    }else{
      res.status(200).send(receivedPosts[postIndex])
    }
  })
  .catch(err => {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong."
    })
  }) 
})

router.put('/:id', validate(patchSchema), (req, res) => {
    // change current implementation
  const id = req.params.id;
  const updatedPost = req.body;
  getPosts().then(receivedPosts => {
    const postIndex = receivedPosts.findIndex((el) => el.id == id);
    if (postIndex === -1) {
        res.status(404).send({
        message: "Post not found."
      })
    } else {
      updatePost(receivedPosts, postIndex, updatedPost, isPatch = "PATCH").then(post => {
        console.log("post updated", post);
        res.status(200).send(post);
      })
    }; 
  })
  .catch(err => {
    console.error("error", err);
    res.status(500).send({
      message: validation.error.message
    })
  })
})

router.delete('/:id', (req, res) =>{
    // change current implementation
  getPosts().then(receivedPosts => {
    const id = req.params.id;
      const postIndex = receivedPosts.findIndex((el) => el.id == id);
      if (postIndex === -1) {
        res.status(404).send({
          message: "Post not found."
        })
      }else{
        deletePost(receivedPosts, postIndex).then(() => {
          res.status(200).send({
              message: `Post with id - ${id} successfully deleted`
          })
        }) .catch(err => {
          console.error("error", err)
          res.status(500).send({
          message: "Something went wrong."
          })
        })
      }
    }) 
})

module.exports = router