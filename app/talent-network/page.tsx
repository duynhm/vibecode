'use client';

import { useState } from 'react';

export default function TalentNetworkPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    interests: [] as string[],
    locations: [] as string[],
    experience: '',
    consent: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        interests: [],
        locations: [],
        experience: '',
        consent: false,
      });
    }, 5000);
  };

  const interestOptions = [
    'Engineering',
    'Design',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'Customer Service',
  ];

  const locationOptions = [
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Đà Nẵng',
    'Cần Thơ',
    'Hải Phòng',
    'Remote',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Gia nhập <span className="text-yellow-300">Talent Network</span>
            </h1>
            <p className="text-xl text-blue-100">
              Kết nối với VibeCode và nhận thông báo về các cơ hội việc làm phù hợp với bạn
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Lợi ích khi tham gia
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🎯',
                  title: 'Việc làm phù hợp',
                  description:
                    'Nhận thông báo về các vị trí phù hợp với kỹ năng và mong muốn của bạn',
                },
                {
                  icon: '📧',
                  title: 'Cập nhật thường xuyên',
                  description:
                    'Cập nhật tin tức công ty, sự kiện tuyển dụng và cơ hội phát triển',
                },
                {
                  icon: '⚡',
                  title: 'Ứng tuyển nhanh',
                  description:
                    'Hồ sơ được lưu trữ để ứng tuyển nhanh chóng khi có cơ hội phù hợp',
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="bg-blue-50 rounded-xl p-6 text-center hover:shadow-lg transition"
                >
                  <div className="text-5xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
              Đăng ký ngay
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Chỉ mất vài phút để hoàn thành
            </p>

            {isSubmitted ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
                <svg
                  className="w-20 h-20 text-green-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  Đăng ký thành công!
                </h3>
                <p className="text-green-700 mb-4">
                  Chào mừng bạn đến với Talent Network của VibeCode
                </p>
                <p className="text-green-600">
                  Chúng tôi sẽ gửi thông báo việc làm phù hợp đến email của bạn
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+84 xxx xxx xxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kinh nghiệm
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn mức kinh nghiệm</option>
                      <option value="fresher">Chưa có kinh nghiệm</option>
                      <option value="1-2">1-2 năm</option>
                      <option value="3-5">3-5 năm</option>
                      <option value="5+">5+ năm</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Lĩnh vực quan tâm <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {interestOptions.map((interest) => (
                      <label
                        key={interest}
                        className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-blue-50 cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                interests: [...formData.interests, interest],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                interests: formData.interests.filter((i) => i !== interest),
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Địa điểm ưu tiên
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {locationOptions.map((location) => (
                      <label
                        key={location}
                        className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-blue-50 cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={formData.locations.includes(location)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                locations: [...formData.locations, location],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                locations: formData.locations.filter((l) => l !== location),
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-start pt-4">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    checked={formData.consent}
                    onChange={(e) =>
                      setFormData({ ...formData, consent: e.target.checked })
                    }
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="consent" className="ml-3 text-sm text-gray-600">
                    Tôi đồng ý nhận email thông báo việc làm và tin tức từ VibeCode.
                    Tôi có thể hủy đăng ký bất cứ lúc nào.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-lg"
                >
                  Tham gia Talent Network
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
