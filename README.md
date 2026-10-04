# Context-Aware Portfolio

A high-performance personal portfolio built with Next.js, focused on Cybersecurity, Network Security, and IT Infrastructure. The platform showcases hands-on experience across security monitoring, system administration, networking, and infrastructure technologies, with projects featuring tools such as Wazuh and Zabbix. It is designed to present technical skills, projects, experience, certifications, and professional interests through a modern, interactive interface

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Library:** [shadcn/ui](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Key Features

- **Context Switching:** A global state management system that filters content based on user intent (`Network Engineer` | `Cloud` | `Server Administratior` | `Security`).
- **Data-First Architecture:** Content is decoupled from UI components, managed via structured data files (`src/lib/bio-data.ts`).
- **Terminal Aesthetic:** A clean, developer-centric design inspired by modern IDEs and obsidian tools.
- **Fully Responsive:** Optimized layouts for mobile, tablet, and desktop.

## Getting Started

1. **Clone the repository**
   ```bash
   git@github.com:arsadulislam/Neloy_portfolio.git
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
BD © 2026 Arsadul Islam
