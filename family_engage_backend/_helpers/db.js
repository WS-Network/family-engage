const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const db = {};

module.exports = db;

initialize();

async function initialize() {
    const { host, port, user, password, database } = config.database;

    try {
        // create db if it doesn't already exist
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

        // connect to db using Sequelize
        const sequelize = new Sequelize(database, user, password, {
            host: host,
            dialect: 'mysql',
            logging: false // Disable logging; default: console.log
        });

        // init models and add them to the exported db object
        db.Account = require('../accounts/account.model')(sequelize);
        db.RefreshToken = require('../accounts/refresh-token.model')(sequelize);

        // define relationships
        db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
        db.RefreshToken.belongsTo(db.Account);
        
        // sync all models with database
        await sequelize.sync();

        console.log('Database connected and models synchronized.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
