'use client';

import { useState } from 'react';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = [
    {
      name: 'Về quy trình tuyển dụng',
      icon: '📋',
      faqs: [
        {
          question: 'Quy trình tuyển dụng tại VibeCode diễn ra như thế nào?',
          answer: 'Quy trình tuyển dụng của chúng tôi bao gồm 4 bước: (1) Nộp hồ sơ trực tuyến, (2) Phỏng vấn qua điện thoại/video, (3) Phỏng vấn trực tiếp với hiring manager, (4) Phỏng vấn với ban lãnh đạo (nếu cần). Toàn bộ quy trình thường kéo dài từ 2-3 tuần.',
        },
        {
          question: 'Sau bao lâu tôi sẽ nhận được phản hồi?',
          answer: 'Chúng tôi cam kết phản hồi trong vòng 5-7 ngày làm việc sau khi bạn nộp hồ sơ. Nếu hồ sơ của bạn phù hợp, đội ngũ tuyển dụng sẽ liên hệ qua email hoặc điện thoại để sắp xếp buổi phỏng vấn đầu tiên.',
        },
        {
          question: 'Thời gian thử việc là bao lâu?',
          answer: 'Thời gian thử việc tiêu chuẩn là 2 tháng (60 ngày). Trong thời gian này, bạn sẽ được đánh giá năng lực và sự phù hợp với công việc. Trong một số trường hợp đặc biệt, thời gian thử việc có thể được rút ngắn hoặc kéo dài.',
        },
      ],
    },
    {
      name: 'Về ứng tuyển',
      icon: '📝',
      faqs: [
        {
          question: 'Làm thế nào để ứng tuyển?',
          answer: 'Bạn có thể ứng tuyển bằng cách: (1) Tìm vị trí phù hợp trên trang Việc làm, (2) Click vào "Ứng tuyển ngay", (3) Điền thông tin cá nhân và upload CV, (4) Gửi đơn ứng tuyển. Bạn cũng có thể gia nhập Talent Network để nhận thông báo việc làm phù hợp.',
        },
        {
          question: 'Tôi có thể ứng tuyển nhiều vị trí cùng lúc không?',
          answer: 'Có, bạn hoàn toàn có thể ứng tuyển nhiều vị trí phù hợp với kỹ năng của mình. Tuy nhiên, chúng tôi khuyến nghị bạn nên tập trung vào những vị trí mà bạn thực sự quan tâm và có đủ năng lực để đảm bảo chất lượng hồ sơ.',
        },
        {
          question: 'Có mất phí khi ứng tuyển không?',
          answer: 'Không, việc ứng tuyển tại VibeCode hoàn toàn MIỄN PHÍ. Chúng tôi không thu bất kỳ khoản phí nào từ ứng viên trong suốt quá trình tuyển dụng.',
        },
        {
          question: 'Làm sao để cập nhật hồ sơ đã nộp?',
          answer: 'Nếu bạn muốn cập nhật hồ sơ đã nộp, vui lòng gửi email đến tuyendung@vibecode.com với tiêu đề "[Cập nhật hồ sơ] - Tên vị trí - Họ tên của bạn" kèm theo CV mới và thông tin cần cập nhật.',
        },
      ],
    },
    {
      name: 'Về làm việc tại công ty',
      icon: '💼',
      faqs: [
        {
          question: 'Chế độ làm việc tại VibeCode như thế nào?',
          answer: 'Chúng tôi làm việc từ Thứ 2 đến Thứ 6, từ 8:00 - 17:30 với 1 giờ nghỉ trưa. Chúng tôi cũng hỗ trợ làm việc linh hoạt và work from home tùy theo vị trí công việc.',
        },
        {
          question: 'Công ty có tuyển intern không?',
          answer: 'Có, chúng tôi có chương trình tuyển dụng thực tập sinh thường niên. Sinh viên năm 3, năm 4 hoặc mới tốt nghiệp có thể ứng tuyển. Vui lòng theo dõi trang tuyển dụng để cập nhật thông tin chương trình Internship.',
        },
        {
          question: 'Có cơ hội thăng tiến không?',
          answer: 'Chúng tôi có lộ trình thăng tiến rõ ràng dựa trên năng lực và đóng góp của nhân viên. Mỗi năm, công ty có đánh giá hiệu suất và xem xét thăng tiến cho những cá nhân xuất sắc.',
        },
      ],
    },
    {
      name: 'Về chế độ đãi ngộ',
      icon: '💰',
      faqs: [
        {
          question: 'Chế độ lương thưởng như thế nào?',
          answer: 'Chúng tôi cung cấp mức lương cạnh tranh theo năng lực và kinh nghiệm. Ngoài ra còn có: thưởng hiệu suất hàng quý, thưởng dự án, thưởng tết, và các khoản thưởng khác theo chính sách công ty.',
        },
        {
          question: 'Công ty có những phúc lợi gì?',
          answer: 'Phúc lợi bao gồm: Bảo hiểm xã hội, bảo hiểm y tế, bảo hiểm thất nghiệp đầy đủ; Bảo hiểm sức khỏe cao cấp; 12 ngày phép năm + thêm 2 ngày nghỉ sinh nhật và ngày thành lập công ty; Team building, du lịch hàng năm; Đào tạo và phát triển; Hỗ trợ học tập.',
        },
        {
          question: 'Có được làm remote không?',
          answer: 'Tùy thuộc vào vị trí công việc, một số vị trí cho phép làm việc từ xa toàn thời gian hoặc hybrid (kết hợp văn phòng và remote). Vui lòng kiểm tra thông tin chi tiết trong mô tả công việc.',
        },
      ],
    },
  ];

  const allFAQs = categories.flatMap((cat) =>
    cat.faqs.map((faq) => ({ ...faq, category: cat.name }))
  );

  const filteredFAQs = searchQuery
    ? allFAQs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allFAQs;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Câu hỏi thường gặp
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Tìm câu trả lời cho những thắc mắc của bạn
          </p>

          {/* Search box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <svg
              className="absolute right-4 top-4 w-6 h-6 text-gray-400"
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
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto">
          {searchQuery ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Kết quả tìm kiếm ({filteredFAQs.length})
              </h2>
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-start justify-between hover:bg-gray-50 transition"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {faq.question}
                      </h3>
                      <p className="text-sm text-gray-500">{faq.category}</p>
                    </div>
                    <svg
                      className={`w-6 h-6 text-gray-400 transition-transform flex-shrink-0 ml-4 ${
                        openIndex === index ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            categories.map((category, catIndex) => (
              <div key={catIndex} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-3xl mr-3">{category.icon}</span>
                  {category.name}
                </h2>
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = catIndex * 100 + faqIndex;
                    return (
                      <div
                        key={faqIndex}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setOpenIndex(openIndex === globalIndex ? null : globalIndex)
                          }
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition"
                        >
                          <h3 className="font-semibold text-gray-800 flex-1 pr-4">
                            {faq.question}
                          </h3>
                          <svg
                            className={`w-6 h-6 text-gray-400 transition-transform flex-shrink-0 ${
                              openIndex === globalIndex ? 'transform rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {openIndex === globalIndex && (
                          <div className="px-6 pb-4 border-t border-gray-100">
                            <p className="text-gray-700 pt-4">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="max-w-3xl mx-auto mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Không tìm thấy câu trả lời bạn cần?
          </h3>
          <p className="text-blue-100 mb-6">
            Đừng ngần ngại liên hệ với chúng tôi. Team tuyển dụng luôn sẵn sàng hỗ trợ
            bạn!
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Liên hệ ngay
          </a>
        </div>
      </div>
    </div>
  );
}
