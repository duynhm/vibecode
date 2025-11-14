'use client';

import { useState, useEffect, useRef } from 'react';

export default function CompanyStats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: 5000, suffix: '+', label: 'Nhân viên', icon: '👥' },
    { value: 50, suffix: '+', label: 'Văn phòng', icon: '🏢' },
    { value: 15, suffix: ' năm', label: 'Kinh nghiệm', icon: '📈' },
    { value: 100, suffix: '+', label: 'Giải thưởng', icon: '🏆' },
  ];

  const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      const duration = 2000;
      const steps = 60;
      const stepValue = target / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setCount(Math.min(Math.floor(stepValue * currentStep), target));
        } else {
          clearInterval(timer);
          setCount(target);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [isVisible, target]);

    return (
      <span>
        {count.toLocaleString()}
        {suffix}
      </span>
    );
  };

  return (
    <section ref={sectionRef} className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center text-white">
              <div className="text-5xl mb-2">{stat.icon}</div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-blue-100 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
