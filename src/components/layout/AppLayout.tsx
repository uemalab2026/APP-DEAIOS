import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-background text-primary selection:bg-accent/30 selection:text-white">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen relative overflow-hidden">
        {/* Ambient Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
        
        <Header />
        <main className="flex-1 p-8 overflow-x-hidden relative z-10">
          <div className="max-w-[1600px] mx-auto w-full h-full animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
