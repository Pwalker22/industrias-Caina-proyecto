const {DataTypes} = require("sequelize");
const sequelize = require("../../config/Bd");

const Complaints = sequelize.define("complaints",{
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
    fkUser:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    phoneNumber:{
        type: DataTypes.STRING,
        allowNull: false
    },
    client:{
        type: DataTypes.STRING,
        allowNull: false
    },
    ComplaintType:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    freezeTableName: true,
    timestamps: false,
 });

module.exports = Complaints;