# AssurOnline Complete Database

## Overview
This is a comprehensive MySQL database for the AssurOnline insurance platform with real Moroccan data, extensive vehicle models, and complete insurance system functionality.

## Database Features

### 🏗️ Complete Database Structure
- **15+ Tables** with proper relationships and constraints
- **Real Moroccan cities** with risk factors and postal codes
- **Extensive vehicle database** with 50+ car brands and 30+ motorcycle brands
- **Comprehensive vehicle models** with realistic pricing and specifications
- **Complete insurance system** with quotes, policies, claims, and payments

### 🇲🇦 Real Moroccan Data
- **30 Moroccan cities** with accurate risk factors
- **Real postal codes** and population data
- **Authentic Moroccan names** and addresses
- **Realistic pricing** in Moroccan Dirhams (MAD)
- **Local insurance terminology** in French

### 🚗 Vehicle Database
- **50+ Car Brands**: Renault, Peugeot, Dacia, Toyota, BMW, Mercedes, Audi, Volkswagen, Ford, Nissan, Hyundai, Kia, Citroën, Opel, Fiat, Skoda, Seat, Mazda, Mitsubishi, Subaru, Lexus, Infiniti, Genesis, Chevrolet, Honda, Suzuki, Isuzu, Land Rover, Jaguar, Mini, Volvo, Saab, Alfa Romeo, Lancia, Lada, Chery, Geely, BYD, Great Wall, JAC, MG, SsangYong
- **30+ Motorcycle Brands**: Honda, Yamaha, Kawasaki, Suzuki, Ducati, BMW, KTM, Triumph, Aprilia, MV Agusta, Benelli, Moto Guzzi, Husqvarna, Gas Gas, Beta, Sherco, TM Racing, Cagiva, Gilera, Piaggio, Vespa, Sym, Kymco, Keeway, Zongshen, Lifan, CFMoto, Bajaj, TVS, Hero, Royal Enfield, Harley-Davidson, Indian, Buell, Victory, Zero, Energica, Lightning, Arc

### 📊 Comprehensive Data
- **12 Test Users** with realistic Moroccan profiles
- **15 Vehicles** with authentic license plates and specifications
- **10 Quotes** with real pricing calculations
- **6 Active Policies** with different coverage types
- **6 Claims** with realistic scenarios
- **10 Payments** with various methods and statuses
- **10 Notifications** with real insurance messages
- **10 Invoices** with proper numbering

## Database Files

### Main Database File
- `assuronline_final_complete.sql` - **Complete database with everything**

### Alternative Files
- `complete_assuronline_database.sql` - Part 1 (Tables and basic data)
- `complete_assuronline_database_part2.sql` - Part 2 (Advanced data and procedures)
- `assuronline_complete_database.sql` - Alternative complete version

## Quick Setup

### Option 1: Single File Import (Recommended)
```sql
-- Import the complete database
SOURCE assuronline_final_complete.sql;
```

### Option 2: XAMPP/phpMyAdmin
1. Open phpMyAdmin
2. Create new database: `assuronline`
3. Import `assuronline_final_complete.sql`

### Option 3: MySQL Command Line
```bash
mysql -u root -p < assuronline_final_complete.sql
```

## Database Schema

### Core Tables
- `users` - Customer and admin accounts
- `vehicles` - Customer vehicles
- `quotes` - Insurance quotes
- `policies` - Active insurance policies
- `claims` - Insurance claims
- `payments` - Payment records
- `invoices` - Invoice records
- `notifications` - System notifications

### Reference Tables
- `vehicle_brands` - Car and motorcycle brands
- `vehicle_models` - Specific vehicle models
- `moroccan_cities` - Moroccan cities with risk factors
- `coverage_types` - Insurance coverage options
- `system_settings` - System configuration

### Support Tables
- `audit_logs` - System audit trail
- `file_storage` - File management
- `user_settings` - User preferences

## Key Features

### 🎯 Insurance System
- **Quote Generation** with automatic numbering
- **Policy Management** with renewal tracking
- **Claims Processing** with investigation workflow
- **Payment Processing** with multiple methods
- **Invoice Generation** with PDF support

### 🔧 Advanced Features
- **Stored Procedures** for automatic numbering
- **Triggers** for data validation
- **Views** for reporting and dashboards
- **Indexes** for optimal performance
- **JSON Fields** for flexible data storage

### 📈 Reporting Views
- `v_active_policies` - Active policies with customer info
- `v_pending_quotes` - Pending quotes with details
- `v_dashboard_stats` - Dashboard statistics

## Test Data

### Sample Users
- **Ahmed Benali** (Casablanca) - Renault Clio + Honda CBR 600
- **Fatima Alami** (Rabat) - BMW X5
- **Omar Tazi** (Casablanca) - Yamaha R1
- **Aicha Mansouri** (Marrakech) - Peugeot 3008
- **Youssef El Fassi** (Rabat) - Toyota Corolla
- **Khadija Berrada** (Agadir) - Dacia Duster
- **Hassan Chraibi** (Fès) - Kawasaki Ninja 650
- **Naima Idrissi** (Tanger) - Mercedes C-Class
- **Mohamed Alaoui** (Meknès) - Suzuki GSX-R 600
- **Zineb Tazi** (Oujda) - Audi A4

