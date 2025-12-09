import bcrypt from 'bcrypt';
import { pool } from '../src/infrastructure/database/db.js';

const seedSampleData = async () => {
  try {
    console.log('🌱 Seeding sample data...');

    // Create sample users
    const users = [
      {
        name: 'Ahmed Benali',
        email: 'ahmed.benali@email.com',
        password: 'password123',
        role: 'client',
        phone: '+212612345678',
        address: '123 Avenue Mohammed V, Casablanca',
        city: 'Casablanca',
        postal_code: '20000'
      },
      {
        name: 'Fatima Alami',
        email: 'fatima.alami@email.com',
        password: 'password123',
        role: 'client',
        phone: '+212612345679',
        address: '456 Rue Hassan II, Rabat',
        city: 'Rabat',
        postal_code: '10000'
      },
      {
        name: 'Omar Tazi',
        email: 'omar.tazi@email.com',
        password: 'password123',
        role: 'client',
        phone: '+212612345680',
        address: '789 Boulevard Zerktouni, Casablanca',
        city: 'Casablanca',
        postal_code: '20000'
      },
      {
        name: 'Aicha Mansouri',
        email: 'aicha.mansouri@email.com',
        password: 'password123',
        role: 'client',
        phone: '+212612345681',
        address: '321 Avenue de France, Marrakech',
        city: 'Marrakech',
        postal_code: '40000'
      }
    ];

    const userIds = [];
    for (const user of users) {
      // Check if user already exists
      const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [user.email]);
      if (existing.length > 0) {
        userIds.push(existing[0].id);
        console.log('User already exists:', user.email);
      } else {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const [result] = await pool.execute(
          'INSERT INTO users (name, email, password_hash, role, phone, address, city, postal_code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
          [user.name, user.email, hashedPassword, user.role, user.phone, user.address, user.city, user.postal_code]
        );
        userIds.push(result.insertId);
      }
    }

    console.log('✅ Created', users.length, 'sample users');

    // Create sample vehicles
    const vehicles = [
      {
        user_id: userIds[0],
        brand: 'Renault',
        model: 'Clio',
        year: 2020,
        color: 'Blanc',
        license_plate: 'A-12345',
        chassis_number: 'VF1234567891',
        vehicle_type: 'car',
        fuel_type: 'essence',
        engine_size: 1.2,
        current_value: 85000
      },
      {
        user_id: userIds[1],
        brand: 'BMW',
        model: 'X5',
        year: 2021,
        color: 'Noir',
        license_plate: 'B-67890',
        chassis_number: 'WBA1234567890',
        vehicle_type: 'car',
        fuel_type: 'diesel',
        engine_size: 3.0,
        current_value: 450000
      },
      {
        user_id: userIds[2],
        brand: 'Honda',
        model: 'CBR 600',
        year: 2019,
        color: 'Rouge',
        license_plate: 'M-11111',
        chassis_number: 'JH2SC1234567890',
        vehicle_type: 'moto',
        fuel_type: 'essence',
        engine_size: 0.6,
        current_value: 65000
      },
      {
        user_id: userIds[3],
        brand: 'Peugeot',
        model: '3008',
        year: 2022,
        color: 'Bleu',
        license_plate: 'C-99999',
        chassis_number: 'VF1234567892',
        vehicle_type: 'car',
        fuel_type: 'essence',
        engine_size: 1.6,
        current_value: 180000
      }
    ];

    const vehicleIds = [];
    for (const vehicle of vehicles) {
      // Check if vehicle already exists
      const [existing] = await pool.execute('SELECT id FROM vehicles WHERE license_plate = ?', [vehicle.license_plate]);
      if (existing.length > 0) {
        vehicleIds.push(existing[0].id);
        console.log('Vehicle already exists:', vehicle.license_plate);
      } else {
        const [result] = await pool.execute(
          'INSERT INTO vehicles (user_id, brand, model, year, color, license_plate, chassis_number, vehicle_type, fuel_type, engine_size, current_value, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
          [vehicle.user_id, vehicle.brand, vehicle.model, vehicle.year, vehicle.color, vehicle.license_plate, vehicle.chassis_number, vehicle.vehicle_type, vehicle.fuel_type, vehicle.engine_size, vehicle.current_value]
        );
        vehicleIds.push(result.insertId);
      }
    }

    console.log('✅ Created', vehicles.length, 'sample vehicles');

    // Create sample quotes
    const quotes = [
      {
        user_id: userIds[0],
        vehicle_id: vehicleIds[0],
        quote_number: 'QUO-2024-000001',
        type: 'car',
        coverage_type: 'standard',
        base_premium: 2500,
        final_premium: 2500,
        status: 'approved',
        valid_until: '2024-12-31'
      },
      {
        user_id: userIds[1],
        vehicle_id: vehicleIds[1],
        quote_number: 'QUO-2024-000002',
        type: 'car',
        coverage_type: 'premium',
        base_premium: 4500,
        final_premium: 4500,
        status: 'pending',
        valid_until: '2024-12-31'
      },
      {
        user_id: userIds[2],
        vehicle_id: vehicleIds[2],
        quote_number: 'QUO-2024-000003',
        type: 'moto',
        coverage_type: 'standard',
        base_premium: 1200,
        final_premium: 1200,
        status: 'approved',
        valid_until: '2024-12-31'
      },
      {
        user_id: userIds[3],
        vehicle_id: vehicleIds[3],
        quote_number: 'QUO-2024-000004',
        type: 'car',
        coverage_type: 'basique',
        base_premium: 1800,
        final_premium: 1800,
        status: 'rejected',
        valid_until: '2024-12-31'
      }
    ];

    const quoteIds = [];
    for (const quote of quotes) {
      const [result] = await pool.execute(
        'INSERT INTO quotes (user_id, vehicle_id, quote_number, type, coverage_type, base_premium, final_premium, status, valid_until, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [quote.user_id, quote.vehicle_id, quote.quote_number, quote.type, quote.coverage_type, quote.base_premium, quote.final_premium, quote.status, quote.valid_until]
      );
      quoteIds.push(result.insertId);
    }

    console.log('✅ Created', quotes.length, 'sample quotes');

    // Create sample policies
    const policies = [
      {
        user_id: userIds[0],
        vehicle_id: vehicleIds[0],
        quote_id: quoteIds[0],
        policy_number: 'POL-2024-000001',
        type: 'car',
        coverage_type: 'standard',
        premium_amount: 2500,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        status: 'active'
      },
      {
        user_id: userIds[2],
        vehicle_id: vehicleIds[2],
        quote_id: quoteIds[2],
        policy_number: 'POL-2024-000002',
        type: 'moto',
        coverage_type: 'standard',
        premium_amount: 1200,
        start_date: '2024-02-01',
        end_date: '2025-01-31',
        status: 'active'
      }
    ];

    const policyIds = [];
    for (const policy of policies) {
      const [result] = await pool.execute(
        'INSERT INTO policies (user_id, vehicle_id, quote_id, policy_number, type, coverage_type, premium_amount, start_date, end_date, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [policy.user_id, policy.vehicle_id, policy.quote_id, policy.policy_number, policy.type, policy.coverage_type, policy.premium_amount, policy.start_date, policy.end_date, policy.status]
      );
      policyIds.push(result.insertId);
    }

    console.log('✅ Created', policies.length, 'sample policies');

    // Create sample payments
    const payments = [
      {
        user_id: userIds[0],
        policy_id: policyIds[0],
        amount: 2500,
        payment_method: 'bank_transfer',
        status: 'paid',
        paid_date: '2024-01-01'
      },
      {
        user_id: userIds[2],
        policy_id: policyIds[1],
        amount: 1200,
        payment_method: 'credit_card',
        status: 'paid',
        paid_date: '2024-02-01'
      }
    ];

    for (const payment of payments) {
      await pool.execute(
        'INSERT INTO payments (user_id, policy_id, amount, payment_method, status, paid_date, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [payment.user_id, payment.policy_id, payment.amount, payment.payment_method, payment.status, payment.paid_date]
      );
    }

    console.log('✅ Created', payments.length, 'sample payments');

    // Create sample claims
    const claims = [
      {
        user_id: userIds[0],
        policy_id: policyIds[0],
        claim_number: 'CLM-2024-000001',
        claim_type: 'accident',
        incident_date: '2024-06-15',
        incident_location: 'Casablanca',
        incident_description: 'Collision avec un autre véhicule',
        estimated_amount: 15000,
        status: 'pending'
      },
      {
        user_id: userIds[2],
        policy_id: policyIds[1],
        claim_number: 'CLM-2024-000002',
        claim_type: 'theft',
        incident_date: '2024-07-10',
        incident_location: 'Rabat',
        incident_description: 'Vol de moto',
        estimated_amount: 65000,
        status: 'approved'
      }
    ];

    for (const claim of claims) {
      await pool.execute(
        'INSERT INTO claims (user_id, policy_id, claim_number, claim_type, incident_date, incident_location, incident_description, estimated_amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [claim.user_id, claim.policy_id, claim.claim_number, claim.claim_type, claim.incident_date, claim.incident_location, claim.incident_description, claim.estimated_amount, claim.status]
      );
    }

    console.log('✅ Created', claims.length, 'sample claims');

    console.log('🎉 Sample data seeding completed successfully!');
    console.log('📊 Dashboard should now show real data');

  } catch (error) {
    console.error('❌ Error seeding sample data:', error.message);
  } finally {
    await pool.end();
  }
};

seedSampleData();
