export interface Application {
  jobId: number;
  candidateName: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  coverLetter?: string;
  linkedinUrl?: string;
  yearsOfExperience?: number;
  currentPosition?: string;
  currentCompany?: string;
  expectedSalary?: string;
  availableStartDate?: string;
  source?: string;
}

export interface ApplicationFormData extends Omit<Application, 'jobId'> {
  resume?: File;
}

export interface OdooApplicationPayload {
  partner_name: string;
  email_from: string;
  partner_phone: string;
  description?: string;
  linkedin_url?: string;
  type_id?: number;
  stage_id?: number;
  job_id: number;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  applicationId?: number;
  error?: string;
}
