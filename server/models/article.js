'use strict';

module.exports = function (sequelize, DataTypes) {
  let Article = sequelize.define('article', {
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      field: 'id'
    },
    title: {
      type: DataTypes.STRING,
      field: 'title',
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      field: 'body',
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Article.hasMany(models.comment, {
          onDelete: 'CASCADE'
        });
        Article.belongsTo(models.author, {
          foreignKey: {
            name: 'authorId',
            allowNull: false
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        });
      }
    }
  });
  return Article;
};