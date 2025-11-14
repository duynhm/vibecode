import HeroSection from '@/components/HeroSection';
import TalentNetworkSection from '@/components/TalentNetworkSection';
import WhyJoinUs from '@/components/WhyJoinUs';
import CompanyStats from '@/components/CompanyStats';
import JobCard from '@/components/JobCard';
import Link from 'next/link';
import type { Job } from '@/types/job';

// Featured jobs - in production, fetch from API
const featuredJobs: Job[] = [
  {
    id: 1,
    name: 'Senior Full Stack Developer',
    description: 'We are looking for an experienced Full Stack Developer...',
    department: 'Engineering',
    location: 'Ho Chi Minh City, Vietnam',
    employmentType: 'full-time',
    numberOfPositions: 2,
    isActive: true,
  },
  {
    id: 2,
    name: 'Frontend Developer',
    description: 'Join our frontend team to build beautiful user interfaces...',
    department: 'Engineering',
    location: 'Hanoi, Vietnam',
    employmentType: 'full-time',
    numberOfPositions: 1,
    isActive: true,
  },
  {
    id: 3,
    name: 'UI/UX Designer',
    description: 'Create amazing user experiences for our products...',
    department: 'Design',
    location: 'Ho Chi Minh City, Vietnam',
    employmentType: 'full-time',
    numberOfPositions: 1,
    isActive: true,
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section with Search */}
      <HeroSection />

      {/* Talent Network Section */}
      <TalentNetworkSection />

      {/* Featured Jobs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Cơ hội việc làm <span className="text-blue-600">nổi bật</span>
            </h2>
            <p className="text-lg text-gray-600">
              Khám phá các vị trí tuyển dụng hot nhất hiện nay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/jobs"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg"
            >
              Xem tất cả việc làm →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <WhyJoinUs />

      {/* Company Stats */}
      <CompanyStats />

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Nhân viên nói gì về <span className="text-blue-600">chúng tôi</span>
            </h2>
            <p className="text-lg text-gray-600">
              Câu chuyện từ những thành viên của VibeCode
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Nguyễn Văn A',
                position: 'Senior Developer',
                avatar: '👨‍💻',
                quote:
                  'Môi trường làm việc tuyệt vời, đồng nghiệp thân thiện và luôn sẵn sàng hỗ trợ. Tôi đã học hỏi được rất nhiều điều ở đây.',
              },
              {
                name: 'Trần Thị B',
                position: 'UX Designer',
                avatar: '👩‍🎨',
                quote:
                  'VibeCode cho tôi cơ hội phát triển kỹ năng và sáng tạo. Tôi tự hào khi được làm việc với team này.',
              },
              {
                name: 'Lê Văn C',
                position: 'Product Manager',
                avatar: '👨‍💼',
                quote:
                  'Văn hóa công ty tuyệt vời, luôn khuyến khích đổi mới và sáng tạo. Đây là nơi lý tưởng để phát triển sự nghiệp.',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="text-5xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {testimonial.position}
                    </p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Sẵn sàng gia nhập đội ngũ của chúng tôi?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Khám phá các vị trí tuyển dụng và ứng tuyển ngay hôm nay để bắt đầu
            hành trình sự nghiệp cùng VibeCode!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/jobs"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Xem vị trí tuyển dụng
            </Link>
            <Link
              href="/talent-network"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Tham gia Talent Network
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
