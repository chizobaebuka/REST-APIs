const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV !== 'production' ? 'development' : 'production';
const config = require('./config')[env];

const sequelize = new Sequelize(config);

module.exports = sequelize;