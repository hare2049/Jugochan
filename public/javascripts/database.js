/*Postavlja konekciju i varijablu za bazu podataka.*/
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    database: 'jugochan',
    password: 'jugochansifra',
    host: 'localhost',
    port: 5432,
    max: 100,
    idleTimeoutMillis: 30000,
});

module.exports = pool;