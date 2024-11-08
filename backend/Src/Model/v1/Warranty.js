const {DataTypes} = require("sequelize");
const sequelize = require("../../config/Bd");

const Warranty = sequelize.define("warranty",{
    Id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    clientNumber:{
        type: DataTypes.STRING,
        allowNull: false
    },
    brand:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fkuser:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    place:{
        type: DataTypes.STRING,
        allowNull: false
    }
 }, {
    freezeTableName: true,
    timestamps: false,
 });

module.exports = Warranty;