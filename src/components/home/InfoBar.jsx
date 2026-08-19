import React from 'react';
import { Truck, CreditCard, ShieldCheck, Headphones } from 'lucide-react';
import { benefits } from '../../data/mockData';

const iconMap = {
  Truck,
  CreditCard,
  ShieldCheck,
  Headphones
};

export const InfoBar = () => {
  return (
    <section className="bg-white border-y border-gray-200/70 py-6 my-6 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((item, idx) => {
            const IconComponent = iconMap[item.icon] || Truck;
            return (
              <div key={idx} className="flex items-center gap-3.5 group">
                <div className="w-12 h-12 rounded-full bg-neutral-100 group-hover:bg-red-50 text-gray-800 group-hover:text-[#f20606] flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
