const { DataTypes } = require("sequelize");
const sequelize = require("../../config/Bd");

const Scheduling = sequelize.define("scheduling", {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fkUser: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    numberPhone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    direction: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ScheduledDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    typeService: {
        type: DataTypes.STRING,
        allowNull: false
    },
    document: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = Scheduling;
