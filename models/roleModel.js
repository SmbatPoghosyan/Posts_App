const { Model } = require('objection');
const User = require('./userModel');

class Role extends Model {
  static get tableName() {
    return 'roles';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['role_name'],
      properties: {
        id: { type: 'integer' },
        role_name: { type: 'string', enum: ['user', 'creator', 'admin', 'superadmin'] }
      }
    };
  }
  

  static get relationMappings() {
    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: 'roles.id',
          to: 'users.role_id'
        }
      }
    };
  }
}

module.exports = Role;