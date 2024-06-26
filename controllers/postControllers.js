const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const Image = require("../models/imageModel");
const PostImage = require("../models/postImageModel");
const formateDate = require("../utils/formateDate");
const PostFollowers = require("../models/postFollowersModel");

const getPosts = async (limit, offset, withComments = false) => {
  try {
    if (withComments) {
      const posts = await Post.query()
        .limit(limit)
        .offset(offset)
        .withGraphFetched("user")
        .modifyGraph("user", (builder) => {
          builder.select("id", "username");
        })
        .select("id", "title", "content", "creation_date", "view_count")
        .withGraphFetched("comments")
        .modifyGraph("comments", (builder) => {
          builder.select("id", "user_id", "comment", "creation_date");
        })
        .withGraphFetched("comments.user")
        .modifyGraph("comments.user", (builder) => {
          builder.select("id", "username");
        });

      posts.forEach((post) => {
        post.creation_date = formateDate(post.creation_date);
        post.comments.forEach((comment) => {
          comment.creation_date = formateDate(comment.creation_date);
        });
      });

      const totalPostsCount = await Post.query().resultSize();
      return { posts, totalPostsCount };
    } else {
      const posts = await Post.query()
        .limit(limit)
        .offset(offset)
        .withGraphFetched("user")
        .modifyGraph("user", (builder) => {
          builder.select("id", "username");
        })
        .select("id", "title", "content", "creation_date", "view_count");

      posts.forEach((post) => {
        post.creation_date = formateDate(post.creation_date);
      });

      const totalPostsCount = await Post.query().resultSize();
      return { posts, totalPostsCount };
    }
  } catch (err) {
    throw new Error(err);
  }
};

const createPost = async (post, userId, images) => {
  try {
    post.user_id = userId;
    let newImagespath = "";
    const newPost = await Post.query().insert(post);
    const post_id = newPost.id;
    for (let i = 0; i < images.length; i++) {
      const newImage = await Image.query().insert(images[i]);
      const image_id = newImage.id;
      await PostImage.query().insert({ image_id, post_id });
      if (i < images.length - 1) {
        newImagespath += `${images[i].url} ; `;
      } else {
        newImagespath += `${images[i].url}.`;
      }
    }
    newPost.images = [newImagespath];
    return newPost;
  } catch (err) {
    throw new Error(err);
  }
};

const updatePost = async (postId, data) => {
  try {
    const post = await Post.query().patchAndFetchById(postId, data);
    delete post.created_at;
    delete post.updated_at;
    delete post.view_count;
    post.creation_date = formateDate(post.creation_date);

    return post;
  } catch (err) {
    throw new Error(err);
  }
};

const getPostById = async (id, withComments = false) => {
  try {
    if (withComments) {
      const post = await Post.query()
        .findById(id)
        .withGraphFetched("user")
        .modifyGraph("user", (builder) => {
          builder.select("id", "username");
        })
        .select("id", "title", "content", "creation_date", "view_count")
        .withGraphFetched("comments")
        .modifyGraph("comments", (builder) => {
          builder.select("id", "user_id", "comment", "creation_date");
        })
        .withGraphFetched("comments.user")
        .modifyGraph("comments.user", (builder) => {
          builder.select("id", "username");
        });
      post.creation_date = formateDate(post.creation_date);
      post.comments.forEach((el) => {
        el.creation_date = formateDate(el.creation_date);
      });

      return post;
    } else {
      const post = await Post.query()
        .findById(id)
        .withGraphFetched("user")
        .modifyGraph("user", (builder) => {
          builder.select("id", "username");
        })
        .select("id", "title", "content", "creation_date", "view_count");
      post.creation_date = formateDate(post.creation_date);
      return post;
    }
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

const getCreatorsPosts = async (userId) => {
  try {
    const posts = await Post.query().find({ user_id: userId });
    return posts;
  } catch (err) {
    throw new Error(err);
  }
};

const followPost = async (postId, userId) => {
  try {
    const res = await PostFollowers.query().insert({
      post_id: postId,
      user_id: userId,
    });
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

const unfollowPost = async (postId, userId) => {
  try {
    const res = await PostFollowers.query()
      .delete()
      .where({ post_id: postId, user_id: userId });
    if (res === 0) {
      throw new Error("Post not found");
    }
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

const uploadPostImages = async (id, images) => {
  try {
    let newImagespath = "";
    const post_id = id;
    for (let i = 0; i < images.length; i++) {
      const newImage = await Image.query().insert(images[i]);
      const image_id = newImage.id;
      await PostImage.query().insert({ image_id, post_id });
      if (i < images.length - 1) {
        newImagespath += `${images[i].url} ; `;
      } else {
        newImagespath += `${images[i].url}.`;
      }
    }
    const post = await Post.query().findById(id).withGraphFetched("images");
    return post;
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
  getCreatorsPosts,
  followPost,
  unfollowPost,
};
