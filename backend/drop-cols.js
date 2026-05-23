const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123456',
  database: 'hoangnam_clothing_db',
});

async function run() {
  await client.connect();
  try {
    await client.query(`
      ALTER TABLE order_items 
      DROP COLUMN IF EXISTS "productName", 
      DROP COLUMN IF EXISTS "sku", 
      DROP COLUMN IF EXISTS "color", 
      DROP COLUMN IF EXISTS "size";
    `);
    console.log('Columns dropped successfully.');
  } catch (err) {
    console.error('Error dropping columns:', err);
  } finally {
    await client.end();
  }
}

run();
