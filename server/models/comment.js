'use strict';

module.exports = function (sequelize, DataTypes) {
  let Comment = sequelize.define('comment', {
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      field: 'id'
    },
    body: {
      type: DataTypes.STRING,
      field: 'body',
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Comment.belongsTo(models.article, {
          foreignKey: {
            name: 'articleId',
            allowNull: false
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        });
      }
    }
  });
  return Comment;
};