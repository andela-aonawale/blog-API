'use strict';

module.exports = function (sequelize, DataTypes) {
  let User = sequelize.define('author', {
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      field: 'id'
    },
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name',
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
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
        User.hasMany(models.article, {
          onDelete: 'CASCADE'
        });
      }
    }
  });
  return User;
};