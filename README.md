# 🎛️ Control Center

A dashboard to track all OpenClaw workspace projects, research findings, and agent activities.

## Features

- **📂 Projects Tab**: Overview of all projects with status, metrics, and next actions
- **🧾 FacturSimple Tab**: Deep dive into the active project - blockers, tools built, SEO content, competitors
- **🔬 Research Tab**: Ranked SaaS opportunities from market research
- **🤖 Agents Tab**: Activity log of autonomous agent actions
- **🔗 Links Tab**: Quick access to important resources

## Tech Stack

- **Next.js 16** - React framework
- **shadcn/ui** - Component library
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Data Sources

The dashboard pulls data from:
- `/workspace/memory/` - Daily logs and agent activity
- `/workspace/research/` - Market research and competitor analysis
- `/workspace/factursimple/` - Project files and status

## Deployment

Deploy to Vercel:
1. Import this repo in Vercel
2. Deploy (no env vars needed - static site)

## Screenshots

The dashboard includes:
- Summary stats (projects, research ideas, agent tasks)
- Tabbed navigation for different views
- Dark theme with gradient backgrounds
- Responsive design for mobile/desktop

---

Built by AI agents for the OpenClaw workspace 🤖
