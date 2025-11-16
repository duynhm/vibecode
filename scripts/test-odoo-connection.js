/**
 * Test Odoo 18 API Connection
 * Run: node scripts/test-odoo-connection.js
 */

const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_URL || 'http://localhost:8069';
const ODOO_DB = process.env.NEXT_PUBLIC_ODOO_DB;
const ODOO_USERNAME = process.env.ODOO_USERNAME;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD;

async function testOdooConnection() {
  console.log('🔌 Testing Odoo 18 Connection...\n');
  console.log('Configuration:');
  console.log('- URL:', ODOO_URL);
  console.log('- Database:', ODOO_DB);
  console.log('- Username:', ODOO_USERNAME);
  console.log('- Password:', '***' + ODOO_PASSWORD?.slice(-3));
  console.log('');

  // Create axios instance with cookie support
  const instance = axios.create({
    baseURL: ODOO_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  try {
    // Test 1: Authentication
    console.log('📝 Test 1: Authentication');
    const authResponse = await instance.post('/web/session/authenticate', {
      jsonrpc: '2.0',
      params: {
        db: ODOO_DB,
        login: ODOO_USERNAME,
        password: ODOO_PASSWORD,
      },
    });

    console.log('Debug - Auth response keys:', Object.keys(authResponse.data.result || {}));

    if (authResponse.data.result && authResponse.data.result.uid) {
      console.log('✅ Authentication successful!');
      console.log('   User ID:', authResponse.data.result.uid);
      console.log('   Company:', authResponse.data.result.company_id?.[1] || 'N/A');

      // Get cookies from response
      const cookies = authResponse.headers['set-cookie'];
      console.log('   Cookies received:', cookies ? 'Yes' : 'No');

      // Test 2: Get Jobs using JSON-RPC
      console.log('\n📝 Test 2: Fetching Jobs');

      // Try the correct endpoint for Odoo 18
      const jobsResponse = await instance.post('/jsonrpc', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute_kw',
          args: [
            ODOO_DB,
            authResponse.data.result.uid,
            ODOO_PASSWORD,
            'hr.job',
            'search_read',
            [[['state', '=', 'recruit']]],
            {
              fields: ['id', 'name', 'description', 'department_id', 'address_id', 'no_of_recruitment', 'state'],
              limit: 10,
            }
          ]
        },
        id: 1,
      });

      if (jobsResponse.data.result) {
        console.log('✅ Jobs fetched successfully!');
        console.log('   Total jobs:', jobsResponse.data.result.length);

        if (jobsResponse.data.result.length > 0) {
          console.log('\n   Jobs list:');
          jobsResponse.data.result.forEach((job, index) => {
            console.log(`   ${index + 1}. ${job.name} (ID: ${job.id})`);
            console.log(`      Department: ${job.department_id ? job.department_id[1] : 'N/A'}`);
            console.log(`      Positions: ${job.no_of_recruitment || 1}`);
            console.log(`      State: ${job.state}`);
          });
        } else {
          console.log('   ⚠️  No jobs found.');
          console.log('   💡 Create jobs in Odoo: Recruitment → Job Positions → Create');
        }

        // Test 3: Create Test Applicant (if jobs exist)
        if (jobsResponse.data.result.length > 0) {
          console.log('\n📝 Test 3: Creating Test Applicant');
          const testJobId = jobsResponse.data.result[0].id;

          const applicantResponse = await instance.post('/jsonrpc', {
            jsonrpc: '2.0',
            method: 'call',
            params: {
              service: 'object',
              method: 'execute_kw',
              args: [
                ODOO_DB,
                authResponse.data.result.uid,
                ODOO_PASSWORD,
                'hr.applicant',
                'create',
                [{
                  partner_name: 'Test Candidate - ' + new Date().toISOString(),
                  email_from: 'test@vibecode.com',
                  partner_phone: '0123456789',
                  job_id: testJobId,
                  description: 'This is a test application created by API',
                }]
              ]
            },
            id: 2,
          });

          if (applicantResponse.data.result) {
            console.log('✅ Test applicant created successfully!');
            console.log('   Applicant ID:', applicantResponse.data.result);
            console.log('   Job:', jobsResponse.data.result[0].name);
            console.log('   💡 Check in Odoo: Recruitment → Applications');
          }
        } else {
          console.log('\n⏭️  Skipping applicant creation (no jobs available)');
        }

        console.log('\n🎉 All tests passed!');
        console.log('\n✅ Your Odoo 18 API is ready for integration!');
        console.log('\n📝 Next steps:');
        console.log('   1. Update lib/odoo-api.ts to use /jsonrpc endpoint');
        console.log('   2. Uncomment getJobs() in app/jobs/page.tsx');
        console.log('   3. Run: npm run dev');

      } else if (jobsResponse.data.error) {
        console.log('❌ Error fetching jobs!');
        console.log('   Error:', jobsResponse.data.error.message);
        console.log('   Data:', jobsResponse.data.error.data);
      }

    } else {
      console.log('❌ Authentication failed!');
      console.log('   Response:', authResponse.data);
    }

  } catch (error) {
    console.log('\n❌ Test failed!');
    console.log('Error:', error.message);

    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response URL:', error.config?.url);

      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          console.log('Response:', error.response.data.substring(0, 200));
        } else {
          console.log('Response:', JSON.stringify(error.response.data, null, 2));
        }
      }

      // Troubleshooting tips
      if (error.response.status === 404) {
        console.log('\n💡 Troubleshooting:');
        console.log('   - Endpoint might be wrong for Odoo 18');
        console.log('   - Check Odoo is running: http://localhost:8069/web');
        console.log('   - Try accessing http://localhost:8069/jsonrpc');
      } else if (error.response.status === 401 || error.response.status === 403) {
        console.log('\n💡 Tip: Check username/password in .env.local');
      } else if (error.response.status === 500) {
        console.log('\n💡 Tip: Check Odoo logs for errors');
        console.log('   - Module might not be installed');
        console.log('   - Database might have issues');
      }
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Tip: Odoo is not running at', ODOO_URL);
      console.log('   Start Odoo and try again');
    }
  }
}

// Run tests
testOdooConnection();
