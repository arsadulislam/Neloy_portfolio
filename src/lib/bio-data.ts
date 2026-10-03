export interface HeroContent {
  [key: string]: {
    title: string
    description: string
  }
}

export interface AboutContent {
  [key: string]: string[];
}

export interface Education {
  degree: string
  school: string
  location: string
  period: string
  description: string
  focus?: string
  highlights?: string[]
}

export interface SkillCategory {
  label: string
  skills: string[]
}

export interface Experience {
  role: string
  company: string
  location: string
  period: string
  description: string
  tags: string[]
}

export interface Certificate {
  title: string
  issuer: string
  date: string
  credentialUrl: string
  modes: string[]
}

const legacyHeroContent: HeroContent= {
  generalist: {
    title: "Engineer",
    description: "Merging Full Stack Engineering with AI Research to create production-grade solutions."
  },
  fullstack: {
    title: "Full Stack Developer",
    description: "Architecting robust full-stack applications and high-performance APIs from frontend to database."
  },
  "ai-ml": {
    title: "Machine Learning Engineer",
    description: "Developing intelligent systems, predictive models, and optimizing neural networks for real-world applications."
  },
  data: {
    title: "Data Engineer",
    description: "Engineering distributed data pipelines, enterprise web scrapers, and processing millions of records with 99.9% uptime."
  }
}



const legacyEducation: Education[] = [

]

export const HeroContent: HeroContent = {
  generalist: {
    title: "IT Support & Network Engineer",
    description: "Building reliable IT infrastructure through hands-on support, network engineering, system administration, and security monitoring."
  },
  networking: {
    title: "Network Engineer",
    description: "Designing, troubleshooting, and securing dependable networks with MikroTik, TCP/IP, VLANs, routing, switching, OLT, and ONU infrastructure."
  },
  systems: {
    title: "Systems Administrator",
    description: "Managing Windows Server, Active Directory, Linux, DNS, DHCP, monitoring, and the operational systems that keep teams productive."
  },
  devops: {
    title: "DevOps & Security Engineer",
    description: "Growing into DevOps, cybersecurity, automation, and infrastructure monitoring with Docker, CI/CD, Bash, Python, Wazuh, and Zabbix."
  }
}

export const aboutContent: AboutContent = {
  generalist: [
    "I am Arsadul Islam, known professionally as Neloy, an IT Support and Network Engineer from Bangladesh with more than three years of experience in IT support, networking, infrastructure management, troubleshooting, and system administration.",
    "My work spans MikroTik, Active Directory, Windows Server, Linux, network security, monitoring, and day-to-day IT operations. I enjoy turning difficult technical problems into stable, understandable systems that people can rely on.",
    "I am currently deepening my skills in DevOps, cybersecurity, automation, and infrastructure monitoring through practical labs involving Docker, GitHub Actions, Wazuh, Zabbix, and Python."
  ],
};

export const education: Education[] = [
  {
    degree: "BSc in Computer Science & Engineering",
    school: "Dhaka International University",
    location: "Bangladesh",
    period: "2026 - Ongoing",
    focus: "Computer Science & Engineering",
    description: "Pursuing a Bachelor of Science in Computer Science & Engineering.",
  },
  {
    degree: "Diploma in Engineering",
    school: "Feni Computer Institute",
    location: "Bangladesh",
    period: "2019 - 2023",
    focus: "Data Telecommunication & Networking Technology",
    description: "Completed a Diploma in Engineering with a specialization in Data Telecommunication & Networking Technology.",
  },
]

export const skillCategories: SkillCategory[] = [
  { label: "Networking", skills: ["MikroTik", "TCP/IP", "VLAN", "LAN/WAN", "Routing", "Switching", "OLT", "ONU"] },
  { label: "System Administration", skills: ["Windows Server", "Active Directory", "Linux", "DNS", "DHCP"] },
  { label: "Monitoring & Security", skills: ["Wazuh", "Zabbix", "Network Security", "Log Monitoring"] },
  { label: "DevOps", skills: ["Docker", "Git", "GitHub Actions", "CI/CD", "Bash", "Python"] },
  { label: "IT Support", skills: ["Hardware Troubleshooting", "Software Troubleshooting", "ERP Support", "IT Asset Management"] },
]

export const experiences: Experience[] = [
  {
    role: "IT & Infrastructure Executive",
    company: "Betopia Group",
    location: "Bangladesh",
    period: "Apr 2024 - Present",
    description: "Manage and maintain IT infrastructure, network devices, servers, and endpoint systems to ensure reliable day-to-day operations. Monitor network performance, troubleshoot connectivity issues, and maintain stable network availability. Implement network security controls and monitor unauthorized access attempts to protect IT resources. Administer Active Directory, user accounts, organizational units, security policies, and access permissions. Manage and maintain corporate mail server infrastructure and resolve email-related issues. Manage access control systems and supporting servers, including configuration, monitoring, and maintenance. Diagnose hardware and software issues, perform preventive maintenance, and ensure smooth and uninterrupted IT operations.",
    tags: ["IT Infrastructure", "Network Administration", "Windows Server", "Active Directory", "Network Security", "Mail Server", "Access Control", "Hardware Support"],
  },
  {
    role: "Network Support Engineer",
    company: "Business Zone Ltd",
    location: "Bangladesh",
    period: "Sep 2023 - Mar 2024",
    description: "Configured and maintained MikroTik routers, OLT, ONU, and wireless devices for ISP and client networks. Supported internet connectivity and network performance issues for multiple clients, ensuring reliable service delivery. Monitored network performance to ensure stable and reliable connections.",
    tags: ["MikroTik", "OLT", "ONU", "Wireless Networks", "ISP Support", "Network Monitoring", "Troubleshooting"],
  },
]

export const certificates: Certificate[] = [
  {
    title: "Oracle Cloud Infrastructure Certified Foundations Associate",
    issuer: "Oracle",
    date: "Completed",
    credentialUrl: "",
    modes: ["generalist"],
  },
  {
    title: "OCNA",
    issuer: "Omada By Tp-Link",
    date: "Completed",
    credentialUrl: "",
    modes: ["generalist"],
  },
  {
    title: "AWS Cloud Practitioner Essentials",
    issuer: "Cisco Networking Academy",
    date: "Completed",
    credentialUrl: "",
    modes: ["generalist"],
  },
  {
    title: "IT Support Specialist",
    issuer: "Cisco Networking Academy",
    date: "Completed",
    credentialUrl: "",
    modes: ["generalist"],
  },
  {
    title: "Ethical Hacker",
    issuer: "Cisco Networking Academy",
    date: "Completed",
    credentialUrl: "",
    modes: ["generalist"],
  },
  {
    title: "CCNA Training",
    issuer: "Technology Polli",
    date: "Completed",
    credentialUrl: "",
    modes: ["generalist"],
  },
  {
    title: "MTCNA Training",
    issuer: "Technology Polli",
    date: "Completed",
    credentialUrl: "",
    modes: ["generalist"],
  },
  {
    title: "FTTx Deployment",
    issuer: "Technology Polli",
    date: "Completed",
    credentialUrl: "",
    modes: ["generalist"],
  },
]
