import React from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, Navigation, Trash2, User, Users } from 'lucide-react';
import { Person, EvacuationRoute } from '../types/evacuation';

interface PersonListProps {
  people: Person[];
  routes: EvacuationRoute[];
  selectedPersonId: string | null;
  onSelectPerson: (id: string | null) => void;
  onRemovePerson: (id: string) => void;
}

export const PersonList: React.FC<PersonListProps> = ({ people, routes, selectedPersonId, onSelectPerson, onRemovePerson }) => {
  const routeMap = new Map(routes.map((route) => [route.person_id, route]));

  return (
    <section className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-3 flex items-center gap-2.5 border-b border-slate-800 pb-3">
        <Users className="h-4 w-4 text-orange-500" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-slate-100">People</h2>
        <span className="ml-auto text-xs text-slate-500">{people.length}</span>
      </div>

      <div className="max-h-[380px] space-y-2 overflow-y-auto">
        {people.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">Add people to the map to get started.</p>
        ) : people.map((person) => {
          const route = routeMap.get(person.id);
          const selected = selectedPersonId === person.id;
          const trapped = person.status === 'TRAPPED' || route?.status === 'TRAPPED';
          const status = route?.status || person.status;
          const exit = route?.exit_id || person.assigned_exit;
          const distance = route?.distance ?? person.route_length;

          return (
            <article key={person.id} className={`rounded-xl border p-3 transition-colors ${
              selected ? 'border-orange-500/60 bg-orange-500/10' : trapped ? 'border-rose-500/30 bg-rose-500/5' : 'border-slate-800 bg-slate-950/40'
            }`}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectPerson(selected ? null : person.id)}
                  aria-pressed={selected}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
                >
                  <User className={`h-4 w-4 shrink-0 ${trapped ? 'text-rose-500' : 'text-sky-500'}`} aria-hidden="true" />
                  <span className="truncate text-sm font-medium text-slate-200">{person.label || person.id}</span>
                </button>
                <span className={`inline-flex items-center gap-1 text-[11px] ${
                  trapped ? 'text-rose-400' : status === 'EVACUATED' ? 'text-emerald-400' : status === 'EVACUATING' ? 'text-sky-400' : 'text-slate-500'
                }`}>
                  {trapped ? <AlertTriangle className="h-3.5 w-3.5" /> : status === 'EVACUATED' ? <CheckCircle2 className="h-3.5 w-3.5" /> : status === 'EVACUATING' ? <Navigation className="h-3.5 w-3.5" /> : null}
                  {trapped ? 'Trapped' : status === 'EVACUATED' ? 'Safe' : status === 'EVACUATING' ? 'Moving' : 'Waiting'}
                </span>
                <button
                  type="button"
                  onClick={() => onRemovePerson(person.id)}
                  aria-label={`Remove ${person.label || person.id}`}
                  className="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-800 hover:text-rose-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs">
                {trapped ? (
                  <span className="text-rose-400">No safe exit found</span>
                ) : route && route.path.length > 0 ? (
                  <>
                    <span className="text-slate-400">Exit {exit || '—'}</span>
                    <span className="inline-flex items-center gap-1 text-slate-500"><ArrowRight className="h-3 w-3" />{distance} steps</span>
                  </>
                ) : <span className="text-slate-500">Route not calculated</span>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
