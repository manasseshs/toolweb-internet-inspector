
import React from 'react';
import HomeHeader from './HomeHeader';
import GlobalFooter from '@/components/GlobalFooter';

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <HomeHeader />
      <main className="container mx-auto px-4 py-4">
        {children}
      </main>
      <GlobalFooter />
    </div>
  );
};

export default HomeLayout;
