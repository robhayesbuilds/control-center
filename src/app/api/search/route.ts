import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const WORKSPACE_DIR = process.env.WORKSPACE_DIR || "/home/openclaw/.openclaw/workspace";
const DATA_DIR = process.env.DATA_DIR || "/home/openclaw/.openclaw/workspace/control-center/data";

interface SearchResult {
  type: "document" | "memory" | "activity" | "task";
  title: string;
  content: string;
  path?: string;
  timestamp?: number;
  project?: string;
  highlights?: string[];
}

async function searchFiles(
  dir: string,
  query: string,
  results: SearchResult[],
  maxResults: number,
  baseDir: string = dir
): Promise<void> {
  if (results.length >= maxResults) return;
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (results.length >= maxResults) break;
      
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);
      
      // Skip node_modules, .git, .next, etc.
      if (
        entry.name.startsWith(".") ||
        entry.name === "node_modules" ||
        entry.name === ".next" ||
        entry.name === "dist" ||
        entry.name === "build"
      ) {
        continue;
      }
      
      if (entry.isDirectory()) {
        await searchFiles(fullPath, query, results, maxResults, baseDir);
      } else if (entry.name.endsWith(".md") || entry.name.endsWith(".txt")) {
        try {
          const content = await fs.readFile(fullPath, "utf-8");
          const lowerContent = content.toLowerCase();
          const lowerQuery = query.toLowerCase();
          
          if (lowerContent.includes(lowerQuery) || entry.name.toLowerCase().includes(lowerQuery)) {
            // Determine type
            let type: "document" | "memory" = "document";
            let project: string | undefined;
            
            if (relativePath.includes("memory/")) {
              type = "memory";
            }
            
            // Extract project from path
            const pathParts = relativePath.split("/");
            if (pathParts.length > 1 && !["memory", "research"].includes(pathParts[0])) {
              project = pathParts[0];
            }
            
            // Extract snippet around match
            const matchIndex = lowerContent.indexOf(lowerQuery);
            const snippetStart = Math.max(0, matchIndex - 100);
            const snippetEnd = Math.min(content.length, matchIndex + query.length + 100);
            const snippet = content.slice(snippetStart, snippetEnd).replace(/\n/g, " ");
            
            results.push({
              type,
              title: entry.name.replace(/\.(md|txt)$/, ""),
              content: snippet,
              path: relativePath,
              project,
            });
          }
        } catch (e) {
          // Skip files we can't read
        }
      }
    }
  } catch (e) {
    // Skip directories we can't read
  }
}

async function searchActivities(query: string, maxResults: number): Promise<SearchResult[]> {
  try {
    const data = await fs.readFile(path.join(DATA_DIR, "activities.json"), "utf-8");
    const activities = JSON.parse(data);
    const lowerQuery = query.toLowerCase();
    
    return activities
      .filter(
        (a: any) =>
          a.title.toLowerCase().includes(lowerQuery) ||
          (a.description?.toLowerCase().includes(lowerQuery))
      )
      .slice(0, maxResults)
      .map((a: any) => ({
        type: "activity" as const,
        title: a.title,
        content: a.description || "",
        timestamp: a.timestamp,
        project: a.project,
      }));
  } catch (e) {
    return [];
  }
}

async function searchTasks(query: string, maxResults: number): Promise<SearchResult[]> {
  try {
    const data = await fs.readFile(path.join(DATA_DIR, "tasks.json"), "utf-8");
    const tasks = JSON.parse(data);
    const lowerQuery = query.toLowerCase();
    
    return tasks
      .filter(
        (t: any) =>
          t.name.toLowerCase().includes(lowerQuery) ||
          (t.description?.toLowerCase().includes(lowerQuery))
      )
      .slice(0, maxResults)
      .map((t: any) => ({
        type: "task" as const,
        title: t.name,
        content: t.description || "",
        project: t.project,
      }));
  } catch (e) {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "20");
  
  if (!query || query.length < 2) {
    return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 });
  }
  
  // Search all sources in parallel
  const documentResults: SearchResult[] = [];
  
  await Promise.all([
    searchFiles(WORKSPACE_DIR, query, documentResults, limit, WORKSPACE_DIR),
  ]);
  
  const [activityResults, taskResults] = await Promise.all([
    searchActivities(query, limit),
    searchTasks(query, limit),
  ]);
  
  // Separate documents and memories
  const documents = documentResults.filter((r) => r.type === "document");
  const memories = documentResults.filter((r) => r.type === "memory");
  
  return NextResponse.json({
    documents,
    memories,
    activities: activityResults,
    tasks: taskResults,
  });
}
