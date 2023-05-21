/* eslint-disable no-console */
/* eslint linebreak-style: ["error", "windows"] */
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('catalog_express', 'postgres', 'alam', {
  host: 'localhost',
  dialect: 'postgres',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('Connection database error:', error);
  });

module.exports = sequelize;
