const sequelize = require('../db/db');
const modelMap = require('../models/models');


const ACTIONS = new Set(['sync', 'syncForce', 'syncAll', 'syncAllForce', 'drop', 'dropAll']);

const args = process.argv.slice(2);
if (args.length === 0 || !ACTIONS.has(args[0])) {
    console.log('No action provided or invalid action, abort.');
    for (let action of ACTIONS) {
        console.log(`   - ${action}`);
    }
    process.exit(1);
}


const action = args[0];
const tables = args.slice(1);

for (let table of tables) {
    if (!modelMap.has(table)) {
        console.log(`Unknown table: ${table}`);
        process.exit(1);
    }
}

switch (action) {
    case 'sync':
        Promise.all(tables.map( (table) => modelMap.get(table).sync() ))
                .then(() => beforeDone());
        break;
    case 'syncForce':
        Promise.all(tables.map( (table) => modelMap.get(table).sync({ force: true }) ))
                .then(() => beforeDone());
        break;
    case 'syncAll':
        sequelize.sync().then(() => beforeDone());
        break;
    case 'syncAllForce':
        sequelize.sync({ force: true }).then(() => beforeDone());
        break;
    case 'drop':
        Promise.all(tables.map( (table) => modelMap.get(table).drop() ))
                .then(() => beforeDone());
        break;
    case 'dropAll':
        sequelize.drop().then(() => beforeDone());
        break;
    default:
        console.error('Unexpected state, abort.');
        process.exit(1);
}

function beforeDone() {
    console.log('Done.');
    process.exit(0);
}
