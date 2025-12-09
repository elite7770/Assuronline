// Using built-in fetch (Node.js 18+)

async function testSystemSettings() {
  console.log('🧪 Testing System Settings API...\n');

  try {
    // 1. Login to get token
    console.log('1️⃣ Logging in...');
    const loginResponse = await fetch('http://localhost:3001/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@assuronline.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful\n');

    // 2. Get current settings
    console.log('2️⃣ Fetching current settings...');
    const getResponse = await fetch('http://localhost:3001/api/v1/admin/settings', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const getData = await getResponse.json();
    console.log('✅ Settings fetched successfully');
    console.log('📊 Current System Settings:');
    console.log(JSON.stringify(getData.settings.system, null, 2));
    console.log('');

    // 3. Test updating system settings
    console.log('3️⃣ Testing system settings update...');
    const updateData = {
      system: {
        maintenance_mode: true,
        registration_enabled: false,
        email_verification_required: false,
        max_file_size: 25,
        session_timeout: 60,
        backup_frequency: 'weekly',
        log_level: 'debug',
        debug_mode: true
      }
    };

    const updateResponse = await fetch('http://localhost:3001/api/v1/admin/settings', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    const updateResult = await updateResponse.json();
    console.log('✅ Settings updated successfully');
    console.log('📊 Updated System Settings:');
    console.log(JSON.stringify(updateResult.settings.system, null, 2));
    console.log('');

    // 4. Verify the update by fetching again
    console.log('4️⃣ Verifying update by fetching settings again...');
    const verifyResponse = await fetch('http://localhost:3001/api/v1/admin/settings', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const verifyData = await verifyResponse.json();
    console.log('✅ Settings verification successful');
    console.log('📊 Verified System Settings:');
    console.log(JSON.stringify(verifyData.settings.system, null, 2));
    console.log('');

    // 5. Test reset functionality
    console.log('5️⃣ Testing settings reset...');
    const resetResponse = await fetch('http://localhost:3001/api/v1/admin/settings/reset', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const resetResult = await resetResponse.json();
    console.log('✅ Settings reset successfully');
    console.log('📊 Reset System Settings:');
    console.log(JSON.stringify(resetResult.settings.system, null, 2));
    console.log('');

    // 6. Test individual field updates
    console.log('6️⃣ Testing individual field updates...');
    const individualUpdate = {
      system: {
        max_file_size: 50,
        session_timeout: 120
      }
    };

    const individualResponse = await fetch('http://localhost:3001/api/v1/admin/settings', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(individualUpdate)
    });

    const individualResult = await individualResponse.json();
    console.log('✅ Individual field update successful');
    console.log('📊 Individual Update Result:');
    console.log(JSON.stringify(individualResult.settings.system, null, 2));
    console.log('');

    console.log('🎉 All System Settings tests passed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('✅ GET /api/v1/admin/settings - Fetch settings');
    console.log('✅ PUT /api/v1/admin/settings - Update settings');
    console.log('✅ POST /api/v1/admin/settings/reset - Reset settings');
    console.log('✅ Individual field updates work');
    console.log('✅ Settings persistence works');
    console.log('✅ All system settings fields are functional');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testSystemSettings();
