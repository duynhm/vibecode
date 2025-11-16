require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_URL;
const ODOO_DB = process.env.NEXT_PUBLIC_ODOO_DB;
const ODOO_USERNAME = process.env.ODOO_USERNAME;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD;

async function checkApplicantFields() {
  console.log('🔍 Checking hr.applicant fields in Odoo 18...\n');

  const instance = axios.create({
    baseURL: ODOO_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  try {
    // Step 1: Authenticate
    console.log('📝 Step 1: Authentication');
    const authResponse = await instance.post('/web/session/authenticate', {
      jsonrpc: '2.0',
      params: {
        db: ODOO_DB,
        login: ODOO_USERNAME,
        password: ODOO_PASSWORD,
      },
    });

    if (!authResponse.data.result || !authResponse.data.result.uid) {
      throw new Error('Authentication failed');
    }

    const uid = authResponse.data.result.uid;
    console.log(`✅ Authenticated as user ID: ${uid}\n`);

    // Step 2: Get model fields
    console.log('📝 Step 2: Fetching hr.applicant model fields');
    const fieldsResponse = await instance.post('/jsonrpc', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        service: 'object',
        method: 'execute_kw',
        args: [
          ODOO_DB,
          uid,
          ODOO_PASSWORD,
          'hr.applicant',
          'fields_get',
          [],
          {
            attributes: ['string', 'type', 'required', 'readonly'],
          },
        ],
      },
      id: 1,
    });

    const fields = fieldsResponse.data.result;
    console.log('✅ Fields retrieved successfully!\n');

    // Display relevant fields for application form
    console.log('📋 Key fields for application submission:\n');

    const relevantFields = [
      'partner_name',
      'email_from',
      'partner_phone',
      'partner_mobile',
      'job_id',
      'description',
      'categ_ids',
      'linkedin_url',
      'type_id',
      'stage_id',
      'user_id',
      'name',
      'application_count',
    ];

    relevantFields.forEach(fieldName => {
      if (fields[fieldName]) {
        const field = fields[fieldName];
        console.log(`  ${fieldName}:`);
        console.log(`    - Label: ${field.string}`);
        console.log(`    - Type: ${field.type}`);
        console.log(`    - Required: ${field.required || false}`);
        console.log(`    - Readonly: ${field.readonly || false}`);
        console.log('');
      }
    });

    console.log('\n🔍 Checking for description-like fields:');
    const descriptionFields = Object.keys(fields).filter(key =>
      key.includes('desc') ||
      key.includes('note') ||
      key.includes('comment') ||
      key.includes('message') ||
      key.includes('summary')
    );

    if (descriptionFields.length > 0) {
      console.log('Found these description-related fields:');
      descriptionFields.forEach(fieldName => {
        const field = fields[fieldName];
        console.log(`  - ${fieldName}: ${field.string} (${field.type})`);
      });
    } else {
      console.log('⚠️  No description-like fields found');
    }

    // Step 3: Try to create a test applicant with minimal fields
    console.log('\n📝 Step 3: Testing minimal applicant creation');

    try {
      const testData = {
        partner_name: 'Test Applicant (Delete Me)',
        email_from: 'test@example.com',
        job_id: 1, // Assuming job ID 1 exists
      };

      console.log('Attempting to create with fields:', Object.keys(testData));

      const createResponse = await instance.post('/jsonrpc', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute_kw',
          args: [
            ODOO_DB,
            uid,
            ODOO_PASSWORD,
            'hr.applicant',
            'create',
            [testData],
          ],
        },
        id: 1,
      });

      if (createResponse.data.result) {
        console.log(`✅ Successfully created test applicant with ID: ${createResponse.data.result}`);
        console.log('   (Please delete this test applicant from Odoo manually)');
      }
    } catch (error) {
      console.log('⚠️  Test creation failed:', error.response?.data?.error?.data?.message || error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

checkApplicantFields();
