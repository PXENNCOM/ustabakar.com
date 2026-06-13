import React from 'react';

import Headers from '../../components/header';
import Footer from '../../components/footer';

import HeroSection from './components/Hero';
import StatsSection from './components/Stats';
import FeaturesSection from './components/Features';
import ServiceCards from './components/ServiceCards'; // Yeni eklediğimiz asimetrik kartlar

const LandingPage = () => {
  return (
    <div className="w-full min-h-screen bg-[#FDFDFD] overflow-x-hidden">

      <Headers />

      {/* 1. HERO SECTION (Türkiye Haritalı & Slider Alanı) */}
      <HeroSection />

      {/* 2. STATS SECTION (Minimalist Sayısal İstatistik Bandı) */}
      <StatsSection />

      {/* 3. FEATURES SECTION (Neden Biz? 2x2 Grid Alanı) */}
      <FeaturesSection />

      {/* 4. SERVICE CARDS SECTION (Yeni İstediğiniz Asimetrik Modern Kartlar) */}
      <ServiceCards />

      <Footer />
    </div>
  );
};

export default LandingPage;