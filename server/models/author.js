'use strict';

module.exports = function (sequelize, DataTypes) {
  let Author = sequelize.define('author', {
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    getterMethods: {
      name: function () {
        return `${this.firstName} ${this.lastName}`;
      }
    },
    setterMethods: {
      name: function (value) {
        let names = value.split(' ');
        this.setDataValue('firstName', names.slice(0, -1).join(' '));
        this.setDataValue('lastName', names.slice(-1).join(' '));
      }
    },
    classMethods: {
      associate: (models) => {
        Author.hasMany(models.article, {
          foreignKey: {
            name: 'authorId',
            allowNull: false
          },
          onDelete: 'CASCADE'
        });
      }
    }
  });
  return Author;
};