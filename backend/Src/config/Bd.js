const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  'industrycaina',
  'pwalker',          
  'pwalker2024',   
  {
    dialect: 'mysql', 
    host: 'localhost', 
    port: 3306,       
    dialectOptions: {
      connectTimeout: 60000, 
    },
    pool: {
      max: 5,              
      min: 0,              
      acquire: 30000,      
      idle: 10000,       
    },
  }
);

module.exports = sequelize;


