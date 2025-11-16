import JobCard from '@/components/JobCard';
import type { Job } from '@/types/job';
import { getJobs } from '@/lib/odoo-api';

// Mock data for demo - Replace with actual Odoo API call in production
const mockJobs: Job[] = [
  {
    id: 1,
    name: 'Senior Full Stack Developer',
    description: 'We are looking for an experienced Full Stack Developer to join our team. You will work on exciting projects using modern technologies like React, Node.js, and PostgreSQL.',
    requirements: 'Bachelor degree in Computer Science or related field. 5+ years of experience in web development.',
    department: 'Engineering',
    location: 'Ho Chi Minh City, Vietnam',
    employmentType: 'full-time',
    numberOfPositions: 2,
    isActive: true,
  },
  {
    id: 2,
    name: 'Frontend Developer',
    description: 'Join our frontend team to build beautiful and responsive user interfaces. Experience with React, TypeScript, and Tailwind CSS is a plus.',
    requirements: '3+ years of experience with modern frontend frameworks. Strong understanding of HTML, CSS, and JavaScript.',
    department: 'Engineering',
    location: 'Hanoi, Vietnam',
    employmentType: 'full-time',
    numberOfPositions: 1,
    isActive: true,
  },
  {
    id: 3,
    name: 'DevOps Engineer',
    description: 'We need a skilled DevOps Engineer to manage our infrastructure and deployment pipelines. Experience with Docker, Kubernetes, and CI/CD is required.',
    requirements: '4+ years of DevOps experience. Strong knowledge of cloud platforms (AWS, GCP, or Azure).',
    department: 'Infrastructure',
    location: 'Remote',
    employmentType: 'full-time',
    numberOfPositions: 1,
    isActive: true,
  },
  {
    id: 4,
    name: 'UI/UX Designer',
    description: 'Create amazing user experiences for our products. You will work closely with product managers and developers to design intuitive interfaces.',
    requirements: '3+ years of UI/UX design experience. Proficient in Figma or Adobe XD.',
    department: 'Design',
    location: 'Ho Chi Minh City, Vietnam',
    employmentType: 'full-time',
    numberOfPositions: 1,
    isActive: true,
  },
  {
    id: 5,
    name: 'Backend Developer (Python)',
    description: 'Build scalable backend services using Python, Django/FastAPI, and PostgreSQL. Experience with microservices architecture is a plus.',
    requirements: '3+ years of Python development experience. Strong understanding of RESTful APIs and database design.',
    department: 'Engineering',
    location: 'Da Nang, Vietnam',
    employmentType: 'full-time',
    numberOfPositions: 2,
    isActive: true,
  },
];

// Fetch jobs from Odoo
async function getJobsData() {
  try {
    const { jobs } = await getJobs();
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await getJobsData(); // Fetch from Odoo
  // const jobs = mockJobs; // Using mock data for now

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Available Positions
        </h1>
        <p className="text-gray-600">
          Explore exciting career opportunities at VibeCode
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No positions available
          </h2>
          <p className="text-gray-600">
            Please check back later for new opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">
          Don&apos;t see a perfect match?
        </h2>
        <p className="text-blue-700 mb-4">
          We&apos;re always looking for talented individuals. Send us your resume and
          we&apos;ll keep you in mind for future opportunities.
        </p>
        <a
          href="mailto:careers@vibecode.com"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}
