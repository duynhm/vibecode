'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TalentNetworkSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleQuickSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left side - Info */}
              <div className="p-8 lg:p-12 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Gia nhập
                  <br />
                  <span className="text-yellow-300">Talent Network</span>
                </h2>
                <p className="text-blue-100 mb-6">
                  Kết nối với chúng tôi để không bỏ lỡ bất kỳ cơ hội nào phù hợp
                  với bạn
                </p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-blue-800"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold mb-1">
                        Nhận thông báo việc làm
                      </h3>
                      <p className="text-sm text-blue-100">
                        Cập nhật các vị trí phù hợp với kỹ năng của bạn
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-blue-800"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold mb-1">Tin tức công ty</h3>
                      <p className="text-sm text-blue-100">
                        Cập nhật thông tin về văn hóa và sự kiện công ty
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-blue-800"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold mb-1">Ưu tiên ứng tuyển</h3>
                      <p className="text-sm text-blue-100">
                        Ứng tuyển nhanh chóng với hồ sơ đã lưu
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/talent-network"
                  className="inline-block mt-8 text-yellow-300 hover:text-yellow-400 font-semibold underline"
                >
                  Tìm hiểu thêm →
                </Link>
              </div>

              {/* Right side - Quick signup */}
              <div className="p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Đăng ký nhanh
                </h3>

                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <svg
                      className="w-16 h-16 text-green-500 mx-auto mb-4"
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
                    <h4 className="text-lg font-semibold text-green-800 mb-2">
                      Đăng ký thành công!
                    </h4>
                    <p className="text-green-600">
                      Chúng tôi sẽ gửi thông báo việc làm đến email của bạn
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleQuickSignup} className="space-y-4">
                    <div>
                      <label
                        htmlFor="network-email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email của bạn *
                      </label>
                      <input
                        type="email"
                        id="network-email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="network-interest"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Lĩnh vực quan tâm
                      </label>
                      <select
                        id="network-interest"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Chọn lĩnh vực</option>
                        <option value="engineering">Engineering</option>
                        <option value="design">Design</option>
                        <option value="marketing">Marketing</option>
                        <option value="sales">Sales</option>
                        <option value="hr">Human Resources</option>
                        <option value="finance">Finance</option>
                      </select>
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="network-consent"
                        required
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="network-consent"
                        className="ml-2 text-sm text-gray-600"
                      >
                        Tôi đồng ý nhận email thông báo việc làm và tin tức từ
                        VibeCode
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      Tham gia ngay
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      Hoặc{' '}
                      <Link
                        href="/talent-network"
                        className="text-blue-600 hover:underline"
                      >
                        điền form đầy đủ
                      </Link>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
