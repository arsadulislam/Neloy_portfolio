// NOTE FOR PROJECT-DATA.TS: ALL BRIEF CONTENT SHOULD BE SIMILAR IN LENGTH TO MAINTAIN CONSISTENCY IN THE UI. 

export interface Project {
	title: string;
	brief: string;
	description: string[];
	tags: string[];
	github?: string;
	live?: string;
	images?: string[];
	banner?: string;
	video?: string;
	mode: string[];
}

export const projects: Project[] = [
	{ title: "Wazuh Security Monitoring Lab", brief: "Built a hands-on security monitoring lab with Wazuh to collect, analyze, and investigate security events, host activity, and logs in a controlled environment.", description: ["This lab explores practical security monitoring with Wazuh, focusing on centralized visibility across monitored endpoints and infrastructure.", "The work covers agent deployment, log collection, alert investigation, and an operational understanding of host and network security events."], tags: ["Wazuh", "Security Monitoring", "Log Monitoring", "Linux", "Cybersecurity"], images: ["/projects/wazuh1.png", "/projects/wazuh2.png"], mode: ["generalist", "devops"] },
	{ title: "Zabbix Network Monitoring Lab", brief: "Created a Zabbix lab for monitoring network devices, service availability, performance metrics, and infrastructure health through dashboards and alerts.", description: ["This project focuses on the observability practices needed to maintain reliable IT infrastructure and identify failures before service interruptions.", "The lab covers monitored hosts, availability checks, metrics, alerting, dashboards, and the operational workflow for responding to infrastructure signals."], tags: ["Zabbix", "Network Monitoring", "SNMP", "Dashboards", "Infrastructure"], images: ["/projects/zabbix1.png", "/projects/zabbix2.png"], mode: ["generalist", "networking", "devops"] },
	{ title: "MikroTik Network Infrastructure", brief: "Designed and configured a practical MikroTik network infrastructure environment covering routing, switching, VLANs, LAN/WAN connectivity, and troubleshooting.", description: ["This project demonstrates practical network engineering across core connectivity and segmentation concerns, from addressing and routing to VLAN-aware infrastructure.", "It also documents the troubleshooting mindset used to isolate connectivity, configuration, and performance issues in a structured way."], tags: ["MikroTik", "TCP/IP", "VLAN", "LAN/WAN", "Routing", "Switching"], mode: ["generalist", "networking"] },
	{ title: "GitHub Actions CI/CD Project", brief: "Developed a GitHub Actions workflow to automate validation, repeatable builds, and deployment steps for a practical software project.", description: ["This project applies CI/CD principles to reduce manual release work and make software changes easier to verify and deliver consistently.", "The workflow is designed around source control, automated checks, reproducible steps, and clear feedback from each pipeline run."], tags: ["Git", "GitHub Actions", "CI/CD", "Automation", "DevOps"], mode: ["generalist", "devops"] },
	{ title: "Linux Administration Lab", brief: "Built a Linux administration lab to practice users, permissions, services, processes, networking, shell operations, and system troubleshooting.", description: ["The lab provides a practical environment for developing the administration habits needed to operate Linux systems confidently and safely.", "Exercises cover common operational tasks, service management, permissions, networking diagnostics, scripting, and problem isolation."], tags: ["Linux", "Bash", "System Administration", "Networking", "Troubleshooting"], mode: ["generalist", "systems", "devops"] },
];
