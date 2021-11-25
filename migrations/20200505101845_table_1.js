const config = require('../src/api/config');

const tableName = config.tables.actionPlans;

exports.up = function(knex) {
    return knex.schema.createTable(tableName, (table) => {
        table.increments('id');
    });
};
exports.down = function(knex) {
    return knex.schema.dropTable(tableName);
};
