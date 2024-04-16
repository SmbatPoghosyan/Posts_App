const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

const getPosts = async (limit, offset) => {
  try {
    const posts = await Post.query()
      .limit(limit)
      .offset(offset)
      .withGraphFetched("user");

    const totalPostsCount = await Post.query().resultSize();

    return { posts, totalPostsCount };
  } catch (err) {
    throw new Error(err);
  }
};

const createPost = async (post, userId) => {
  post.user_id = userId;
  try {
    const newPost = await Post.query().insert(post);
    return newPost;
  } catch (err) {
    throw new Error(err);
  }
};

const updatePost = async (postId, data) => {
  try {
    return await Post.query().patchAndFetchById(postId, data);
  } catch (err) {
    throw new Error(err);
  }
};

const getPostById = async (id) => {
  try {
    return await Post.query().findById(id);
  } catch (err) {
    throw new Error(err);
  }
};

const deletePost = async (postId) => {
  try {
    const res = await Post.query().deleteById(postId);
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

const createPostComment = async (postId, userId, comment) => {
  try {
    comment.post_id = Number(postId);
    comment.user_id = userId;
    const newComment = await Comment.query().insert(comment);
    return newComment;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  createPost,
  updatePost,
  getPosts,
  deletePost,
  getPostById,
  createPostComment,
};
