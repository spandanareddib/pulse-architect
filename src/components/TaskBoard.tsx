"use client";
import { CheckCircle2, Clock, ShieldAlert } from "lucide-react";

interface Task {
  title: string;
  priority: 'high' | 'medium' | 'low';
  role: string;
}

export default function TaskBoard({ tasks }: { tasks: Task[] }) {
  const getTasksByRole = (role: string) => 
    tasks.filter(t => t.role.toLowerCase().includes(role.toLowerCase()));

  const Column = ({ title, roleTasks, color }: { title: string, roleTasks: Task[], color: string }) => (
    <div className="flex flex-col gap-4 rounded-2xl bg-slate-900/40 p-4 border border-slate-800/50 h-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <h3 className={`font-bold uppercase tracking-wider text-[10px] ${color}`}>{title}</h3>
        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
          {roleTasks.length}
        </span>
      </div>
      
      {roleTasks.length === 0 && (
        <p className="text-[10px] text-slate-600 italic text-center py-4">No tasks generated for this role.</p>
      )}

      {roleTasks.map((task, i) => (
        <div key={i} className="group rounded-xl border border-slate-800 bg-slate-950 p-4 transition-all hover:border-blue-500/50">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-slate-200">{task.title}</p>
            {/* The Red Symbol: Shows only if priority is high */}
            {task.priority === 'high' && (
              <div className="flex items-center gap-1 text-red-500 shrink-0" title="High Priority">
                <ShieldAlert size={14} />
              </div>
            )}
          </div>
          
          <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>Est: 2-4h</span>
            </div>
            <div className="px-2 py-0.5 rounded bg-slate-800 text-[9px] uppercase font-bold">
              {task.priority}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Column title="Frontend" roleTasks={getTasksByRole('frontend')} color="text-blue-400" />
      <Column title="Backend" roleTasks={getTasksByRole('backend')} color="text-purple-400" />
      <Column title="DevOps / Infra" roleTasks={getTasksByRole('devops')} color="text-orange-400" />
    </div>
  );
}