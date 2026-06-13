import React from 'react';

const StatsSection = () => {
  const statsData = [
    {
      id: 1,
      value: "450bin+",
      label: "Bir yılda ekspertizini yaptığımız araç sayısı"
    },
    {
      id: 2,
      value: "97%",
      label: "Müşteri memnuniyet oranı"
    },
    {
      id: 3,
      value: "300+",
      label: "Bayi sayısı"
    }
  ];

  return (
    <section className="w-full bg-[#FDFDFD] py-12 border-y border-zinc-100 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Responsive Grid: Mobilde alt alta, desktopta yan yana 3 sütun */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center justify-between">
          
          {statsData.map((stat) => (
            <div 
              key={stat.id} 
              className="flex items-center space-x-4 md:justify-center group"
            >
              {/* Sayı Alanı */}
              <span className="text-4xl md:text-5xl font-black text-[#1A2238] tracking-tight group-hover:text-[#ffe119] transition-colors duration-300 shrink-0">
                {stat.value}
              </span>
              
              {/* Açıklama Alanı (Görseldeki gibi maksimum genişliği sınırlayarak alt satıra şık geçmesini sağladık) */}
              <p className="text-zinc-500 text-sm leading-snug font-medium max-w-[180px]">
                {stat.label}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default StatsSection;