import { notFound } from 'next/navigation';
import ApplicationForm from '@/components/ApplicationForm';
import type { Job } from '@/types/job';
import { getJob } from '@/lib/odoo-api';

// Mock data - same as jobs page
const mockJobs: Job[] = [
  {
    id: 1,
    name: 'Senior Full Stack Developer',
    description: `<h3>About the Role</h3>
    <p>We are looking for an experienced Full Stack Developer to join our team. You will work on exciting projects using modern technologies like React, Node.js, and PostgreSQL.</p>
    <p>As a Senior Full Stack Developer, you will be responsible for designing, developing, and maintaining web applications that serve thousands of users.</p>

    <h3>Responsibilities</h3>
    <ul>
      <li>Design and develop scalable web applications</li>
      <li>Collaborate with cross-functional teams to define and ship new features</li>
      <li>Write clean, maintainable code and conduct code reviews</li>
      <li>Optimize applications for maximum speed and scalability</li>
      <li>Mentor junior developers and contribute to team growth</li>
    </ul>`,
    requirements: `<h3>Required Skills</h3>
    <ul>
      <li>Bachelor degree in Computer Science or related field</li>
      <li>5+ years of experience in web development</li>
      <li>Strong proficiency in JavaScript/TypeScript, React, and Node.js</li>
      <li>Experience with SQL and NoSQL databases</li>
      <li>Familiarity with Git and Agile methodologies</li>
      <li>Excellent problem-solving and communication skills</li>
    </ul>

    <h3>Nice to Have</h3>
    <ul>
      <li>Experience with cloud platforms (AWS, GCP, Azure)</li>
      <li>Knowledge of Docker and Kubernetes</li>
      <li>Experience with microservices architecture</li>
    </ul>`,
    department: 'Engineering',
    location: 'Ho Chi Minh City, Vietnam',
    employmentType: 'full-time',
    salaryRange: '$2000 - $4000',
    numberOfPositions: 2,
    isActive: true,
  },
  {
    id: 2,
    name: 'Frontend Developer',
    description: `<h3>About the Role</h3>
    <p>Join our frontend team to build beautiful and responsive user interfaces. Experience with React, TypeScript, and Tailwind CSS is a plus.</p>

    <h3>Responsibilities</h3>
    <ul>
      <li>Develop responsive web applications using React</li>
      <li>Implement pixel-perfect designs from Figma</li>
      <li>Ensure cross-browser compatibility</li>
      <li>Optimize applications for performance</li>
    </ul>`,
    requirements: `<h3>Required Skills</h3>
    <ul>
      <li>3+ years of experience with modern frontend frameworks</li>
      <li>Strong understanding of HTML, CSS, and JavaScript</li>
      <li>Experience with React and TypeScript</li>
      <li>Knowledge of responsive design principles</li>
    </ul>`,
    department: 'Engineering',
    location: 'Hanoi, Vietnam',
    employmentType: 'full-time',
    salaryRange: '$1500 - $3000',
    numberOfPositions: 1,
    isActive: true,
  },
  {
    id: 3,
    name: 'DevOps Engineer',
    description: `<h3>About the Role</h3>
    <p>We need a skilled DevOps Engineer to manage our infrastructure and deployment pipelines. Experience with Docker, Kubernetes, and CI/CD is required.</p>`,
    requirements: `<h3>Required Skills</h3>
    <ul>
      <li>4+ years of DevOps experience</li>
      <li>Strong knowledge of cloud platforms (AWS, GCP, or Azure)</li>
      <li>Experience with Docker and Kubernetes</li>
      <li>Proficiency in scripting languages (Bash, Python)</li>
    </ul>`,
    department: 'Infrastructure',
    location: 'Remote',
    employmentType: 'full-time',
    salaryRange: '$2500 - $4500',
    numberOfPositions: 1,
    isActive: true,
  },
  {
    id: 4,
    name: 'UI/UX Designer',
    description: `<h3>About the Role</h3>
    <p>Create amazing user experiences for our products. You will work closely with product managers and developers to design intuitive interfaces.</p>`,
    requirements: `<h3>Required Skills</h3>
    <ul>
      <li>3+ years of UI/UX design experience</li>
      <li>Proficient in Figma or Adobe XD</li>
      <li>Strong portfolio showcasing design work</li>
      <li>Understanding of user-centered design principles</li>
    </ul>`,
    department: 'Design',
    location: 'Ho Chi Minh City, Vietnam',
    employmentType: 'full-time',
    salaryRange: '$1200 - $2500',
    numberOfPositions: 1,
    isActive: true,
  },
  {
    id: 5,
    name: 'Backend Developer (Python)',
    description: `<h3>About the Role</h3>
    <p>Build scalable backend services using Python, Django/FastAPI, and PostgreSQL. Experience with microservices architecture is a plus.</p>`,
    requirements: `<h3>Required Skills</h3>
    <ul>
      <li>3+ years of Python development experience</li>
      <li>Strong understanding of RESTful APIs and database design</li>
      <li>Experience with Django or FastAPI</li>
      <li>Knowledge of PostgreSQL or MySQL</li>
    </ul>`,
    department: 'Engineering',
    location: 'Da Nang, Vietnam',
    employmentType: 'full-time',
    salaryRange: '$1800 - $3500',
    numberOfPositions: 2,
    isActive: true,
  },
];

// Fetch job from Odoo
async function getJobData(id: number) {
  try {
    const job = await getJob(id);
    return job;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const jobId = parseInt(resolvedParams.id);

  const job = await getJobData(jobId); // Fetch from Odoo
  // const job = mockJobs.find((j) => j.id === jobId); // Using mock data for now

  if (!job) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600">
        <a href="/jobs" className="hover:text-blue-600">
          All Jobs
        </a>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{job.name}</span>
      </nav>

      {/* Job Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {job.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-gray-600">
              {job.department && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span>{job.department}</span>
                </div>
              )}

              {job.location && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{job.location}</span>
                </div>
              )}

              {job.employmentType && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="capitalize">{job.employmentType}</span>
                </div>
              )}

              {job.salaryRange && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{job.salaryRange}</span>
                </div>
              )}
            </div>
          </div>

          {job.isActive && (
            <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded">
              Active
            </span>
          )}
        </div>

        {/* Job Description */}
        {job.description && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Job Description
            </h2>
            <div
              className="prose prose-blue max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>
        )}

        {/* Job Requirements */}
        {job.requirements && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Requirements
            </h2>
            <div
              className="prose prose-blue max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: job.requirements }}
            />
          </div>
        )}
      </div>

      {/* Application Form */}
      <ApplicationForm jobId={job.id} jobName={job.name} />
    </div>
  );
}
