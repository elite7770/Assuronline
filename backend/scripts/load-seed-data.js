import fs from 'fs/promises';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function loadSeedData() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });

    console.log('Connected to MySQL database');

    // Read and execute seed data
    const seedPath = './database/seed_data.sql';
    const sql = await fs.readFile(seedPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log('✓ Executed statement');
        } catch (error) {
          console.log('⚠ Skipped statement (might already exist):', error.message);
        }
      }
    }

    console.log('✅ Seed data loaded successfully!');
    await connection.end();
  } catch (error) {
    console.error('❌ Error loading seed data:', error);
    process.exit(1);
  }
}

loadSeedData();


