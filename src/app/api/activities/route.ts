import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = process.env.DATA_DIR || "/home/openclaw/.openclaw/workspace/control-center/data";
const ACTIVITIES_FILE = path.join(DATA_DIR, "activities.json");

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

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

async function readActivities(): Promise<Activity[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(ACTIVITIES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeActivities(activities: Activity[]) {
  await ensureDataDir();
  await fs.writeFile(ACTIVITIES_FILE, JSON.stringify(activities, null, 2));
}

// GET - List activities
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const category = searchParams.get("category");
  const project = searchParams.get("project");
  const type = searchParams.get("type");
  
  let activities = await readActivities();
  
  // Apply filters
  if (category) {
    activities = activities.filter((a) => a.category === category);
  }
  if (project) {
    activities = activities.filter((a) => a.project === project);
  }
  if (type) {
    activities = activities.filter((a) => a.type === type);
  }
  
  // Sort by timestamp descending and limit
  activities = activities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
  
  // Calculate stats
  const allActivities = await readActivities();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();
  const weekAgo = todayMs - 7 * 24 * 60 * 60 * 1000;
  
  const todayActivities = allActivities.filter((a) => a.timestamp >= todayMs);
  const weekActivities = allActivities.filter((a) => a.timestamp >= weekAgo);
  
  const byCategory: Record<string, number> = {};
  const byProject: Record<string, number> = {};
  
  for (const a of weekActivities) {
    byCategory[a.category] = (byCategory[a.category] || 0) + 1;
    if (a.project) {
      byProject[a.project] = (byProject[a.project] || 0) + 1;
    }
  }
  
  return NextResponse.json({
    activities,
    stats: {
      total: allActivities.length,
      today: todayActivities.length,
      thisWeek: weekActivities.length,
      byCategory,
      byProject,
    },
  });
}

// POST - Log new activity
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const activity: Activity = {
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    type: body.type || "unknown",
    title: body.title || "Untitled Activity",
    description: body.description,
    category: body.category || "system",
    project: body.project,
    metadata: body.metadata,
    status: body.status || "completed",
  };
  
  const activities = await readActivities();
  activities.unshift(activity);
  
  // Keep only last 10000 activities
  if (activities.length > 10000) {
    activities.splice(10000);
  }
  
  await writeActivities(activities);
  
  return NextResponse.json({ success: true, activity });
}
