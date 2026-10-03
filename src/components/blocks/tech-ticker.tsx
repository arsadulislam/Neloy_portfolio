"use client"

const techStack = [
  "MikroTik",
  "Cisco",
  "OLT / ONU",
  "Routing & Switching",
  "VLAN",
  "Active Directory",
  "Microsoft Entra ID",
  "Linux",
  "Windows Server",
  "AWS",
  "Microsoft 365",
  "Zabbix",
  "Wazuh",
  "Docker",
  "TrueNAS",
  "Hyper-V",
  "Nginx",
  "Apache",
]

export function TechTicker() {
  return (
    // <div className="flex h-full w-full flex-col overflow-hidden">
    //   <div className="flex items-center pt-2">
    //     <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase opacity-40">
    <div className="flex h-full w-full flex-col overflow-hidden"> {/*TODO: Since we removed GlowCard from here we need to add GlowCard somewhere fot the glow effect in bento  {/* Card 4 - Tech Stack Ticker (Small, Bottom Center) */}
      <div className="flex items-center pt-4">
        <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase opacity-60">
          tech_stack
        </span>
      </div>
      <div className="relative flex flex-1 items-center overflow-hidden">
        {/* Gradient Masks for smooth scroll edges */}
        {/* <div className="absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-background/80 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-background/80 to-transparent" /> */}
        
        <div className="flex animate-ticker gap-3 whitespace-nowrap px-4 hover:[animation-play-state:paused]">
          {[...techStack, ...techStack].map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="inline-flex items-center rounded-sm border border-border bg-card/50 px-2.5 py-1 font-mono text-[10px] text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:text-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
