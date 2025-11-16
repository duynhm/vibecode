/**
 * Test Odoo API Connection
 * Run: node scripts/test-odoo-connection.js
 */

const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_URL || 'http://localhost:8069';
const ODOO_DB = process.env.NEXT_PUBLIC_ODOO_DB;
const ODOO_USERNAME = process.env.ODOO_USERNAME;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD;

async function testOdooConnection() {
  console.log('🔌 Testing Odoo Connection...\n');
  console.log('Configuration:');
  console.log('- URL:', ODOO_URL);
  console.log('- Database:', ODOO_DB);
  console.log('- Username:', ODOO_USERNAME);
  console.log('- Password:', '***' + ODOO_PASSWORD?.slice(-3));
  console.log('');

  try {
    // Test 1: Authentication
    console.log('📝 Test 1: Authentication');
    const authResponse = await axios.post(`${ODOO_URL}/web/session/authenticate`, {
      jsonrpc: '2.0',
      params: {
        db: ODOO_DB,
        login: ODOO_USERNAME,
        password: ODOO_PASSWORD,
      },
    });

    if (authResponse.data.result && authResponse.data.result.uid) {
      console.log('✅ Authentication successful!');
      console.log('   User ID:', authResponse.data.result.uid);
      console.log('   Session ID:', authResponse.data.result.session_id?.slice(0, 20) + '...');

      const sessionId = authResponse.data.result.session_id;
      const uid = authResponse.data.result.uid;

      // Test 2: Get Jobs
      console.log('\n📝 Test 2: Fetching Jobs');
      const jobsResponse = await axios.post(
        `${ODOO_URL}/web/dataset/call_kw`,
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'hr.job',
            method: 'search_read',
            args: [[['state', '=', 'recruit']]],
            kwargs: {
              fields: ['id', 'name', 'description', 'department_id', 'address_id', 'no_of_recruitment', 'state'],
              limit: 5,
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `session_id=${sessionId}`,
          },
        }
      );

      if (jobsResponse.data.result) {
        console.log('✅ Jobs fetched successfully!');
        console.log('   Total jobs:', jobsResponse.data.result.length);

        if (jobsResponse.data.result.length > 0) {
          console.log('\n   Jobs list:');
          jobsResponse.data.result.forEach((job, index) => {
            console.log(`   ${index + 1}. ${job.name} (ID: ${job.id})`);
            console.log(`      Department: ${job.department_id ? job.department_id[1] : 'N/A'}`);
            console.log(`      Positions: ${job.no_of_recruitment || 1}`);
          });
        } else {
          console.log('   ⚠️  No jobs found. You may need to create some jobs in Odoo first.');
        }
      }

      // Test 3: Create Test Applicant
      console.log('\n📝 Test 3: Creating Test Applicant');

      if (jobsResponse.data.result && jobsResponse.data.result.length > 0) {
        const testJobId = jobsResponse.data.result[0].id;

        const applicantResponse = await axios.post(
          `${ODOO_URL}/web/dataset/call_kw`,
          {
            jsonrpc: '2.0',
            method: 'call',
            params: {
              model: 'hr.applicant',
              method: 'create',
              args: [{
                partner_name: 'Test Candidate - ' + new Date().toISOString(),
                email_from: 'test@vibecode.com',
                partner_phone: '0123456789',
                job_id: testJobId,
                description: 'This is a test application created by API',
              }],
              kwargs: {},
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Cookie': `session_id=${sessionId}`,
            },
          }
        );

        if (applicantResponse.data.result) {
          console.log('✅ Test applicant created successfully!');
          console.log('   Applicant ID:', applicantResponse.data.result);
          console.log('   Job:', jobsResponse.data.result[0].name);
        }
      } else {
        console.log('⏭️  Skipping applicant creation (no jobs available)');
      }

      console.log('\n🎉 All tests passed!');
      console.log('\n✅ Your Odoo API is ready for integration!');

    } else {
      console.log('❌ Authentication failed!');
      console.log('   Response:', authResponse.data);
    }

  } catch (error) {
    console.log('\n❌ Test failed!');
    console.log('Error:', error.message);

    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', JSON.stringify(error.response.data, null, 2));

      if (error.response.status === 404) {
        console.log('\n💡 Tip: Make sure Odoo is running at', ODOO_URL);
      } else if (error.response.status === 401 || error.response.status === 403) {
        console.log('\n💡 Tip: Check your username and password in .env.local');
      }
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Tip: Odoo server is not running or not accessible at', ODOO_URL);
      console.log('   Make sure Odoo is started and listening on port 8069');
    }
  }
}

// Run tests
testOdooConnection();
