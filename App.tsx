
import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import RiskCalculators from './components/RiskCalculators';
import AiMentor from './components/AiMentor';
import { APP_NAME, ICONS } from './constants';
import { AppView } from './types';

const Header: React.FC<{ activeView: AppView; setView: (view: AppView) => void }> = ({ activeView, setView }) => {
  const navItemClasses = "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 cursor-pointer";
  const activeClasses = "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30";
  const inactiveClasses = "text-gray-400 hover:bg-gray-700/50";

  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">
        {APP_NAME}
      </div>
      <nav className="flex items-center gap-2 sm:gap-4 p-1 bg-gray-800/80 rounded-lg border border-gray-700">
        <button onClick={() => setView(AppView.CALCULATORS)} className={`${navItemClasses} ${activeView === AppView.CALCULATORS ? activeClasses : inactiveClasses}`}>
          {ICONS.calculator}
          <span className="hidden sm:inline">Calculators</span>
        </button>
        <button onClick={() => setView(AppView.AI_MENTOR)} className={`${navItemClasses} ${activeView === AppView.AI_MENTOR ? activeClasses : inactiveClasses}`}>
          {ICONS.ai}
          <span className="hidden sm:inline">AI Mentor</span>
        </button>
      </nav>
    </header>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<AppView>(AppView.CALCULATORS);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <div 
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-5" 
        style={{backgroundImage: 'url("https://picsum.photos/seed/forex/1920/1080")'}}
      ></div>
      <div className="relative z-5 flex flex-col min-h-screen">
          <Header activeView={view} setView={setView} />
          <main className="flex-grow">
              <div className="max-w-7xl mx-auto">
                 {view === AppView.CALCULATORS ? <RiskCalculators /> : <AiMentor />}
              </div>
          </main>
      </div>
    </div>
  );
};

export default App;
