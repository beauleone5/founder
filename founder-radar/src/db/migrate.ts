import { readFileSync } from 'fs';
import { join } from 'path';
import db from './database';

async function runMigrations() {
  console.log('Starting database migrations...');

  try {
    const schemaSQL = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');

    await db.query(schemaSQL);

    console.log('✓ Database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
