const { DataTypes } = require("sequelize");
const sequelize = require("../../config/Bd");
const bcrypt = require('bcryptjs');

const Users = sequelize.define("users", {
  Id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true 
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(80),  
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true 
  },
  fkRole: {
    type: DataTypes.INTEGER,
    allowNull: true 
  }
}, {
  freezeTableName: true,
  timestamps: false,
  id: false,
  hooks: {
    beforeCreate: async(user) => {
        if(user.password) {
            user.password = await bcrypt.hash(user.password, 8);
        }
    }
  }
});

module.exports = Users;
