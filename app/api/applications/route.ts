import { NextRequest, NextResponse } from 'next/server';
import { submitApplication } from '@/lib/odoo-api';
import type { OdooApplicationPayload } from '@/types/application';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.jobId || !body.partner_name || !body.email_from || !body.partner_phone) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: jobId, partner_name, email_from, partner_phone',
        },
        { status: 400 }
      );
    }

    // Prepare payload for Odoo
    const payload: OdooApplicationPayload = {
      job_id: body.jobId,
      partner_name: body.partner_name,
      email_from: body.email_from,
      partner_phone: body.partner_phone,
      description: body.description || '',
      linkedin_url: body.linkedin_url || '',
    };

    // Submit to Odoo
    const result = await submitApplication(payload);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error: any) {
    console.error('API Error - Submit application:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
