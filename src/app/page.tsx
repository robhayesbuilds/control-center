"use client";

import { useState } from "react";
import { ActivityFeed } from "./_components/activity-feed";
import { CalendarView } from "./_components/calendar-view";
import { GlobalSearch } from "./_components/global-search";
import {
  IconActivity,
  IconCalendar,
  IconSearch,
  IconRobot,
  IconRefresh,
} from "@tabler/icons-react";

type Tab = "activity" | "calendar" | "search";

const tabs: { id: Tab; label: string; icon: typeof IconActivity }[] = [
  { id: "activity", label: "Activity Feed", icon: IconActivity },
  { id: "calendar", label: "Calendar", icon: IconCalendar },
  { id: "search", label: "Search", icon: IconSearch },
];

export default function MissionControl() {
  const [activeTab, setActiveTab] = useState<Tab>("activity");
  const [lastSync, setLastSync] = useState<Date>(new Date());
  
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <IconRobot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mission Control</h1>
                <p className="text-sm text-zinc-400">
                  Agent Activity Dashboard
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-zinc-500">
                Last sync: {lastSync.toLocaleTimeString()}
              </div>
              <button
                onClick={() => setLastSync(new Date())}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                title="Refresh"
              >
                <IconRefresh className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 mt-4 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                    isActive
                      ? "bg-zinc-800 text-white border-t border-l border-r border-zinc-700"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "activity" && <ActivityFeed />}
        {activeTab === "calendar" && <CalendarView />}
        {activeTab === "search" && <GlobalSearch />}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-zinc-500">
            <div>Mission Control v1.0</div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Agent Online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
