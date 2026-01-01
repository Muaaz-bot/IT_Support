import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'chat', label: 'AI Assist', icon: 'fa-robot' },
    { id: 'tickets', label: 'Active Tickets', icon: 'fa-ticket' },
    { id: 'voice', label: 'Voice Helpdesk', icon: 'fa-microphone' },
    { id: 'diagnostics', label: 'System Health', icon: 'fa-heartbeat' },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-900 text-white flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
              <i className="fa-solid fa-shield-halved text-xl"></i>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight uppercase leading-none">TMC IT</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">SUPPORT</p>
            </div>
          </div>
          <button 
            className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-400"
            onClick={() => setIsOpen(false)}
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-1.5 px-4">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <i className={`fa-solid ${item.icon} w-5 text-center text-lg`}></i>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 m-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500/30 p-0.5">
              <img className="w-full h-full rounded-full object-cover" src="https://picsum.photos/64/64?random=1" alt="Avatar" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">Admin</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Online</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white p-2">
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;