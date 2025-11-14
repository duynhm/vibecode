'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    keyword: '',
    location: '',
    department: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Build query params
    const params = new URLSearchParams();
    if (searchData.keyword) params.set('keyword', searchData.keyword);
    if (searchData.location) params.set('location', searchData.location);
    if (searchData.department) params.set('department', searchData.department);

    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-20 lg:py-32 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Tìm kiếm cơ hội nghề nghiệp
            <br />
            <span className="text-yellow-300">tại VibeCode</span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-blue-100">
            Khám phá hàng trăm vị trí tuyển dụng hấp dẫn và phát triển sự nghiệp
            cùng chúng tôi
          </p>

          {/* Search form */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-2xl p-4 md:p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Keyword input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Vị trí, từ khóa..."
                  value={searchData.keyword}
                  onChange={(e) =>
                    setSearchData({ ...searchData, keyword: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute right-3 top-3.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Location select */}
              <div className="relative">
                <select
                  value={searchData.location}
                  onChange={(e) =>
                    setSearchData({ ...searchData, location: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Tất cả địa điểm</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP.HCM">TP. Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Remote">Remote</option>
                </select>
                <svg
                  className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none"
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
              </div>

              {/* Department select */}
              <div className="relative">
                <select
                  value={searchData.department}
                  onChange={(e) =>
                    setSearchData({ ...searchData, department: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Tất cả phòng ban</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">Human Resources</option>
                  <option value="Finance">Finance</option>
                </select>
                <svg
                  className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none"
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
              </div>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center justify-center mx-auto"
            >
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Tìm kiếm ngay
            </button>
          </form>

          {/* Quick stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-yellow-300">100+</div>
              <div className="text-blue-100 mt-1">Vị trí tuyển dụng</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-300">50+</div>
              <div className="text-blue-100 mt-1">Phòng ban</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-300">20+</div>
              <div className="text-blue-100 mt-1">Văn phòng</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-300">5000+</div>
              <div className="text-blue-100 mt-1">Nhân viên</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
            fill="rgb(249, 250, 251)"
          />
        </svg>
      </div>
    </section>
  );
}
