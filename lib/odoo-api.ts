import axios from 'axios';
import type { Job, JobListResponse } from '@/types/job';
import type { OdooApplicationPayload, ApplicationResponse } from '@/types/application';

const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_URL || '';
const ODOO_DB = process.env.NEXT_PUBLIC_ODOO_DB || '';
const ODOO_USERNAME = process.env.ODOO_USERNAME || '';
const ODOO_PASSWORD = process.env.ODOO_PASSWORD || '';

// Odoo API client
class OdooAPI {
  private uid: number | null = null;
  private baseUrl: string;
  private db: string;
  private username: string;
  private password: string;

  constructor() {
    this.baseUrl = ODOO_URL;
    this.db = ODOO_DB;
    this.username = ODOO_USERNAME;
    this.password = ODOO_PASSWORD;
  }

  /**
   * Authenticate with Odoo
   */
  async authenticate(): Promise<number> {
    if (this.uid !== null) return this.uid;

    try {
      const response = await axios.post(`${this.baseUrl}/web/session/authenticate`, {
        jsonrpc: '2.0',
        params: {
          db: this.db,
          login: this.username,
          password: this.password,
        },
      });

      if (response.data.result && response.data.result.uid) {
        this.uid = response.data.result.uid;
        return this.uid!;
      }

      throw new Error('Authentication failed');
    } catch (error) {
      console.error('Odoo authentication error:', error);
      throw new Error('Failed to authenticate with Odoo');
    }
  }

  /**
   * Call Odoo API method (Odoo 18 compatible)
   */
  private async callOdoo(model: string, method: string, args: any[] = [], kwargs: any = {}): Promise<any> {
    await this.authenticate();

    try {
      const response = await axios.post(`${this.baseUrl}/jsonrpc`, {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute_kw',
          args: [
            this.db,
            this.uid,
            this.password,
            model,
            method,
            args,
            kwargs,
          ],
        },
      });

      return response.data.result;
    } catch (error) {
      console.error(`Odoo API call error (${model}.${method}):`, error);
      throw error;
    }
  }

  /**
   * Get all jobs (Odoo 18 - state field removed from hr.job)
   */
  async getJobs(): Promise<JobListResponse> {
    try {
      const jobs = await this.callOdoo(
        'hr.job',
        'search_read',
        [[]], // Get all jobs (Odoo 18 removed state field)
        {
          fields: [
            'id',
            'name',
            'description',
            'requirements',
            'department_id',
            'address_id',
            'no_of_recruitment',
          ],
        }
      );

      const formattedJobs: Job[] = jobs.map((job: any) => ({
        id: job.id,
        name: job.name,
        description: job.description || '',
        requirements: job.requirements || '',
        department: job.department_id ? job.department_id[1] : undefined,
        location: job.address_id ? job.address_id[1] : undefined,
        numberOfPositions: job.no_of_recruitment || 1,
        isActive: true, // All jobs are considered active in Odoo 18
      }));

      return {
        jobs: formattedJobs,
        total: formattedJobs.length,
      };
    } catch (error) {
      console.error('Error fetching jobs from Odoo:', error);
      throw error;
    }
  }

  /**
   * Get single job by ID (Odoo 18 compatible)
   */
  async getJob(id: number): Promise<Job | null> {
    try {
      const jobs = await this.callOdoo(
        'hr.job',
        'search_read',
        [[['id', '=', id]]],
        {
          fields: [
            'id',
            'name',
            'description',
            'requirements',
            'department_id',
            'address_id',
            'no_of_recruitment',
          ],
        }
      );

      if (jobs.length === 0) return null;

      const job = jobs[0];
      return {
        id: job.id,
        name: job.name,
        description: job.description || '',
        requirements: job.requirements || '',
        department: job.department_id ? job.department_id[1] : undefined,
        location: job.address_id ? job.address_id[1] : undefined,
        numberOfPositions: job.no_of_recruitment || 1,
        isActive: true, // All jobs are considered active in Odoo 18
      };
    } catch (error) {
      console.error('Error fetching job from Odoo:', error);
      throw error;
    }
  }

  /**
   * Submit application to Odoo (Odoo 18 compatible)
   */
  async submitApplication(data: OdooApplicationPayload): Promise<ApplicationResponse> {
    try {
      // Create applicant in Odoo - using only core fields available in Odoo 18
      const applicantId = await this.callOdoo('hr.applicant', 'create', [
        {
          partner_name: data.partner_name,
          email_from: data.email_from,
          partner_phone: data.partner_phone,
          job_id: data.job_id,
          // Note: description and linkedin_url fields removed in Odoo 18
          // stage_id will be set to default initial stage by Odoo
        },
      ]);

      return {
        success: true,
        message: 'Application submitted successfully',
        applicationId: applicantId,
      };
    } catch (error: any) {
      console.error('Error submitting application to Odoo:', error);
      return {
        success: false,
        message: 'Failed to submit application',
        error: error.message,
      };
    }
  }
}

// Export singleton instance
export const odooAPI = new OdooAPI();

// Export helper functions
export const getJobs = () => odooAPI.getJobs();
export const getJob = (id: number) => odooAPI.getJob(id);
export const submitApplication = (data: OdooApplicationPayload) => odooAPI.submitApplication(data);
