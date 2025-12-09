import fetch from 'node-fetch';

const testAdminPolicies = async () => {
  try {
    console.log('🧪 Testing admin policies endpoint...');

    // Login to get token
    const loginResponse = await fetch('http://localhost:3001/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@assuronline.com',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log('🔑 Token:', loginData.token.substring(0, 50) + '...');

    // Test admin policies endpoint
    const policiesResponse = await fetch('http://localhost:3001/api/v1/admin/policies', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      }
    });

    const policiesData = await policiesResponse.json();
    console.log('📊 Policies response:', JSON.stringify(policiesData, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testAdminPolicies();
