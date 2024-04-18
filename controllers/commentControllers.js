const Comment = require("../models/commentModel");

const getComments = async (limit, offset) => {
  try {
    const comments = await Comment.query()
      .limit(limit)
      .offset(offset)
      .withGraphFetched("user");

    const totalCommentsCount = await Comment.query().resultSize();

    return { comments, totalCommentsCount };
  } catch (err) {
    throw new Error(err);
  }
};

const createComment = async (comment, userId) => {
  comment.user_id = userId;
  try {
    const newComment = await Comment.query().insert(comment);
    return newComment;
  } catch (err) {
    throw new Error(err);
  }
};

const updateComment = async (commentId, data) => {
  try {
    return await Comment.query().patchAndFetchById(commentId, data);
  } catch (err) {
    throw new Error(err);
  }
};

const getCommentById = async (id) => {
  try {
    return await Comment.query().findById(id);
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
