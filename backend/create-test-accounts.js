import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config();

async function createTestAccounts() {
    console.log('🌱 Creating test accounts...\n');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'assuronline'
    });

    try {
        // Create admin account
        const adminPassword = await bcrypt.hash('admin123', 10);
        await connection.execute(
            `INSERT INTO users (role, name, email, password_hash, phone, address, city, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
            ['admin', 'Admin User', 'admin@assuronline.ma', adminPassword, '0612345678', '123 Admin Street', 'Casablanca', 'active']
        );
        console.log('✅ Admin account created/updated');
        console.log('   Email: admin@assuronline.ma');
        console.log('   Password: admin123\n');

        // Create client account
        const clientPassword = await bcrypt.hash('client123', 10);
        await connection.execute(
            `INSERT INTO users (role, name, email, password_hash, phone, address, city, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
            ['client', 'Client Demo', 'client@assuronline.ma', clientPassword, '0623456789', '456 Client Avenue', 'Rabat', 'active']
        );
        console.log('✅ Client account created/updated');
        console.log('   Email: client@assuronline.ma');
        console.log('   Password: client123\n');

        // Create agent account
        const agentPassword = await bcrypt.hash('agent123', 10);
        await connection.execute(
            `INSERT INTO users (role, name, email, password_hash, phone, address, city, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
            ['agent', 'Agent Demo', 'agent@assuronline.ma', agentPassword, '0634567890', '789 Agent Boulevard', 'Marrakech', 'active']
        );
        console.log('✅ Agent account created/updated');
        console.log('   Email: agent@assuronline.ma');
        console.log('   Password: agent123\n');

        console.log('═══════════════════════════════════════════════════════');
        console.log('🎉 All test accounts created successfully!');
        console.log('═══════════════════════════════════════════════════════\n');

        console.log('📋 LOGIN CREDENTIALS:\n');
        console.log('👤 ADMIN ACCOUNT:');
        console.log('   Email:    admin@assuronline.ma');
        console.log('   Password: admin123\n');

        console.log('👤 CLIENT ACCOUNT:');
        console.log('   Email:    client@assuronline.ma');
        console.log('   Password: client123\n');

        console.log('👤 AGENT ACCOUNT:');
        console.log('   Email:    agent@assuronline.ma');
        console.log('   Password: agent123\n');

        console.log('🌐 Login at: http://localhost:3000');
        console.log('═══════════════════════════════════════════════════════');

    } catch (error) {
        console.error('❌ Error creating test accounts:', error.message);
    } finally {
        await connection.end();
    }
}

createTestAccounts();
