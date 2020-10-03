const Sequelize = require('sequelize');
const fs = require('fs');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

fs.readdirSync("./models/").filter(f => f.endsWith('.js')).forEach(table => {
    sequelize.import('./models/' + table);
});

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);
