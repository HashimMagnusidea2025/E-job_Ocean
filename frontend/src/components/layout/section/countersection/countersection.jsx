import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import Rbrecruitment from '../../../../media/png/Rbrecruitment.png';

export default function Countersection() {
  const stats = [
    {
      icon: Rbrecruitment,
      count: 500,
      suffix: '+',
      label: 'Placements',
      color: 'text-black',
    },
    {
      icon: Rbrecruitment,
      count: 30,
      suffix: '+',
      label: 'Recruiters',
      color: 'text-black',
    },
    {
      icon: Rbrecruitment,
      count: 500,
      suffix: '+',
      label: 'Vacancies',
      color: 'text-green-500',
    },
  ];

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section className="container mx-auto py-28 font-[Poppins] overflow-hidden relative">
      {/* Animated Background Circles */}
      <ul className="circles absolute inset-0 -z-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i}></li>
        ))}
      </ul>

      {/* Content */}
      <div className="relative z-10 px-4" ref={ref}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center items-center">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 text-center shadow-md"
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-14 h-14 mx-auto mb-4"
              />
              <h3 className={`text-3xl font-bold ${item.color}`}>
                {inView && (
                  <CountUp
                    start={0}
                    end={item.count}
                    duration={2}
                    suffix={item.suffix}
                  />
                )}
              </h3>
              <p className="text-gray-800 font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
