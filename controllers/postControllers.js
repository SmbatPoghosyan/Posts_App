const fs = require('fs');
const Post = require('../models/postModel')
const postsFilePath = "./posts.json";

const getPosts = async (limit, offset) => {
  try {
    const posts = await Post.query()
      .limit(limit)
      .offset(offset)
      .withGraphFetched('user');
    
    const totalPostsCount  = await Post.query().resultSize();

    return { posts, totalPostsCount};
  } catch (err) {
    throw new Error(err);
  }
}

const createPost = async (post) => {
  try {
    const newPost = await Post.query().insert(post)
    return newPost
  } catch (err) {
    throw new Error(err);
  }
}

const updatePost = async (postId, data) => {
  try {
    const updatedPost = await Post.query().patchAndFetchById(postId, data);
    return updatedPost
  } catch (err) {
    throw new Error(err);
  }
}

const deletePost = (receivedPosts, postIndex) => {
  receivedPosts.splice(postIndex, 1)
  return new Promise((resolve, reject) => {
    fs.writeFile(postsFilePath, JSON.stringify(receivedPosts), (err) => {
      if (err) {
        console.error(err.message);
        reject(err);
      }
      resolve()
    })  
  })
}

module.exports = {
  createPost,
  updatePost, 
  getPosts, 
  deletePost,
}