const {DataTypes} = require("sequelize");
const sequelize = require("../../config/Bd");

const Quotes = sequelize.define("quotes",{
    Id:{
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
    },
    fkUser:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    nameNewUser:{
        type: DataTypes.STRING,
        allowNull: false
    },
    emailNewUser:{
        type: DataTypes.STRING,
        allowNull: false
    },
    numberPhone: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    information:{
        type: DataTypes.TEXT,
        allowNull: false
    }
},{
    freezeTableName: true,
    timestamps: false,
    id: false
 
});

module.exports = Quotes;