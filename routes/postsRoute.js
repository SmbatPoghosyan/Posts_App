const express = require('express');

const { postsSchema, patchSchema } = require('../vallidations/postsValidation.js');
const validate = require('../vallidations')
const {
  getPosts,
  createPost,
  deletePost,
  updatePost,
  getPostById
} = require('../controllers/postControllers.js');
const createResponseObj = require('../utils/createResponseObj.js')

const router = express.Router();
const passprotConf = require('../config/passport.js');

router.post('/', passprotConf.authenticate('jwt', { session: false }), validate(postsSchema), async (req, res) => {
  try {
    console.log(req.user)
    const newPost = await createPost(req.body);
    const response = createResponseObj(newPost, { message: "Post created Successfully"}, 201);
    res.status(201).send(response)
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

    const response = createResponseObj(result.posts, {
      totalPosts: result.totalPostsCount,
      currentPage: page,
      limit
    }, 200);

    res.status(200).send(response);
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong."
    })
  }

})

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const currentPost = await getPostById(id);
    if  (!currentPost) {
      return res.status(404).send({
        message: `Post with id ${id} not found`
      })
    }
    const response = createResponseObj(currentPost, {}, 200);
    return res.status(200).send(response)
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong."
    })
  }
})

router.put('/:id', validate(patchSchema), async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const updatedPost = await updatePost(id, data)
    if  (!updatedPost) {
      return res.status(404).send({
        message: `Post with id ${id} not found`
      })
    }
    const response = createResponseObj(updatedPost, {message: `Post with id ${id} updated successfully`}, 200);
    return res.status(200).send(response);
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong."
    })
  }
})

router.delete('/:id', async (req, res) =>{
  const id = req.params.id;
  try {
    const result = await deletePost(id);
    if (!result) {
      return res.status(404).send({
        message: "Post not found"
      })
    }
    const response = createResponseObj(result, {message: `Post with id ${id} deleted successfully`}, 200);
    return res.status(200).send(response)
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong."
    })
  }
})

module.exports = router