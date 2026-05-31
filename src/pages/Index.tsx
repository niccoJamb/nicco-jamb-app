import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import SplashScreen from '@/components/SplashScreen';
import { AppProvider } from '@/contexts/AppContext';

const Index: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Only show splash on first load of the session
    const seen = sessionStorage.getItem('nicco_splash_seen');
    if (seen) setShowSplash(false);
  }, []);

  const handleFinish = () => {
    sessionStorage.setItem('nicco_splash_seen', '1');
    setShowSplash(false);
  };

  return (
    <AppProvider>
      {showSplash && <SplashScreen onFinish={handleFinish} duration={2500} />}
      <AppLayout />
    </AppProvider>
  );
};

export default Index;
