import React, { useState } from 'react';
import { TicketPriority, TicketStatus } from '../types';

interface TicketFormProps {
  onSuccess?: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: TicketPriority.MEDIUM,
    category: 'Software'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate calling the 'createTicket' tool
    console.log('Calling tool: createTicket', formData);
    
    // Artificial delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
    
    if (onSuccess) {
      setTimeout(onSuccess, 2000);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-xl animate-fade-in text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
          <i className="fa-solid fa-check text-3xl"></i>
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-2">Ticket Created!</h3>
        <p className="text-slate-500 mb-8 max-w-xs">
          Your request has been logged. TMC IT SUPPORT is already analyzing the best resolution path.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95"
        >
          Create Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in">
      <div className="bg-slate-900 p-6 lg:p-8 text-white">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
            <i className="fa-solid fa-plus text-xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight uppercase">New Support Ticket</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">TMC IT SUPPORT TICKETING</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Title</label>
            <input
              required
              type="text"
              placeholder="Briefly describe the problem..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 ring-blue-50 focus:border-blue-500 transition-all outline-none font-medium"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
            <select
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 ring-blue-50 focus:border-blue-500 transition-all outline-none font-medium appearance-none"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option>Software</option>
              <option>Hardware</option>
              <option>Network</option>
              <option>Access & Identity</option>
              <option>Security</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Description</label>
          <textarea
            required
            rows={4}
            placeholder="Explain what's happening and any steps you've already taken..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 ring-blue-50 focus:border-blue-500 transition-all outline-none font-medium resize-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority Level</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[TicketPriority.LOW, TicketPriority.MEDIUM, TicketPriority.HIGH, TicketPriority.CRITICAL].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setFormData({...formData, priority: p})}
                className={`px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border-2 ${
                  formData.priority === p 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
              isSubmitting 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-circle-notch animate-spin"></i>
                Processing...
              </>
            ) : (
              <>
                Submit Ticket
                <i className="fa-solid fa-arrow-right"></i>
              </>
            )}
          </button>
          <button
            type="button"
            className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
            onClick={() => setFormData({ title: '', description: '', priority: TicketPriority.MEDIUM, category: 'Software' })}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;