'use strict';

module.exports = function (sequelize, DataTypes) {
  let Comment = sequelize.define('comment', {
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Comment.belongsTo(models.article, {
          as: 'Article',
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