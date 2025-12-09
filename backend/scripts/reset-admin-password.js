import bcrypt from 'bcrypt';
import { pool } from '../src/infrastructure/database/db.js';

const resetAdminPassword = async () => {
  try {
    console.log('🔐 Resetting admin password...');

    // Set a known password for admin
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update admin password
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE email = ? AND role = "admin"',
      [hashedPassword, 'admin@assuronline.com']
    );

    console.log('✅ Admin password reset successfully!');
    console.log('📧 Email: admin@assuronline.com');
    console.log('🔑 Password: admin123');
    console.log('\n🚀 You can now login as admin to test the quotes page!');

  } catch (error) {
    console.error('❌ Error resetting admin password:', error.message);
  } finally {
    await pool.end();
  }
};

resetAdminPassword();
