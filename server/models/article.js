'use strict';

module.exports = function (sequelize, DataTypes) {
  let Article = sequelize.define('article', {
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Article.hasMany(models.comment, {
          foreignKey: {
            name: 'articleId',
            allowNull: false
          },
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