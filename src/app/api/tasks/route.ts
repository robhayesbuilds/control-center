import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = process.env.DATA_DIR || "/home/openclaw/.openclaw/workspace/control-center/data";
const TASKS_FILE = path.join(DATA_DIR, "tasks.json");

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
  lastRun?: number;
  nextRun?: number;
  project?: string;
}

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {}
}

async function readTasks(): Promise<ScheduledTask[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(TASKS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeTasks(tasks: ScheduledTask[]) {
  await ensureDataDir();
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// GET - List tasks, optionally for a specific week
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const weekStartMs = searchParams.get("weekStartMs");
  const enabledOnly = searchParams.get("enabledOnly") === "true";
  
  let tasks = await readTasks();
  
  if (enabledOnly) {
    tasks = tasks.filter((t) => t.enabled);
  }
  
  // If weekStartMs provided, calculate occurrences for the week
  if (weekStartMs) {
    const weekStart = parseInt(weekStartMs);
    const weekEnd = weekStart + 7 * 24 * 60 * 60 * 1000;
    
    const weekTasks = tasks
      .filter((t) => t.enabled)
      .map((task) => {
        const occurrences: number[] = [];
        
        if (task.schedule.kind === "at" && task.schedule.atMs) {
          if (task.schedule.atMs >= weekStart && task.schedule.atMs < weekEnd) {
            occurrences.push(task.schedule.atMs);
          }
        } else if (task.schedule.kind === "every" && task.schedule.everyMs) {
          let nextOccurrence = task.nextRun || weekStart;
          while (nextOccurrence < weekEnd && occurrences.length < 50) {
            if (nextOccurrence >= weekStart) {
              occurrences.push(nextOccurrence);
            }
            nextOccurrence += task.schedule.everyMs;
          }
        }
        
        return { task, occurrences };
      })
      .filter(({ occurrences }) => occurrences.length > 0);
    
    return NextResponse.json(weekTasks);
  }
  
  return NextResponse.json(tasks);
}

// POST - Sync task from OpenClaw cron
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const task: ScheduledTask = {
    cronId: body.cronId,
    name: body.name,
    description: body.description,
    schedule: body.schedule,
    enabled: body.enabled ?? true,
    lastRun: body.lastRun,
    nextRun: body.nextRun,
    project: body.project,
  };
  
  const tasks = await readTasks();
  const existingIndex = tasks.findIndex((t) => t.cronId === task.cronId);
  
  if (existingIndex >= 0) {
    tasks[existingIndex] = task;
  } else {
    tasks.push(task);
  }
  
  await writeTasks(tasks);
  
  return NextResponse.json({ success: true, task });
}

// DELETE - Remove task
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cronId = searchParams.get("cronId");
  
  if (!cronId) {
    return NextResponse.json({ error: "cronId required" }, { status: 400 });
  }
  
  const tasks = await readTasks();
  const filtered = tasks.filter((t) => t.cronId !== cronId);
  await writeTasks(filtered);
  
  return NextResponse.json({ success: true });
}
