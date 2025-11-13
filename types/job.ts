export interface Job {
  id: number;
  name: string;
  description: string;
  requirements?: string;
  department?: string;
  location?: string;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  salaryRange?: string;
  experienceLevel?: string;
  postedDate?: string;
  closingDate?: string;
  numberOfPositions?: number;
  isActive?: boolean;
}

export interface JobListResponse {
  jobs: Job[];
  total: number;
}
