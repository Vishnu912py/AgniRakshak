import React from 'react';
import { Activity, CheckCircle2, Flame, Users, DoorOpen, AlertTriangle } from 'lucide-react';
import { SimStatus } from '../types/evacuation';

interface DashboardCardsProps {
  totalPeople: number;
  evacuated: number;
  evacuating: number;
  trapped: number;
  exitsCount: number;
  fireZonesCount: number;
  simulationStatus: SimStatus;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({
  totalPeople,
  evacuated,
  evacuating,
  trapped,
  exitsCount,
  fireZonesCount,
  simulationStatus,
}) => {
  const status = simulationStatus === 'ACTIVE'
    ? { label: 'Running', color: 'bg-emerald-500' }
    : simulationStatus === 'PAUSED'
    ? { label: 'Paused', color: 'bg-amber-500' }
    : { label: 'Ready', color: 'bg-slate-400' };

  const metrics = [
    { label: 'People', value: totalPeople, icon: Users, tone: 'text-slate-300' },
    { label: 'Safe', value: evacuated, icon: CheckCircle2, tone: 'text-emerald-400' },
    { label: 'Moving', value: evacuating, icon: Activity, tone: 'text-sky-400' },
    { label: 'Need help', value: trapped, icon: AlertTriangle, tone: trapped ? 'text-rose-400' : 'text-slate-400' },
  ];

  return (
    <section aria-label="Evacuation status" className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-3.5">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <span className={`h-2 w-2 rounded-full ${status.color}`} />
          Simulation {status.label.toLowerCase()}
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5"><DoorOpen className="h-3.5 w-3.5" />{exitsCount} exits</span>
          <span className="inline-flex items-center gap-1.5"><Flame className="h-3.5 w-3.5" />{fireZonesCount} active fires</span>
        </div>
      </div>
      <div className="grid grid-cols-2 divide-x divide-y divide-slate-800 sm:grid-cols-4 sm:divide-y-0">
        {metrics.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="flex items-center gap-3 px-5 py-4">
            <Icon className={`h-4 w-4 shrink-0 ${tone}`} aria-hidden="true" />
            <div>
              <p className="text-2xl font-semibold leading-none tracking-tight text-slate-100">{value}</p>
              <p className="mt-1.5 text-xs text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
