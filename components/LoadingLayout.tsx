import React, { useEffect, useState } from 'react';
import { AppProvider } from '@/components/AppContext';
import TabLayout from './layoutold';
const LOADING_DURATION = 3000; // 1 second

function LoadingLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), LOADING_DURATION);
    return () => clearTimeout(timer);
  }, []);

  return <TabLayout />;
}

export default function Layout() {
  return (
    <AppProvider>
      <LoadingLayout />
    </AppProvider>
  );
}