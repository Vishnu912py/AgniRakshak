import React from 'react';
import { AlertTriangle, CheckCircle, Flame, History, Info, Trash2 } from 'lucide-react';
import { EventLogItem } from '../types/evacuation';

interface EventLogProps {
  events: EventLogItem[];
  onClearEvents?: () => void;
  maxHeight?: string;
}

export const EventLog: React.FC<EventLogProps> = ({ events, onClearEvents, maxHeight = 'h-72' }) => {
  const severityIcon = (severity: EventLogItem['severity']) => {
    switch (severity) {
      case 'danger': return <Flame className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" aria-hidden="true" />;
      case 'warning': return <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />;
      case 'success': return <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />;
      default: return <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" aria-hidden="true" />;
    }
  };

  return (
    <section className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <History className="h-4 w-4 text-orange-500" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-slate-100">Recent activity</h2>
        </div>
        {onClearEvents && events.length > 0 && (
          <button
            type="button"
            onClick={onClearEvents}
            aria-label="Clear activity"
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-rose-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className={`overflow-y-auto ${maxHeight}`}>
        {events.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">Nothing here yet.</p>
        ) : events.map((event) => (
          <div key={event.id} className="flex items-start gap-3 border-b border-slate-800 py-3 last:border-0">
            {severityIcon(event.severity)}
            <div className="min-w-0 flex-1">
              <p className="break-words text-sm leading-5 text-slate-300">{event.message}</p>
              <time className="mt-1 block text-[11px] text-slate-500">{event.timestamp}</time>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
