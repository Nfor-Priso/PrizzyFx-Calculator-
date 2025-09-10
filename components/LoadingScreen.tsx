
import React from 'react';
import { APP_NAME } from '../constants';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center animate-pulse">
        <h1 className="text-6xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">
          {APP_NAME}
        </h1>
        <p className="text-lg text-gray-400 mt-2">Your AI Forex Mentor</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
