"use client";

import { useEffect, useState } from "react";
import {
  IconCode,
  IconSearch,
  IconMessage,
  IconRocket,
  IconSettings,
  IconFileText,
  IconGitCommit,
  IconBrandGithub,
  IconClock,
  IconPlayerPlay,
  IconCheck,
  IconX,
  IconLoader,
  IconRefresh,
} from "@tabler/icons-react";

interface Activity {
  id: string;
  timestamp: number;
  type: string;
  title: string;
  description?: string;
  category: string;
  project?: string;
  metadata?: any;
  status: string;
}

interface Stats {
  total: number;
  today: number;
  thisWeek: number;
  byCategory: Record<string, number>;
  byProject: Record<string, number>;
}

const typeIcons: Record<string, typeof IconCode> = {
  file_create: IconFileText,
  file_edit: IconFileText,
  search: IconSearch,
  deploy: IconRocket,
  research: IconSearch,
  message: IconMessage,
  cron: IconClock,
  spawn: IconPlayerPlay,
  commit: IconGitCommit,
  push: IconBrandGithub,
};

const statusColors: Record<string, string> = {
  completed: "text-green-500",
  running: "text-yellow-500",
  failed: "text-red-500",
};

const statusIcons: Record<string, typeof IconCheck> = {
  completed: IconCheck,
  running: IconLoader,
  failed: IconX,
};

function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - ts;
  
  if (diff < 60 * 60 * 1000) {
    const mins = Math.floor(diff / 60000);
    return mins === 0 ? "Just now" : `${mins}m ago`;
  }
  
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/activities?limit=100");
      if (!res.ok) throw new Error("Failed to fetch activities");
      const data = await res.json();
      setActivities(data.activities);
      setStats(data.stats);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchActivities();
    // Refresh every 30 seconds
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);
  
  if (loading && activities.length === 0) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-zinc-800 rounded-lg" />
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <IconX className="w-12 h-12 mx-auto mb-4 text-red-500" />
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchActivities}
          className="mt-4 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Stats Header */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
            <div className="text-3xl font-bold text-white">{stats.today}</div>
            <div className="text-sm text-zinc-400">Today</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
            <div className="text-3xl font-bold text-white">{stats.thisWeek}</div>
            <div className="text-sm text-zinc-400">This Week</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-zinc-400">All Time</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
            <div className="text-lg font-medium text-white">
              {Object.keys(stats.byProject).length}
            </div>
            <div className="text-sm text-zinc-400">Projects</div>
          </div>
        </div>
      )}
      
      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchActivities}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors disabled:opacity-50"
        >
          <IconRefresh className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>
      
      {/* Activity List */}
      <div className="space-y-2">
        {activities.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <IconClock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No activities recorded yet</p>
            <p className="text-sm mt-2">Activities will appear here as work is done</p>
          </div>
        ) : (
          activities.map((activity) => {
            const TypeIcon = typeIcons[activity.type] || IconFileText;
            const StatusIcon = statusIcons[activity.status] || IconCheck;
            
            return (
              <div
                key={activity.id}
                className="bg-zinc-800/30 hover:bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-zinc-700/50 rounded-lg">
                    <TypeIcon className="w-5 h-5 text-zinc-300" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white truncate">
                        {activity.title}
                      </span>
                      <StatusIcon
                        className={`w-4 h-4 ${statusColors[activity.status]} ${
                          activity.status === "running" ? "animate-spin" : ""
                        }`}
                      />
                    </div>
                    
                    {activity.description && (
                      <p className="text-sm text-zinc-400 line-clamp-2">
                        {activity.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                      <span>{formatTimestamp(activity.timestamp)}</span>
                      <span className="px-2 py-0.5 bg-zinc-700/50 rounded">
                        {activity.category}
                      </span>
                      {activity.project && (
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                          {activity.project}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
