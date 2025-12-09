import bcrypt from 'bcrypt';
import { pool } from '../src/infrastructure/database/db.js';

const seedAdmin = async () => {
  try {
    console.log('🌱 Seeding admin user...');

    // Check if admin already exists
    const [existingAdmin] = await pool.execute('SELECT id FROM users WHERE email = ?', [
      'admin@assuronline.com',
    ]);

    if (existingAdmin.length > 0) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await pool.execute(
      'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, NOW())',
      ['Admin User', 'admin@assuronline.com', hashedPassword, 'admin']
    );

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@assuronline.com');
    console.log('🔑 Password: admin123');
  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
  } finally {
    await pool.end();
  }
};

seedAdmin();
