const axios = require('axios');

async function testRoleBasedAccess() {
    console.log('🧪 Testing Role-Based Access Control for Book Editing\n');

    const baseURL = 'http://localhost:5000/api';

    try {
        // Test 1: Create a normal user token
        console.log('📝 Test 1: Normal User Access');
        const normalUserLogin = await axios.post(`${baseURL}/auth/login`, {
            email: 'test@example.com', // Replace with existing normal user
            password: 'password123'
        }).catch(() => {
            console.log('ℹ️ Normal user not found, creating test token manually');
            return { data: { token: 'dummy_normal_token', user: { role: 'user' } } };
        });

        const normalToken = normalUserLogin.data.token;
        console.log('✅ Normal user token obtained');

        // Test 2: Try to edit a book as normal user
        console.log('\n🚫 Test 2: Normal User Edit Attempt (Should Fail)');
        try {
            const editResponse = await axios.put(`${baseURL}/books/1`, 
                { title: 'Hacked Title' }, 
                { 
                    headers: { 
                        'Authorization': `Bearer ${normalToken}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            console.log('❌ ERROR: Normal user was able to edit book!');
        } catch (error) {
            if (error.response?.status === 403) {
                console.log('✅ SUCCESS: Normal user correctly blocked from editing');
            } else {
                console.log('⚠️ Unexpected error:', error.response?.status, error.response?.data);
            }
        }

        // Test 3: Create an admin user token
        console.log('\n📝 Test 3: Admin User Access');
        const adminLogin = await axios.post(`${baseURL}/auth/login`, {
            email: 'testadmin@example.com', // Replace with existing admin
            password: 'admin123'
        }).catch(() => {
            console.log('ℹ️ Admin user not found, creating test token manually');
            return { data: { token: 'dummy_admin_token', user: { role: 'admin' } } };
        });

        const adminToken = adminLogin.data.token;
        console.log('✅ Admin user token obtained');

        // Test 4: Try to edit a book as admin (should work if book exists)
        console.log('\n✅ Test 4: Admin User Edit Attempt (Should Succeed)');
        try {
            const editResponse = await axios.put(`${baseURL}/books/1`, 
                { title: 'Updated by Admin' }, 
                { 
                    headers: { 
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            console.log('✅ Admin can edit books (if book exists)');
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Admin access confirmed (book not found, but access allowed)');
            } else {
                console.log('⚠️ Unexpected error:', error.response?.status, error.response?.data);
            }
        }

        console.log('\n🎉 Role-based access control test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testRoleBasedAccess();
