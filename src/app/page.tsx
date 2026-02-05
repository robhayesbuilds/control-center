"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  IconFolder,
  IconFileInvoice,
  IconFlask,
  IconRobot,
  IconLink,
  IconBrandGithub,
  IconBrain,
  IconSearch,
  IconCloud,
  IconBrandTwitter,
  IconMessage,
  IconAlertTriangle,
  IconTool,
  IconArticle,
  IconPalette,
  IconSword,
  IconUsers,
  IconArrowRight,
  IconCheck,
  IconExternalLink,
} from "@tabler/icons-react";
import {
  projects,
  researchRankings,
  agentActivities,
  quickLinks,
  factursimpleStatus,
  summaryStats,
} from "@/lib/data";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusColor(status: string): string {
  switch (status) {
    case "active":
    case "completed":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "planning":
    case "in-progress":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "paused":
    case "blocked":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "recommended":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "consider":
      return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    case "parked":
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "high":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "low":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

function getLinkIcon(icon: string) {
  switch (icon) {
    case "github":
      return <IconBrandGithub className="h-5 w-5" />;
    case "folder":
      return <IconFolder className="h-5 w-5" />;
    case "brain":
      return <IconBrain className="h-5 w-5" />;
    case "search":
      return <IconSearch className="h-5 w-5" />;
    case "cloud":
      return <IconCloud className="h-5 w-5" />;
    case "twitter":
      return <IconBrandTwitter className="h-5 w-5" />;
    case "message":
      return <IconMessage className="h-5 w-5" />;
    default:
      return <IconLink className="h-5 w-5" />;
  }
}

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
              <IconBrain className="h-8 w-8 text-blue-400" />
              Control Center
            </h1>
            <p className="text-gray-400 mt-1">OpenClaw Workspace Dashboard</p>
          </div>
          <div className="text-right text-sm text-gray-400">
            <div>Last updated: {formatDate(new Date().toISOString())}</div>
            <div className="text-xs text-gray-500">Auto-refresh disabled</div>
          </div>
        </header>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-400">{summaryStats.totalProjects}</div>
              <div className="text-xs text-gray-400">Total Projects</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">{summaryStats.activeProjects}</div>
              <div className="text-xs text-gray-400">Active</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-400">{summaryStats.totalResearchIdeas}</div>
              <div className="text-xs text-gray-400">Research Ideas</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-cyan-400">{summaryStats.topResearchScore}</div>
              <div className="text-xs text-gray-400">Top Score</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">{summaryStats.agentActivitiesCompleted}</div>
              <div className="text-xs text-gray-400">Tasks Done</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-400">{summaryStats.agentActivitiesBlocked}</div>
              <div className="text-xs text-gray-400">Blocked</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="projects" className="data-[state=active]:bg-blue-600 gap-1.5">
              <IconFolder className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="factursimple" className="data-[state=active]:bg-blue-600 gap-1.5">
              <IconFileInvoice className="h-4 w-4" />
              FacturSimple
            </TabsTrigger>
            <TabsTrigger value="research" className="data-[state=active]:bg-blue-600 gap-1.5">
              <IconFlask className="h-4 w-4" />
              Research
            </TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-blue-600 gap-1.5">
              <IconRobot className="h-4 w-4" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="links" className="data-[state=active]:bg-blue-600 gap-1.5">
              <IconLink className="h-4 w-4" />
              Links
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge variant="outline" className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-400">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2">
                      {project.metrics.map((metric, i) => (
                        <div key={i} className="bg-gray-800/50 rounded p-2">
                          <div className="text-xs text-gray-400">{metric.label}</div>
                          <div className="text-sm font-semibold text-white">{metric.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Next Actions */}
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Next Actions:</div>
                      <ul className="space-y-1">
                        {project.nextActions.slice(0, 3).map((action, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                            <IconArrowRight className="h-3.5 w-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Links */}
                    {project.links.length > 0 && (
                      <div className="flex gap-2 pt-2">
                        {project.links.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full text-blue-400 transition-colors flex items-center gap-1"
                          >
                            {link.label}
                            <IconExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-gray-500 pt-2">
                      Updated: {formatDate(project.updatedAt)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FacturSimple Tab */}
          <TabsContent value="factursimple" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Blockers (Priority) */}
              <Card className="bg-red-950/20 border-red-900/50">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <IconAlertTriangle className="h-5 w-5" />
                    Current Blockers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {factursimpleStatus.blockers.map((blocker, i) => (
                      <div key={i} className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-white">{blocker.issue}</span>
                          <Badge variant="outline" className={getPriorityColor(blocker.priority)}>
                            {blocker.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">{blocker.resolution}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Free Tools */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconTool className="h-5 w-5 text-primary" />
                    Free Tools Built
                  </CardTitle>
                  <CardDescription>Lead magnets and traffic drivers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {factursimpleStatus.freeTools.map((tool, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded p-3">
                        <span className="text-white">{tool.name}</span>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-gray-400">{tool.path}</code>
                          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                            {tool.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* SEO Articles */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconArticle className="h-5 w-5 text-primary" />
                    SEO Articles ({factursimpleStatus.seoArticles.length})
                  </CardTitle>
                  <CardDescription>14 days ahead of content calendar</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {factursimpleStatus.seoArticles.map((article, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <IconCheck className="h-4 w-4 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{article}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Landing Page Features */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconPalette className="h-5 w-5 text-primary" />
                    Landing Page Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {factursimpleStatus.landingPageFeatures.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <IconCheck className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Competitors */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconSword className="h-5 w-5 text-primary" />
                    Competitor Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {factursimpleStatus.competitors.map((comp, i) => (
                      <div key={i} className="bg-gray-800/50 rounded p-2 flex justify-between items-center">
                        <div>
                          <span className="font-medium text-white">{comp.name}</span>
                          <span className="text-gray-400 text-sm ml-2">{comp.price}</span>
                        </div>
                        <span className="text-xs text-gray-500">{comp.weakness}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* French Communities */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconUsers className="h-5 w-5 text-primary" />
                    French Communities
                  </CardTitle>
                  <CardDescription>Ready for engagement once deployed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {factursimpleStatus.frenchCommunities.map((comm, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded p-2">
                        <span className="text-white">{comm.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-gray-700/50 text-gray-300 border-gray-600">
                            {comm.type}
                          </Badge>
                          <span className="text-xs text-gray-400">{comm.members}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Research Tab */}
          <TabsContent value="research" className="mt-6">
            <div className="space-y-4">
              {researchRankings.map((item, i) => (
                <Card key={item.id} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-gray-600">#{i + 1}</div>
                        <div>
                          <h3 className="font-semibold text-white">{item.title}</h3>
                          <p className="text-sm text-gray-400">{item.validation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-3 py-1">
                          <span className="text-sm font-bold text-white">{item.score}/10</span>
                        </div>
                      </div>
                    </div>
                    <Separator className="my-3 bg-gray-800" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Market Size:</span>
                        <span className="text-white ml-2">{item.marketSize}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Time to Revenue:</span>
                        <span className="text-white ml-2">{item.timeToRevenue}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="mt-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconRobot className="h-5 w-5 text-primary" />
                  Agent Activity Log
                </CardTitle>
                <CardDescription>Recent autonomous agent actions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {agentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                              {activity.agent}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-300">{activity.action}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Links Tab */}
          <TabsContent value="links" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 rounded-lg p-4 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                      {getLinkIcon(link.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white group-hover:text-blue-400 transition-colors">
                        {link.label}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{link.url}</div>
                    </div>
                    <IconExternalLink className="h-4 w-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-600 pt-8">
          <p>OpenClaw Control Center • Built by AI agents for Rob</p>
        </footer>
      </div>
    </main>
  );
}
