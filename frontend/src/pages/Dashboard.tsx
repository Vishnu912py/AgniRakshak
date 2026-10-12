import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Compass, RefreshCw } from 'lucide-react';
import { DashboardCards } from '../components/DashboardCards';
import { EventLog } from '../components/EventLog';
import { evacuationApi } from '../services/api';
import { Building, EventLogItem, SimulationStateResponse } from '../types/evacuation';

const emptyStatus: SimulationStateResponse = {
  status: 'STOPPED',
  total_people: 0,
  evacuated: 0,
  evacuating: 0,
  trapped: 0,
  exits_count: 0,
  fire_zones_count: 0,
  recent_events: [],
};

export const Dashboard: React.FC = () => {
  const [status, setStatus] = useState<SimulationStateResponse>(emptyStatus);
  const [events, setEvents] = useState<EventLogItem[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statusRes, eventsRes, buildingsRes] = await Promise.all([
        evacuationApi.getStatus(),
        evacuationApi.getEvents(),
        evacuationApi.getBuildings(),
      ]);
      setStatus(statusRes);
      setEvents(eventsRes);
      setBuildings(buildingsRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = window.setInterval(fetchDashboardData, 5000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-orange-600">Building safety</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-100">Overview</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            A clear view of people, exits and current hazards.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={isLoading}
            aria-label="Refresh overview"
            className="rounded-lg border border-slate-800 p-2.5 text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-100 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/planner"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            <Compass className="h-4 w-4" />
            Open planner
          </Link>
        </div>
      </section>

      <DashboardCards
        totalPeople={status.total_people}
        evacuated={status.evacuated}
        evacuating={status.evacuating}
        trapped={status.trapped}
        exitsCount={status.exits_count}
        fireZonesCount={status.fire_zones_count}
        simulationStatus={status.status}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Building2 className="h-4 w-4 text-orange-500" />
              <h2 className="text-sm font-semibold text-slate-100">Saved layouts</h2>
            </div>
            <span className="text-xs text-slate-500">{buildings.length}</span>
          </div>
          {buildings.length === 0 ? (
            <p className="py-5 text-sm text-slate-500">Your saved layouts will appear here.</p>
          ) : (
            <ul className="divide-y divide-slate-800">
              {buildings.slice(0, 5).map((building) => (
                <li key={building.id} className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-200">{building.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {building.rows} × {building.columns} <span aria-hidden="true">·</span> {building.people.length} people
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="lg:col-span-2">
          <EventLog events={events} maxHeight="max-h-80" />
        </div>
      </div>
    </div>
  );
};
