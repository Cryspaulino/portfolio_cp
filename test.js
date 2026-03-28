import pkg from 'pg';
const { Pool } = pkg;

console.log('Pool:', Pool);

const pool = new Pool();
console.log('Pool created successfully');