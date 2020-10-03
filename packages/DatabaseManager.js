const Sequelize = require('sequelize');
const fs = require('fs');

exports.DatabaseManager = class {
    #sequelize;
    #tables;
    
    constructor(path) {
        this.dbConnect(path);
    }

    dbConnect(models_path) {
        this.#sequelize = new Sequelize('database', 'user', 'passoword', {
            host: 'localhost',
            dialect: 'sqlite',
            logging: false,
            
            storage: 'database.sqlite',
        });

        this.#tables = {};
        fs.readdirSync(models_path)
            .filter(f => f.endsWith('.js'))
            .forEach(t => {
                const table = this.#sequelize.import(models_path+t);
                this.#tables[table.name] = table;
            });
        console.log(this.#tables);
    }

    async fetch(table, params) {
        return await this.#tables[table].findOne({where: params});
    }

    async fetchAll(table, params) {
        return await this.#tables[table].findAll({where: params});
    }

    async insert(table, params) {
        try {
            return await this.#tables[table].create(params);
        } catch(e) {
            if (e.name === 'SequelizeUniqueConstraintError')
                return {error: 'That entry already exists.'};
            return {error: 'Something went wrong with adding an entry.'};
        }
    }

    async upsert(table, params) {
        try {
            return await this.#tables[table].upsert(params);
        } catch(e) {
            if (e.name === 'SequelizeUniqueConstraintError')
                return {error: 'That entry already exists.'};
            return {error: 'Something went wrong with adding an entry.'};
        }
    }

    async update(table, args, data) {
        const numRows = await this.#tables[table].update(data, {where: args});
        if(numRows == 0)
            return {error: 'No entries to update.'}
        else return numRows;
    }

    async delete(table, params) {
        let rowCount = await this.#tables[table].destroy({where: params});
        if(!rowCount) return {error: 'That entry never existed.'};
    }
}