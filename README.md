# Context-Aware Portfolio

A high-performance, polymorphic personal website built with **Next.js 14**. This platform features a custom "Mode Switcher" that dynamically recontextualizes the entire UI—filtering bio, skills, and projects to match a specific domain of interest (Generalist, Full Stack, AI/ML, or Data).

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Library:** [shadcn/ui](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Key Features

- **Context Switching:** A global state management system that filters content based on user intent (`Generalist` | `Full Stack` | `AI / ML` | `Data`).
- **Data-First Architecture:** Content is decoupled from UI components, managed via structured data files (`src/lib/bio-data.ts`).
- **Terminal Aesthetic:** A clean, developer-centric design inspired by modern IDEs and obsidian tools.
- **Fully Responsive:** Optimized layouts for mobile, tablet, and desktop.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Viraj-Mavani/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Run the development server**
    ```bash
    npm run dev
    ```

Open http://localhost:3000 with your browser to see the result.

## Project Structure

```
.
├── src/app         # Next.js App Router pages and layouts
├── src/components  # Reusable UI components and sections 
├── src/lib         # Static data sources (bio-data.ts, project-data.ts)
└── src/hooks       # Custom hooks, including the use-mode context logic

```

## License
MIT © 2026 Viraj Mavani