### Sample Policies
- **POL-2024-000001**: Renault Clio Standard Coverage (5,670 MAD/year)
- **POL-2024-000002**: Honda CBR 600 Confort Coverage (3,920 MAD/year)
- **POL-2024-000003**: Yamaha R1 Ultimate Coverage (6,300 MAD/year)
- **POL-2024-000004**: Dacia Duster Standard Coverage (3,780 MAD/year)
- **POL-2024-000005**: Kawasaki Ninja 650 Confort Coverage (3,080 MAD/year)
- **POL-2024-000006**: Suzuki GSX-R 600 Standard Coverage (2,520 MAD/year)

## Coverage Types

### Car Coverage
- **RC Obligatoire** - Mandatory liability (0 MAD)
- **Vol** - Theft protection (15 MAD)
- **Incendie** - Fire protection (12 MAD)
- **Bris de glace** - Glass breakage (8 MAD)
- **Vandalisme** - Vandalism protection (10 MAD)
- **Assistance 0 km** - Roadside assistance (20 MAD)
- **Véhicule de remplacement** - Replacement vehicle (25 MAD)
- **Protection juridique** - Legal protection (5 MAD)
- **Garantie conducteur** - Driver guarantee (8 MAD)
- **Défense Recours** - Defense against claims (12 MAD)
- **Tous risques** - Comprehensive coverage (40 MAD)

### Motorcycle Coverage
- **RC Obligatoire** - Mandatory liability (0 MAD)
- **Vol** - Theft protection (18 MAD)
- **Incendie** - Fire protection (15 MAD)
- **Bris de glace** - Glass and optics (10 MAD)
- **Équipements de protection** - Protective equipment (12 MAD)
- **Assistance 0 km** - Motorcycle assistance (22 MAD)
- **Moto de prêt** - Loan motorcycle (20 MAD)
- **Protection juridique** - Legal protection (6 MAD)
- **Garantie conducteur** - Driver guarantee (10 MAD)
- **Protection tous risques** - Comprehensive coverage (35 MAD)
- **Protection circuit** - Track protection (25 MAD)

## Moroccan Cities with Risk Factors

| City | Risk Factor | Population | Region |
|------|-------------|------------|---------|
| Casablanca | 1.40 | 3.4M | Casablanca-Settat |
| Rabat | 1.20 | 1.2M | Rabat-Salé-Kénitra |
| Marrakech | 1.15 | 1.1M | Marrakech-Safi |
| Fès | 1.10 | 1.2M | Fès-Meknès |
| Agadir | 1.05 | 924K | Souss-Massa |
| Tanger | 1.10 | 1.1M | Tanger-Tétouan-Al Hoceïma |
| Meknès | 1.00 | 835K | Fès-Meknès |
| Oujda | 0.95 | 558K | Oriental |
| Kénitra | 1.00 | 431K | Rabat-Salé-Kénitra |
| Tétouan | 0.95 | 463K | Tanger-Tétouan-Al Hoceïma |

## System Settings

### Key Configuration
- **Quote Validity**: 30 days
- **Policy Duration**: 365 days
- **Payment Grace Period**: 15 days
- **Cancellation Notice**: 30 days
- **Claim Investigation Threshold**: 10,000 MAD
- **Annual Payment Discount**: 5%
- **Quarterly Payment Discount**: 2%
- **Late Payment Penalty**: 5%

### Pricing (MAD)
- **Auto Basique**: 2,500 MAD/year
- **Auto Standard**: 4,500 MAD/year
- **Auto Premium**: 7,500 MAD/year
- **Moto Essentiel**: 1,200 MAD/year
- **Moto Confort**: 2,800 MAD/year
- **Moto Ultimate**: 4,500 MAD/year

## Usage Examples

### Get Active Policies
```sql
SELECT * FROM v_active_policies;
```

### Get Pending Quotes
```sql
SELECT * FROM v_pending_quotes;
```

### Get Dashboard Statistics
```sql
SELECT * FROM v_dashboard_stats;
```

### Find Vehicles by Brand
```sql
SELECT v.*, u.name as owner_name 
FROM vehicles v 
JOIN users u ON v.user_id = u.id 
WHERE v.brand = 'Renault';
```

### Get Claims by Status
```sql
SELECT c.*, u.name as customer_name, p.policy_number
FROM claims c
JOIN users u ON c.user_id = u.id
JOIN policies p ON c.policy_id = p.id
WHERE c.status = 'pending';
```

## Performance Optimization

### Indexes
- All foreign keys are indexed
- Frequently queried fields have indexes
- Composite indexes for complex queries
- JSON fields are optimized for MySQL 8.0+

### Stored Procedures
- `GenerateQuoteNumber()` - Auto-generate quote numbers
- `GeneratePolicyNumber()` - Auto-generate policy numbers
- `GenerateClaimNumber()` - Auto-generate claim numbers

### Triggers
- Auto-generate numbers on insert
- Set default validity dates
- Update timestamps automatically

## Security Features

### Data Protection
- Password hashing with bcrypt
- Input validation constraints
- Foreign key constraints
- Unique constraints on critical fields

### Audit Trail
- Complete audit logging
- User action tracking
- Data change history
- IP address logging

## Maintenance

### Regular Tasks
- Update vehicle values annually
- Review risk factors quarterly
- Clean old audit logs monthly
- Backup database weekly

### Monitoring
- Check for expired quotes
- Monitor payment due dates
- Track claim processing times
- Review system performance

## Support

For questions or issues with this database:
1. Check the schema documentation
2. Review the sample data
3. Test with the provided views
4. Contact the development team

## License

This database is part of the AssurOnline project and follows the same licensing terms.

---

**Created**: January 2024  
**Version**: 1.0  
**Database**: MySQL 8.0+  
**Character Set**: utf8mb4  
**Collation**: utf8mb4_unicode_ci
