
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatWindow from './components/ChatWindow';
import VoiceAgent from './components/VoiceAgent';
import TicketForm from './components/TicketForm';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <ChatWindow />;
      case 'voice':
        return <VoiceAgent />;
      case 'tickets':
        return <TicketForm />;
      case 'diagnostics':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {['Mail Server', 'VPN Gateway', 'Active Directory', 'AWS us-east-1', 'Database Cluster', 'Local Proxy'].map((srv, i) => (
              <div key={srv} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-slate-800">{srv}</h4>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Zone A-12</p>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${i === 2 ? 'bg-amber-500 animate-pulse' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'}`}></div>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full mb-4 overflow-hidden">
                  <div className={`h-full bg-green-500 ${i === 2 ? 'w-2/3 bg-amber-500' : 'w-full'}`}></div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400">ADDR: 10.0.0.{145 + i}</span>
                  <span className="text-blue-600 font-bold uppercase">Healthy</span>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      <main className={`transition-all duration-300 lg:ml-72 min-h-screen flex flex-col`}>
        <header className="fixed top-0 left-0 right-0 h-16 lg:left-72 bg-white/80 backdrop-blur-md border-b border-slate-200 z-30 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <i className="fa-solid fa-bars-staggered"></i>
            </button>
            <div className="flex items-center gap-3">
              <h2 className="font-extrabold text-slate-800 text-sm lg:text-lg capitalize tracking-tight">{activeTab.replace('-', ' ')}</h2>
              <div className="hidden sm:block h-4 w-[1px] bg-slate-200"></div>
              <p className="hidden sm:block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <button className="w-9 h-9 flex lg:hidden items-center justify-center text-slate-500 bg-slate-50 rounded-full">
              <i className="fa-solid fa-magnifying-glass text-sm"></i>
            </button>
            <div className="hidden lg:relative lg:block">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 ring-blue-500 outline-none w-48 xl:w-64 transition-all"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            </div>
            <button className="relative w-9 h-9 flex items-center justify-center text-slate-500 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
              <i className="fa-regular fa-bell"></i>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="hidden sm:flex w-9 h-9 items-center justify-center text-slate-500 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
              <i className="fa-solid fa-gear"></i>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8 pt-20 lg:pt-24 max-w-7xl w-full mx-auto overflow-x-hidden">
          {renderContent()}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default App;
