"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { headerReveal, staggerContainer } from "@/lib/animations"

const terminalLines = [
  { type: "command", text: "$ systemctl status network-monitor" },
  { type: "blank", text: "" },
  { type: "output", text: "* Network Monitoring Service" },
  { type: "output", text: "    Status: Active" },
  { type: "output", text: "    Network: Connected" },
  { type: "output", text: "    Router: MikroTik CCR2116" },
  { type: "output", text: "    Monitoring: Wazuh + Zabbix" },
  { type: "blank", text: "" },
  { type: "output", text: ">> Checking infrastructure..." },
  { type: "output", text: ">> Network status: ONLINE" },
  { type: "output", text: ">> Security monitoring: ACTIVE" },
  { type: "status", text: "Network ok Cloud ok Security ok" },
  { type: "output", text: ">> All systems operational_" },
]
/*const terminalLines = [
  { type: "command", text: "const engineer = {" },
  { type: "output", text: "  name: 'Neloy'," },
  { type: "output", text: "  focus: 'Network & Infrastructure Engineering'," },
  { type: "output", text: "  skills: ['MikroTik', 'VLAN Design', 'Zabbix', 'Azure AD', 'Wazuh']," },
  { type: "output", text: "  growing: ['Cloud', 'Server Administration']," },
  { type: "output", text: "  available: true," },
  { type: "output", text: "  motto: \"Design it secure. Keep it running.\"" },
  { type: "output", text: "};" },
  { type: "blank", text: "" },
  { type: "output", text: "engineer.deploy();_" },
];*/

export function TerminalCard() {
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= terminalLines.length) {
          return 0
        }
        return prev + 1
      })
    }, 650)
    return () => clearInterval(interval)
  }, [])

  const getLineColor = (type: string) => {
    switch (type) {
      case "comment":
        return "text-muted-foreground"
      case "import":
      case "command":
        return "text-primary"
      case "output":
        return "text-emerald-400"
      default:
        return "text-foreground"
    }
  }

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="flex h-full flex-col overflow-hidden"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <div className="flex gap-1.5">
          <motion.span variants={headerReveal} className="h-2.5 w-2.5 rounded-full bg-red-500/70" aria-hidden="true" />
          <motion.span variants={headerReveal} className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" aria-hidden="true" />
          <motion.span variants={headerReveal} className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" aria-hidden="true" />
        </div>
        <motion.span variants={headerReveal} className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
          NETWORK_MONITOR.SH
        </motion.span>
      </div>
      <div className="flex-1 overflow-hidden p-4" aria-label="Terminal animation showing network monitoring service status">
        <pre className="font-mono text-[11.5px] lg:text-xs leading-relaxed">
          {terminalLines.slice(0, visibleLines).map((line, i) => (
            <div key={`${line.text}-${i}`} className={`${getLineColor(line.type)} transition-opacity duration-200`}>
              {line.type === "status" ? (
                <>
                  <span className="text-sky-400">Network</span>{" "}
                  <span className="text-emerald-400">ok</span>{"  "}
                  <span className="text-sky-400">Cloud</span>{" "}
                  <span className="text-emerald-400">ok</span>{"  "}
                  <span className="text-sky-400">Security</span>{" "}
                  <span className="text-emerald-400">ok</span>
                </>
              ) : line.text || "\u00A0"}
            </div>
          ))}
          <span className="inline-block h-3.5 w-1.5 animate-pulse bg-primary" aria-hidden="true" />
        </pre>
      </div>
    </motion.div>
  )
}
