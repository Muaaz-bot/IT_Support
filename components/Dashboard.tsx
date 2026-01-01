
import React from 'react';
import { TicketStatus, TicketPriority, Ticket } from '../types';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Tickets', value: '142', icon: 'fa-ticket', color: 'bg-blue-100 text-blue-600' },
    { label: 'Open Now', value: '12', icon: 'fa-envelope-open', color: 'bg-amber-100 text-amber-600' },
    { label: 'AI Resolved', value: '89', icon: 'fa-bolt', color: 'bg-green-100 text-green-600' },
    { label: 'Avg Speed', value: '4m', icon: 'fa-clock', color: 'bg-purple-100 text-purple-600' },
  ];

  const recentTickets: Ticket[] = [
    { 
      id: 'TIC-1290', 
      title: 'VPN connection dropping intermittently', 
      description: 'The user reports that the VPN client disconnects every 15 minutes.',
      requester: 'Sarah Miller', 
      status: TicketStatus.OPEN, 
      priority: TicketPriority.HIGH, 
      createdAt: '2h ago', 
      category: 'Network' 
    },
    { 
      id: 'TIC-1291', 
      title: 'Adobe Creative Cloud license error', 
      description: 'User is seeing an "Expired License" message.',
      requester: 'John Doe', 
      status: TicketStatus.IN_PROGRESS, 
      priority: TicketPriority.MEDIUM, 
      createdAt: '4h ago', 
      category: 'Software' 
    },
    { 
      id: 'TIC-1292', 
      title: 'New laptop setup - Onboarding', 
      description: 'Provisioning a new MacBook Pro for a new hire.',
      requester: 'HR Team', 
      status: TicketStatus.OPEN, 
      priority: TicketPriority.MEDIUM, 
      createdAt: '5h ago', 
      category: 'Hardware' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid - 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 lg:p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center ${stat.color} shadow-sm`}>
                <i className={`fa-solid ${stat.icon} text-sm lg:text-lg`}></i>
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter hidden sm:block">30D View</div>
            </div>
            <h3 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
            <p className="text-xs font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue Management - Responsive table/list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h3 className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Queue Status</h3>
            <button className="text-blue-600 text-[10px] font-bold uppercase hover:underline tracking-widest">Full List</button>
          </div>
          
          {/* List View for Mobile */}
          <div className="block sm:hidden divide-y divide-slate-50">
            {recentTickets.map(ticket => (
              <div key={ticket.id} className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] text-blue-600 font-bold px-2 py-0.5 bg-blue-50 rounded-full">{ticket.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    ticket.status === TicketStatus.OPEN ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm leading-tight">{ticket.title}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-slate-400 font-medium">{ticket.requester} • {ticket.category}</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${ticket.priority === TicketPriority.HIGH ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{ticket.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table View for Tablet/Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold uppercase text-slate-400 tracking-widest border-b border-slate-50 bg-slate-50/20">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Issue Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors text-sm group">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">{ticket.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 line-clamp-1">{ticket.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">{ticket.requester} • {ticket.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                        ticket.status === TicketStatus.OPEN ? 'bg-blue-100 text-blue-700' :
                        ticket.status === TicketStatus.RESOLVED ? 'bg-green-100 text-green-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          ticket.priority === TicketPriority.HIGH ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]' :
                          ticket.priority === TicketPriority.MEDIUM ? 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]' :
                          'bg-slate-300'
                        }`}></div>
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{ticket.priority}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Performance Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-700 uppercase text-[10px] tracking-widest mb-6">AI Optimization</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                  <span className="text-slate-400">Resolution Rate</span>
                  <span className="text-blue-600">76%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: '76%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                  <span className="text-slate-400">Response Latency</span>
                  <span className="text-green-600">12ms</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full transition-all duration-1000" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
            <div className="flex items-center gap-2 mb-2 text-blue-600">
              <i className="fa-solid fa-lightbulb text-xs"></i>
              <h4 className="text-[10px] font-bold uppercase tracking-widest">AI Insight</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Significant spike in VPN queries from EMEA region. Auto-provisioning suggested.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
