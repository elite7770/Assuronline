import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function up(knex) {
  const schemaPath = path.join(__dirname, '..', 'database', 'assuronline_complete.sql');
  const sql = await fs.readFile(schemaPath, 'utf8');

  // Split by semicolons and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => {
      // Filter out empty statements, comments, and database creation/use statements
      if (!s || s.length === 0) return false;
      if (s.startsWith('--')) return false;
      if (s.match(/^\s*(DROP|CREATE)\s+DATABASE/i)) return false;
      if (s.match(/^\s*USE\s+/i)) return false;
      return true;
    });

  for (const statement of statements) {
    try {
      await knex.raw(statement);
    } catch (error) {
      // Log but continue if table already exists
      if (!error.message.includes('already exists')) {
        throw error;
      }
    }
  }
}

export async function down(knex) {
  // Drop all tables in reverse dependency order
  const tables = [
    'user_settings', 'file_storage', 'audit_logs', 'system_settings',
    'invoices', 'notifications', 'payments', 'claims', 'policies',
    'quotes', 'vehicles', 'moroccan_cities', 'coverage_types',
    'vehicle_models', 'vehicle_brands', 'users'
  ];

  for (const table of tables) {
    await knex.schema.dropTableIfExists(table);
  }
}
