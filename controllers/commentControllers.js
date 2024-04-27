const Comment = require("../models/commentModel");
const formateDate = require("../utils/formateDate");

const getComments = async (limit, offset) => {
  try {
    const comments = await Comment.query()
      .limit(limit)
      .offset(offset)
      .select("id", "comment", "creation_date")
      .withGraphFetched("user")
      .modifyGraph("user", (builder) => {
        builder.select("id", "username");
      })
      .withGraphFetched("post")
      .modifyGraph("post", (builder) => {
        builder.select("id", "title", "subtitle", "content", "creation_date");
      })
      .withGraphFetched("post.user")
      .modifyGraph("post.user", (builder) => {
        builder.select("id", "username");
      });
    comments.forEach((comment) => {
      comment.creation_date = formateDate(comment.creation_date);
      if (typeof comment.post.creation_date === "object") {
        comment.post.creation_date = formateDate(comment.post.creation_date);
      }
    });

    const totalCommentsCount = await Comment.query().resultSize();

    return { comments, totalCommentsCount };
  } catch (err) {
    throw new Error(err);
  }
};

const createComment = async (data) => {
  try {
    const newComment = await Comment.query().insert(data);
    return newComment;
  } catch (err) {
    throw new Error(err);
  }
};

const updateComment = async (commentId, data) => {
  try {
    const comment = await Comment.query().patchAndFetchById(commentId, data);
    delete comment.created_at;
    delete comment.updated_at;
    comment.creation_date = formateDate(comment.creation_date);

    return comment;
  } catch (err) {
    throw new Error(err);
  }
};

const getCommentById = async (id) => {
  try {
    const currentComment = await Comment.query()
      .findById(id)
      .select("id", "comment", "creation_date")
      .withGraphFetched("user")
      .modifyGraph("user", (builder) => {
        builder.select("id", "username");
      })
      .withGraphFetched("post")
      .modifyGraph("post", (builder) => {
        builder.select("id", "title", "subtitle", "content", "creation_date");
      })
      .withGraphFetched("post.user")
      .modifyGraph("post.user", (builder) => {
        builder.select("id", "username");
      });
    currentComment.creation_date = formateDate(currentComment.creation_date);
    currentComment.post.creation_date = formateDate(
      currentComment.post.creation_date
    );
    return currentComment;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteComment = async (commentId) => {
  try {
    const res = await Comment.query().deleteById(commentId);
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  getCommentById,
  deleteComment,
};
