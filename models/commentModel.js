const { Model } = require('objection');
const User = require('./userModel');
const Post = require('./postModel');

class Comment extends Model {
  static get tableName() {
    return 'comments';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'post_id', 'comment'],
      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        post_id: { type: 'integer' },
        comment: { type: 'string', minLength: 1 },
        creation_date: { type: 'string', format: 'date' }
      }
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'comments.user_id',
          to: 'users.id'
        }
      },
      post: {
        relation: Model.BelongsToOneRelation,
        modelClass: Post,
        join: {
          from: 'comments.post_id',
          to: 'posts.id'
        }
      }
    };
  }
}

module.exports = Comment;
