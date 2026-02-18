import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

dotenv.config();

async function seedRealisticData() {
    console.log('🌱 Seeding realistic data for AssurOnline...\n');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'assuronline'
    });

    try {
        // 1. Create realistic users (clients)
        console.log('👥 Creating users...');
        const password = await bcrypt.hash('password123', 10);

        const users = [
            ['client', 'Mohammed Alami', 'mohammed.alami@gmail.com', password, '0661234567', '12 Rue Hassan II', 'Casablanca', '20000', '1985-03-15', 'DL123456', '2010-05-20', 'active'],
            ['client', 'Fatima Bennani', 'fatima.bennani@gmail.com', password, '0662345678', '45 Avenue Mohammed V', 'Rabat', '10000', '1990-07-22', 'DL234567', '2012-08-15', 'active'],
            ['client', 'Youssef Tazi', 'youssef.tazi@gmail.com', password, '0663456789', '78 Boulevard Zerktouni', 'Casablanca', '20100', '1988-11-30', 'DL345678', '2011-03-10', 'active'],
            ['client', 'Amina El Fassi', 'amina.elfassi@gmail.com', password, '0664567890', '23 Rue de la Liberté', 'Marrakech', '40000', '1992-05-18', 'DL456789', '2013-06-25', 'active'],
            ['client', 'Karim Idrissi', 'karim.idrissi@gmail.com', password, '0665678901', '56 Avenue des FAR', 'Fès', '30000', '1987-09-12', 'DL567890', '2010-11-30', 'active'],
            ['client', 'Sanaa Berrada', 'sanaa.berrada@gmail.com', password, '0666789012', '89 Rue Allal Ben Abdellah', 'Rabat', '10100', '1991-02-28', 'DL678901', '2014-01-15', 'active'],
            ['client', 'Omar Benjelloun', 'omar.benjelloun@gmail.com', password, '0667890123', '34 Boulevard Moulay Youssef', 'Casablanca', '20200', '1986-12-05', 'DL789012', '2009-07-20', 'active'],
            ['client', 'Laila Chraibi', 'laila.chraibi@gmail.com', password, '0668901234', '67 Avenue Hassan II', 'Agadir', '80000', '1993-08-14', 'DL890123', '2015-04-10', 'active'],
            ['agent', 'Ahmed Mansouri', 'ahmed.mansouri@assuronline.ma', password, '0669012345', '12 Rue des Agents', 'Casablanca', '20000', '1980-04-10', null, null, 'active'],
            ['agent', 'Nadia Ziani', 'nadia.ziani@assuronline.ma', password, '0660123456', '45 Avenue des Agents', 'Rabat', '10000', '1982-06-15', null, null, 'active']
        ];

        for (const user of users) {
            await connection.execute(
                `INSERT INTO users (role, name, email, password_hash, phone, address, city, postal_code, birth_date, driving_license_number, license_issue_date, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                user
            );
        }
        console.log(`✅ Created ${users.length} users\n`);

        // Get user IDs
        const [userRows] = await connection.execute('SELECT id, role, name FROM users ORDER BY id');
        const clients = userRows.filter(u => u.role === 'client');
        const agents = userRows.filter(u => u.role === 'agent');

        // 2. Create vehicles
        console.log('🚗 Creating vehicles...');
        const vehicles = [
            [clients[0].id, 'Dacia', 'Logan', 2020, 'Blanc', 'A-12345-20', 'VF1XXXXXXXX123456', 'ENG123456', '2020-01-15', 85000, 80000, 'car', 'essence', 1.2],
            [clients[0].id, 'Renault', 'Clio', 2019, 'Gris', 'A-23456-19', 'VF1XXXXXXXX234567', 'ENG234567', '2019-06-20', 95000, 85000, 'car', 'diesel', 1.5],
            [clients[1].id, 'Peugeot', '208', 2021, 'Rouge', 'B-34567-21', 'VF3XXXXXXXX345678', 'ENG345678', '2021-03-10', 120000, 115000, 'car', 'essence', 1.2],
            [clients[2].id, 'Volkswagen', 'Golf', 2018, 'Noir', 'A-45678-18', 'WVW XXXXXXXX456789', 'ENG456789', '2018-09-25', 180000, 160000, 'car', 'diesel', 2.0],
            [clients[3].id, 'Toyota', 'Corolla', 2022, 'Blanc', 'C-56789-22', 'JTD XXXXXXXX567890', 'ENG567890', '2022-01-05', 200000, 195000, 'car', 'hybride', 1.8],
            [clients[4].id, 'Hyundai', 'i20', 2020, 'Bleu', 'D-67890-20', 'KMH XXXXXXXX678901', 'ENG678901', '2020-07-15', 110000, 100000, 'car', 'essence', 1.4],
            [clients[5].id, 'Citroën', 'C3', 2019, 'Gris', 'B-78901-19', 'VF7XXXXXXXX789012', 'ENG789012', '2019-11-20', 130000, 115000, 'car', 'diesel', 1.6],
            [clients[6].id, 'Fiat', '500', 2021, 'Rouge', 'A-89012-21', 'ZFA XXXXXXXX890123', 'ENG890123', '2021-04-30', 95000, 90000, 'car', 'essence', 1.0],
            [clients[7].id, 'Honda', 'CB500', 2020, 'Noir', 'M-90123-20', 'JH2XXXXXXXX901234', 'ENG901234', '2020-05-10', 45000, 42000, 'moto', 'essence', 0.5],
            [clients[1].id, 'Yamaha', 'MT-07', 2021, 'Bleu', 'M-01234-21', 'JYA XXXXXXXX012345', 'ENG012345', '2021-08-15', 55000, 52000, 'moto', 'essence', 0.7]
        ];

        for (const vehicle of vehicles) {
            await connection.execute(
                `INSERT INTO vehicles (user_id, brand, model, year, color, license_plate, chassis_number, engine_number, purchase_date, purchase_price, current_value, vehicle_type, fuel_type, engine_size) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                vehicle
            );
        }
        console.log(`✅ Created ${vehicles.length} vehicles\n`);

        // Get vehicle IDs
        const [vehicleRows] = await connection.execute('SELECT id, user_id, vehicle_type FROM vehicles ORDER BY id');

        // 3. Create quotes
        console.log('📋 Creating quotes...');
        const quotes = [];
        const statuses = ['pending', 'approved', 'approved', 'approved', 'rejected'];
        const coverageTypes = {
            car: ['basique', 'standard', 'premium'],
            moto: ['essentiel', 'confort', 'ultimate']
        };

        for (let i = 0; i < vehicleRows.length; i++) {
            const vehicle = vehicleRows[i];
            const status = statuses[i % statuses.length];
            const coverages = coverageTypes[vehicle.vehicle_type];
            const coverage = coverages[i % coverages.length];
            const basePremium = vehicle.vehicle_type === 'car' ? 3000 + (i * 500) : 1500 + (i * 300);
            const finalPremium = basePremium * (1 + (i % 3) * 0.1);
            const monthlyPremium = finalPremium / 12;
            const quoteNumber = `Q-2024-${String(1000 + i).padStart(5, '0')}`;
            const validUntil = new Date();
            validUntil.setDate(validUntil.getDate() + 30);

            quotes.push([
                vehicle.user_id,
                vehicle.id,
                quoteNumber,
                vehicle.vehicle_type,
                coverage,
                JSON.stringify({
                    responsabilite_civile: true,
                    defense_recours: coverage !== 'basique',
                    assistance: coverage === 'premium' || coverage === 'ultimate',
                    vol: coverage !== 'basique',
                    incendie: true,
                    bris_glace: coverage === 'premium' || coverage === 'ultimate'
                }),
                basePremium,
                JSON.stringify({
                    age_conducteur: 0.1,
                    experience: -0.05,
                    ville: 0.05
                }),
                finalPremium,
                monthlyPremium,
                status,
                status === 'rejected' ? 'Profil à risque élevé' : null,
                validUntil.toISOString().split('T')[0]
            ]);
        }

        for (const quote of quotes) {
            await connection.execute(
                `INSERT INTO quotes (user_id, vehicle_id, quote_number, type, coverage_type, coverage_options, base_premium, risk_factors, final_premium, monthly_premium, status, admin_comment, valid_until) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                quote
            );
        }
        console.log(`✅ Created ${quotes.length} quotes\n`);

        // Get approved quotes
        const [approvedQuotes] = await connection.execute('SELECT id, user_id, vehicle_id, type, coverage_type, final_premium FROM quotes WHERE status = "approved"');

        // 4. Create policies
        console.log('📄 Creating policies...');
        const policies = [];

        for (let i = 0; i < approvedQuotes.length; i++) {
            const quote = approvedQuotes[i];
            const policyNumber = `POL-2024-${String(5000 + i).padStart(6, '0')}`;
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - (i % 6)); // Policies started 0-5 months ago
            const endDate = new Date(startDate);
            endDate.setFullYear(endDate.getFullYear() + 1);
            const nextPaymentDate = new Date();
            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
            const policyStatus = i % 8 === 0 ? 'expired' : (i % 10 === 0 ? 'suspended' : 'active');

            policies.push([
                quote.user_id,
                quote.vehicle_id,
                quote.id,
                policyNumber,
                quote.type,
                quote.coverage_type,
                JSON.stringify({
                    responsabilite_civile: true,
                    defense_recours: true,
                    assistance: quote.coverage_type === 'premium' || quote.coverage_type === 'ultimate',
                    vol: true,
                    incendie: true,
                    bris_glace: quote.coverage_type === 'premium' || quote.coverage_type === 'ultimate'
                }),
                quote.final_premium,
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0],
                policyStatus,
                i % 3 === 0 ? 'monthly' : (i % 3 === 1 ? 'quarterly' : 'annually'),
                nextPaymentDate.toISOString().split('T')[0],
                true
            ]);
        }

        for (const policy of policies) {
            await connection.execute(
                `INSERT INTO policies (user_id, vehicle_id, quote_id, policy_number, type, coverage_type, coverage_details, premium_amount, start_date, end_date, status, payment_frequency, next_payment_date, auto_renewal) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                policy
            );
        }
        console.log(`✅ Created ${policies.length} policies\n`);

        // Get policy IDs
        const [policyRows] = await connection.execute('SELECT id, user_id, premium_amount FROM policies WHERE status = "active"');

        // 5. Create claims
        console.log('🚨 Creating claims...');
        const claims = [];
        const claimTypes = ['accident', 'theft', 'fire', 'damage', 'other'];
        const claimStatuses = ['pending', 'in_review', 'approved', 'rejected', 'settled'];

        for (let i = 0; i < Math.min(policyRows.length, 8); i++) {
            const policy = policyRows[i];
            const claimNumber = `CLM-2024-${String(3000 + i).padStart(6, '0')}`;
            const claimType = claimTypes[i % claimTypes.length];
            const claimStatus = claimStatuses[i % claimStatuses.length];
            const incidentDate = new Date();
            incidentDate.setDate(incidentDate.getDate() - (i * 10 + 5));
            const estimatedAmount = 5000 + (i * 2000);
            const approvedAmount = claimStatus === 'approved' || claimStatus === 'settled' ? estimatedAmount * 0.9 : null;

            claims.push([
                policy.user_id,
                policy.id,
                claimNumber,
                claimType,
                incidentDate.toISOString().split('T')[0],
                'Casablanca, Avenue Mohammed V',
                `Incident de type ${claimType}. Dommages constatés nécessitant une intervention.`,
                estimatedAmount,
                approvedAmount,
                claimStatus,
                claimStatus === 'rejected' ? 'Hors garantie' : (claimStatus === 'approved' ? 'Dossier complet, approuvé' : null),
                i % 3 === 0,
                i % 3 === 0 ? 'Expert Alami' : null
            ]);
        }

        for (const claim of claims) {
            await connection.execute(
                `INSERT INTO claims (user_id, policy_id, claim_number, claim_type, incident_date, incident_location, incident_description, estimated_amount, approved_amount, status, admin_notes, investigation_required, investigator_assigned) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                claim
            );
        }
        console.log(`✅ Created ${claims.length} claims\n`);

        // 6. Create payments
        console.log('💳 Creating payments...');
        const payments = [];
        const paymentMethods = ['card', 'bank_transfer', 'cash', 'check'];

        for (let i = 0; i < policyRows.length; i++) {
            const policy = policyRows[i];
            const paymentAmount = policy.premium_amount / 12; // Monthly payment
            const paymentMethod = paymentMethods[i % paymentMethods.length];
            const transactionId = `TXN-${Date.now()}-${i}`;
            const paymentStatus = i % 10 === 0 ? 'pending' : 'paid';
            const dueDate = new Date();
            dueDate.setDate(1); // First of the month
            const paidDate = paymentStatus === 'paid' ? new Date(dueDate.getTime() + 86400000 * (i % 5)) : null;

            payments.push([
                policy.user_id,
                policy.id,
                paymentAmount,
                'premium',
                paymentMethod,
                transactionId,
                paymentStatus,
                dueDate.toISOString().split('T')[0],
                paidDate ? paidDate.toISOString() : null,
                paymentStatus === 'paid' ? JSON.stringify({ status: 'success', reference: transactionId }) : null
            ]);
        }

        for (const payment of payments) {
            await connection.execute(
                `INSERT INTO payments (user_id, policy_id, amount, payment_type, payment_method, transaction_id, status, due_date, paid_date, gateway_response) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                payment
            );
        }
        console.log(`✅ Created ${payments.length} payments\n`);

        // 7. Create notifications
        console.log('🔔 Creating notifications...');
        const notifications = [];

        for (let i = 0; i < clients.length; i++) {
            const client = clients[i];
            notifications.push([
                client.id,
                'Bienvenue sur AssurOnline',
                'Votre compte a été créé avec succès. Vous pouvez maintenant demander des devis.',
                'success',
                'in_app',
                new Date().toISOString(),
                null
            ]);

            if (i < 5) {
                notifications.push([
                    client.id,
                    'Paiement reçu',
                    'Votre paiement de prime a été reçu avec succès.',
                    'success',
                    'email',
                    null,
                    new Date().toISOString()
                ]);
            }

            if (i < 3) {
                notifications.push([
                    client.id,
                    'Renouvellement de police',
                    'Votre police arrive à échéance dans 30 jours. Pensez à la renouveler.',
                    'warning',
                    'in_app',
                    null,
                    null
                ]);
            }
        }

        for (const notification of notifications) {
            await connection.execute(
                `INSERT INTO notifications (user_id, title, message, type, channel, read_at, sent_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                notification
            );
        }
        console.log(`✅ Created ${notifications.length} notifications\n`);

        // Summary
        console.log('═══════════════════════════════════════════════════════');
        console.log('🎉 Database seeded successfully!');
        console.log('═══════════════════════════════════════════════════════\n');
        console.log('📊 Summary:');
        console.log(`   👥 Users: ${users.length} (${clients.length} clients, ${agents.length} agents)`);
        console.log(`   🚗 Vehicles: ${vehicles.length}`);
        console.log(`   📋 Quotes: ${quotes.length}`);
        console.log(`   📄 Policies: ${policies.length}`);
        console.log(`   🚨 Claims: ${claims.length}`);
        console.log(`   💳 Payments: ${payments.length}`);
        console.log(`   🔔 Notifications: ${notifications.length}`);
        console.log('\n═══════════════════════════════════════════════════════');

    } catch (error) {
        console.error('❌ Error seeding data:', error.message);
        console.error(error);
    } finally {
        await connection.end();
    }
}

seedRealisticData();
