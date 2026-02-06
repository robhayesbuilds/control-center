"use client";

import { useState, useMemo, useCallback } from "react";
import {
  IconSearch,
  IconFileText,
  IconBrain,
  IconClock,
  IconCalendar,
  IconFolder,
  IconX,
  IconLoader,
} from "@tabler/icons-react";

interface SearchResult {
  type: "document" | "memory" | "activity" | "task";
  title: string;
  content: string;
  path?: string;
  timestamp?: number;
  project?: string;
}

interface SearchResults {
  documents: SearchResult[];
  memories: SearchResult[];
  activities: SearchResult[];
  tasks: SearchResult[];
}

const typeIcons: Record<string, typeof IconFileText> = {
  document: IconFileText,
  memory: IconBrain,
  activity: IconClock,
  task: IconCalendar,
};

const typeColors: Record<string, string> = {
  document: "text-blue-400 bg-blue-500/20",
  memory: "text-purple-400 bg-purple-500/20",
  activity: "text-green-400 bg-green-500/20",
  task: "text-yellow-400 bg-yellow-500/20",
};

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-500/30 text-yellow-200 px-0.5 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const search = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults(null);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}&limit=30`
        );
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setResults(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Search failed");
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );
  
  const handleQueryChange = (value: string) => {
    setQuery(value);
    search(value);
  };
  
  // Combine and flatten results
  const allResults = useMemo(() => {
    if (!results) return [];
    
    const combined = [
      ...results.documents.map((r) => ({ ...r, type: "document" as const })),
      ...results.memories.map((r) => ({ ...r, type: "memory" as const })),
      ...results.activities.map((r) => ({ ...r, type: "activity" as const })),
      ...results.tasks.map((r) => ({ ...r, type: "task" as const })),
    ];
    
    if (activeFilter) {
      return combined.filter((r) => r.type === activeFilter);
    }
    
    return combined;
  }, [results, activeFilter]);
  
  // Count by type
  const counts = useMemo(() => {
    if (!results) return { document: 0, memory: 0, activity: 0, task: 0 };
    return {
      document: results.documents.length,
      memory: results.memories.length,
      activity: results.activities.length,
      task: results.tasks.length,
    };
  }, [results]);
  
  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search memories, documents, tasks..."
          className="w-full pl-12 pr-12 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        />
        {loading && (
          <IconLoader className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 animate-spin" />
        )}
        {!loading && query && (
          <button
            onClick={() => {
              setQuery("");
              setResults(null);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-700 rounded"
          >
            <IconX className="w-5 h-5 text-zinc-400" />
          </button>
        )}
      </div>
      
      {/* Filter Tabs */}
      {query.length >= 2 && results && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !activeFilter
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            All ({Object.values(counts).reduce((a, b) => a + b, 0)})
          </button>
          {(Object.entries(counts) as [string, number][])
            .filter(([_, count]) => count > 0)
            .map(([type, count]) => {
              const Icon = typeIcons[type];
              return (
                <button
                  key={type}
                  onClick={() =>
                    setActiveFilter(activeFilter === type ? null : type)
                  }
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeFilter === type
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {type.charAt(0).toUpperCase() + type.slice(1)}s ({count})
                </button>
              );
            })}
        </div>
      )}
      
      {/* Results */}
      {query.length < 2 ? (
        <div className="text-center py-16 text-zinc-500">
          <IconSearch className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Type at least 2 characters to search</p>
          <p className="text-sm mt-2">
            Search across memories, documents, activities, and scheduled tasks
          </p>
        </div>
      ) : loading && !results ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-zinc-800/50 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-400">
          <IconX className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>{error}</p>
        </div>
      ) : allResults.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <IconSearch className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No results found for &quot;{query}&quot;</p>
          <p className="text-sm mt-2">
            Try different keywords or check your spelling
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {allResults.map((result, i) => {
            const Icon = typeIcons[result.type] || IconFileText;
            const colorClass = typeColors[result.type] || "text-zinc-400 bg-zinc-700";
            
            const meta =
              result.path ||
              (result.timestamp
                ? new Date(result.timestamp).toLocaleString()
                : "") ||
              result.project ||
              "";
            
            return (
              <div
                key={i}
                className="p-4 bg-zinc-800/30 hover:bg-zinc-800/50 rounded-lg border border-zinc-700/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">
                        {highlightMatch(result.title, query)}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${colorClass}`}
                      >
                        {result.type}
                      </span>
                    </div>
                    
                    {result.content && (
                      <p className="text-sm text-zinc-400 line-clamp-2">
                        {highlightMatch(result.content.slice(0, 200), query)}
                      </p>
                    )}
                    
                    {meta && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                        <IconFolder className="w-3 h-3" />
                        <span className="truncate">{meta}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
