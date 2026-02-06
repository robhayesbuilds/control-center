"use client";

import { useEffect, useState } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconRepeat,
  IconCalendarEvent,
  IconRefresh,
} from "@tabler/icons-react";

interface ScheduledTask {
  cronId: string;
  name: string;
  description?: string;
  schedule: {
    kind: string;
    everyMs?: number;
    atMs?: number;
    expr?: string;
  };
  enabled: boolean;
  project?: string;
}

interface WeekTask {
  task: ScheduledTask;
  occurrences: number[];
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatTime(ms: number): string {
  const date = new Date(ms);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarView() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [tasks, setTasks] = useState<WeekTask[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentWeekStart = getWeekStart(new Date());
  const displayWeekStart = new Date(
    currentWeekStart.getTime() + weekOffset * 7 * 24 * 60 * 60 * 1000
  );
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/tasks?weekStartMs=${displayWeekStart.getTime()}`
      );
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      console.error("Error fetching tasks:", e);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, [weekOffset]);
  
  // Generate week days
  const weekDays = DAYS.map((day, i) => {
    const date = new Date(displayWeekStart);
    date.setDate(date.getDate() + i);
    return { day, date };
  });
  
  // Group task occurrences by day
  const tasksByDay: Record<number, Array<{ task: ScheduledTask; time: number }>> = {};
  
  for (const { task, occurrences } of tasks) {
    for (const occurrence of occurrences) {
      const dayIndex = Math.floor(
        (occurrence - displayWeekStart.getTime()) / (24 * 60 * 60 * 1000)
      );
      if (dayIndex >= 0 && dayIndex < 7) {
        if (!tasksByDay[dayIndex]) {
          tasksByDay[dayIndex] = [];
        }
        tasksByDay[dayIndex].push({ task, time: occurrence });
      }
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <IconChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <IconChevronRight className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-medium text-white">
            {formatDate(displayWeekStart)} -{" "}
            {formatDate(
              new Date(displayWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
            )}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset(0)}
            className="px-3 py-1.5 text-sm bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={fetchTasks}
            disabled={loading}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <IconRefresh className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="bg-zinc-800/30 rounded-lg border border-zinc-700 overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-8 border-b border-zinc-700">
          <div className="p-3 text-sm text-zinc-500 border-r border-zinc-700">
            Time
          </div>
          {weekDays.map(({ day, date }, i) => {
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div
                key={i}
                className={`p-3 text-center border-r border-zinc-700 last:border-r-0 ${
                  isToday ? "bg-blue-500/10" : ""
                }`}
              >
                <div className="text-sm font-medium text-zinc-400">{day}</div>
                <div
                  className={`text-lg font-bold ${
                    isToday ? "text-blue-400" : "text-white"
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Task Summary by Day */}
        <div className="grid grid-cols-8">
          <div className="p-3 text-sm text-zinc-500 border-r border-zinc-700">
            Tasks
          </div>
          {weekDays.map((_, dayIndex) => {
            const dayTasks = tasksByDay[dayIndex] || [];
            const isToday =
              weekDays[dayIndex].date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={dayIndex}
                className={`p-2 border-r border-zinc-700 last:border-r-0 min-h-[300px] ${
                  isToday ? "bg-blue-500/5" : ""
                }`}
              >
                {dayTasks.length === 0 ? (
                  <div className="text-center text-zinc-600 text-sm py-8">
                    No tasks
                  </div>
                ) : (
                  <div className="space-y-1">
                    {dayTasks
                      .sort((a, b) => a.time - b.time)
                      .map(({ task, time }, i) => (
                        <div
                          key={i}
                          className="p-2 bg-zinc-700/50 hover:bg-zinc-700 rounded text-xs transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-1 text-zinc-400 mb-1">
                            {task.schedule.kind === "every" ? (
                              <IconRepeat className="w-3 h-3" />
                            ) : (
                              <IconCalendarEvent className="w-3 h-3" />
                            )}
                            <span>{formatTime(time)}</span>
                          </div>
                          <div className="font-medium text-white truncate">
                            {task.name}
                          </div>
                          {task.project && (
                            <div className="text-zinc-500 truncate">
                              {task.project}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Task Legend */}
      <div className="flex items-center gap-6 text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <IconRepeat className="w-4 h-4" />
          <span>Recurring Task</span>
        </div>
        <div className="flex items-center gap-2">
          <IconCalendarEvent className="w-4 h-4" />
          <span>One-time Task</span>
        </div>
        <div className="text-zinc-500">
          {tasks.length} active task{tasks.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
