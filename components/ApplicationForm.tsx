'use client';

import { useState, FormEvent } from 'react';
import type { ApplicationFormData } from '@/types/application';

interface ApplicationFormProps {
  jobId: number;
  jobName: string;
}

export default function ApplicationForm({ jobId, jobName }: ApplicationFormProps) {
  const [formData, setFormData] = useState<ApplicationFormData>({
    candidateName: '',
    email: '',
    phone: '',
    coverLetter: '',
    linkedinUrl: '',
    yearsOfExperience: undefined,
    currentPosition: '',
    currentCompany: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'yearsOfExperience' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Build description from form data
      const description = `
Cover Letter: ${formData.coverLetter || 'N/A'}

Years of Experience: ${formData.yearsOfExperience || 'N/A'}
Current Position: ${formData.currentPosition || 'N/A'}
Current Company: ${formData.currentCompany || 'N/A'}
      `.trim();

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          partner_name: formData.candidateName,
          email_from: formData.email,
          partner_phone: formData.phone,
          description,
          linkedin_url: formData.linkedinUrl,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitMessage({
          type: 'success',
          text: 'Application submitted successfully! We will contact you soon.',
        });
        // Reset form
        setFormData({
          candidateName: '',
          email: '',
          phone: '',
          coverLetter: '',
          linkedinUrl: '',
          yearsOfExperience: undefined,
          currentPosition: '',
          currentCompany: '',
        });
      } else {
        setSubmitMessage({
          type: 'error',
          text: result.message || 'Failed to submit application. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitMessage({
        type: 'error',
        text: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Apply for {jobName}
      </h2>

      {submitMessage && (
        <div
          className={`p-4 mb-6 rounded-md ${
            submitMessage.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="candidateName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="candidateName"
              name="candidateName"
              required
              value={formData.candidateName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+84 xxx xxx xxx"
            />
          </div>

          <div>
            <label
              htmlFor="yearsOfExperience"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Years of Experience
            </label>
            <input
              type="number"
              id="yearsOfExperience"
              name="yearsOfExperience"
              min="0"
              value={formData.yearsOfExperience || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label
              htmlFor="currentPosition"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Current Position
            </label>
            <input
              type="text"
              id="currentPosition"
              name="currentPosition"
              value={formData.currentPosition}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Senior Developer"
            />
          </div>

          <div>
            <label
              htmlFor="currentCompany"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Current Company
            </label>
            <input
              type="text"
              id="currentCompany"
              name="currentCompany"
              value={formData.currentCompany}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., ABC Company"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="linkedinUrl"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              id="linkedinUrl"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="coverLetter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              rows={6}
              value={formData.coverLetter}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us why you're interested in this position..."
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-md font-medium text-white transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}
