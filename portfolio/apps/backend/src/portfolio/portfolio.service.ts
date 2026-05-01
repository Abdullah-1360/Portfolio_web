import { Injectable } from '@nestjs/common';

@Injectable()
export class PortfolioService {
  private readonly personalInfo = {
    name: 'Abdullah Shahid',
    title: 'AI Automation Engineer',
    email: 'abdullahshahid906@gmail.com',
    phone: '+92 322 5097057',
    location: 'Rawalpindi, Pakistan',
    github: 'https://github.com/Abdullah-1360',
    linkedin: 'https://www.linkedin.com/in/abdullah-shahid-ba978b221',
    portfolio: 'https://abdullah-1360.github.io/Portfolio_web/',
    bio: 'AI Automation Engineer & Full-Stack Developer with a proven track record of reducing operational overhead by up to 60% through intelligent workflow design. Expert in bridging legacy systems with modern AI tools (n8n, UChat) and building scalable Node.js backends. Committed to delivering measurable business impact through seamless API integrations and data-driven process optimization.',
    bio2: 'Passionate about continuous learning, I stay aligned with the latest automation tools, APIs, and industry trends. My approach prioritizes clarity, reliability, and problem-solving — ensuring every workflow I design delivers measurable impact. Whether it\'s building chatbot logic, integrating complex APIs, or designing robust multi-step automations, I strive to create high-quality solutions that empower teams and streamline operations.',
  };

  private readonly skills = [
    // Automation
    { name: 'n8n',           level: 92, category: 'Automation' },
    { name: 'UChat',         level: 88, category: 'Automation' },
    { name: 'AI Workflows',  level: 90, category: 'Automation' },
    // AI / LLM Ops
    { name: 'MCP Dev',       level: 85, category: 'AI / LLM Ops' },
    { name: 'LLM Quant.',    level: 80, category: 'AI / LLM Ops' },
    { name: 'Prompt Eng.',   level: 88, category: 'AI / LLM Ops' },
    { name: 'Ollama',        level: 82, category: 'AI / LLM Ops' },
    // Full-Stack
    { name: 'Node.js',       level: 88, category: 'Full-Stack' },
    { name: 'Express.js',    level: 85, category: 'Full-Stack' },
    { name: 'MongoDB',       level: 82, category: 'Full-Stack' },
    { name: 'Flutter/Dart',  level: 90, category: 'Full-Stack' },
    { name: 'Python',        level: 80, category: 'Full-Stack' },
    // DevOps & Infra
    { name: 'Ansible',       level: 78, category: 'DevOps & Infra' },
    { name: 'Linux Admin',   level: 80, category: 'DevOps & Infra' },
    { name: 'Git',           level: 88, category: 'DevOps & Infra' },
    { name: 'WHM/cPanel',    level: 75, category: 'DevOps & Infra' },
  ];

  private readonly projects = [
    {
      id: '1',
      title: 'JetBackup 5 Monitoring & Self-Healing System',
      description: 'Closed-loop backup remediation pipeline on the LOPA stack — detects failed/partial/missed backups across 5+ cPanel servers, auto-retries targeted accounts via JetBackup API, and publishes a live 5-tab Google Sheets dashboard. Zero human intervention required.',
      technologies: ['Ansible EDA', 'Python', 'JetBackup API', 'WHM API', 'Prometheus', 'Loki', 'Google Sheets API'],
      category: 'AI / Automation',
      githubUrl: 'https://github.com/Abdullah-1360/Ansible-Automations',
      liveUrl: null,
      featured: true,
    },
    {
      id: '2',
      title: 'Automated Server Analysis Platform',
      description: 'Self-healing infrastructure platform that scans 10,000+ assets, auto-diagnoses issues across WordPress/Laravel/Node.js stacks, and remediates via SSH — no human needed.',
      technologies: ['NestJS', 'Next.js', 'BullMQ', 'SSH', 'RBAC', 'SSE', 'Node.js'],
      category: 'AI / Automation',
      githubUrl: 'https://github.com/Abdullah-1360/Control_panel_final',
      liveUrl: null,
      featured: true,
    },
    {
      id: '3',
      title: 'Automated Bot System',
      description: 'WhatsApp + CRM chatbot that cut manual support work by 60% and response time by 90%, integrating n8n, UChat, WHMCS, and VTiger through a custom Node.js middleware.',
      technologies: ['n8n', 'UChat', 'Node.js', 'WHMCS', 'WHM', 'VTiger'],
      category: 'AI / Automation',
      githubUrl: 'https://github.com/Abdullah-1360/sales_chatbot',
      liveUrl: null,
      featured: true,
    },
    {
      id: '4',
      title: 'AI Plant Diagnostics',
      description: 'End-to-end plant disease classifier — Python ML model, Flutter mobile app, Node.js/MongoDB backend, and a real-time Admin Panel connecting farmers with pathologists instantly.',
      technologies: ['Python', 'Flutter', 'Node.js', 'MongoDB', 'Bloc', 'Provider'],
      category: 'AI / ML',
      githubUrl: 'https://github.com/Abdullah-1360/FYP_backend',
      liveUrl: null,
      featured: true,
    },
    {
      id: '5',
      title: 'ChatBot with MCP',
      description: 'Chatbot powered by Model Context Protocol — gives an LLM secure, real-time access to live data sources, enabling true agentic reasoning beyond static knowledge.',
      technologies: ['MCP', 'Node.js', 'LLM', 'TypeScript'],
      category: 'AI / LLM Ops',
      githubUrl: 'https://github.com/Abdullah-1360/ChatBot_with_MCP/tree/master',
      liveUrl: null,
      featured: true,
    },
    {
      id: '6',
      title: 'Spotify Clone',
      description: 'Full-featured music streaming app with auth, playlists, and audio playback — Flutter frontend backed by a FastAPI/Python server.',
      technologies: ['Flutter', 'FastAPI', 'Python', 'Riverpod'],
      category: 'Learning Project',
      githubUrl: 'https://github.com/Abdullah-1360/Spotify-clone',
      liveUrl: null,
      featured: false,
    },
    {
      id: '7',
      title: 'Task Management App',
      description: 'Offline-first productivity app with task creation, categories, reminders, and progress tracking — all stored locally via SQLite.',
      technologies: ['Flutter', 'SQLite', 'Provider', 'Local Notifications'],
      category: 'Learning Project',
      githubUrl: 'https://github.com/Abdullah-1360/task-manager',
      liveUrl: null,
      featured: false,
    },
    {
      id: '8',
      title: 'Social Media App',
      description: 'Real-time social platform with posts, comments, likes, and live messaging — built on Firebase Cloud Firestore with Flutter.',
      technologies: ['Flutter', 'Firebase', 'Cloud Firestore', 'Firebase Auth'],
      category: 'Learning Project',
      githubUrl: 'https://github.com/Abdullah-1360/social-app',
      liveUrl: null,
      featured: false,
    },
  ];

  private readonly experiences = [
    {
      id: '1',
      title: 'AI Automation Engineer',
      company: 'HostBreak',
      location: 'Islamabad, Pakistan',
      startDate: '2025-10-01',
      endDate: null,
      description: 'Leading AI & infrastructure engineering — building self-healing systems, LLM integrations, and intelligent automations that manage 10,000+ production assets.',
      responsibilities: [
        'Architected MCP servers granting LLMs secure, real-time database access for agentic reasoning.',
        'Deployed GGUF/AWQ-quantized models on consumer hardware, cutting infrastructure costs significantly.',
        'Designed Ansible playbooks for automated server provisioning, ensuring 100% environment consistency.',
        'Engineered a NestJS/Next.js platform that autonomously remediates issues across 10,000+ assets via SSH job queues.',
        'Cut support response times by 40% with intelligent WhatsApp chatbot logic via UChat and n8n.',
        'Eliminated 60% of manual processing through Node.js middleware integrating WHMCS, WHM, and internal CRMs.',
        'Drove lead conversion with 100% real-time CRM tracking and automated multi-step follow-up sequences.',
      ],
      technologies: ['n8n', 'UChat', 'NestJS', 'Next.js', 'Ansible', 'MCP', 'BullMQ', 'Node.js', 'SSH'],
    },
    {
      id: '2',
      title: 'Node.js Developer',
      company: 'Freelance',
      location: 'Remote',
      startDate: '2024-11-01',
      endDate: '2026-01-01',
      description: 'Built secure, scalable RESTful APIs and managed cross-platform deployments for production mobile and web applications.',
      responsibilities: [
        'Engineered secure, scalable RESTful APIs using Express.js and MongoDB, managing user authentication via JWT for high-traffic environments.',
        'Streamlined cross-platform deployment across Render, Vercel, and Railway, ensuring 99.9% uptime for production apps.',
      ],
      technologies: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'Render', 'Vercel', 'Railway'],
    },
    {
      id: '3',
      title: 'Flutter Developer',
      company: 'Freelance',
      location: 'Remote',
      startDate: '2024-09-01',
      endDate: '2025-10-01',
      description: 'Built cross-platform mobile apps with AI integration, growing into full-stack Node.js development for production APIs.',
      responsibilities: [
        'Built an AI plant disease classifier — Python ML model, Flutter frontend, Node.js/MongoDB backend.',
        'Engineered a custom Admin Panel with real-time pathologist-to-client communication using Bloc/Provider.',
        'Developed secure RESTful APIs with Express.js and MongoDB, JWT auth for high-traffic environments.',
        'Deployed mobile-to-backend services across Render, Vercel, and Railway — 99.9% uptime maintained.',
      ],
      technologies: ['Flutter', 'Dart', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Python', 'Bloc'],
    },
    {
      id: '4',
      title: 'Mobile App Developer Intern',
      company: 'K-Soft',
      location: 'Pakistan',
      startDate: '2024-06-01',
      endDate: '2024-09-01',
      description: 'Internship focused on mobile app development. Gained hands-on experience in full-stack development and agile methodologies.',
      responsibilities: [
        'Developed mobile applications using Flutter framework.',
        'Built backend services with Node.js and Express.js.',
        'Worked with MongoDB for data management.',
        'Participated in agile development processes.',
        'Collaborated with senior developers on code reviews.',
      ],
      technologies: ['Flutter', 'Node.js', 'MongoDB', 'Express.js'],
    },
    {
      id: '5',
      title: 'Android Developer',
      company: 'Freelance',
      location: 'Remote',
      startDate: '2024-03-01',
      endDate: '2024-06-01',
      description: 'Developed Android applications using Java, focusing on Firebase integration and modern UI patterns.',
      responsibilities: [
        'Developed Android applications using Java and Android Studio.',
        'Integrated Firebase for real-time data and RecyclerView-based dynamic UIs.',
        'Implemented modern Material Design patterns and responsive layouts.',
      ],
      technologies: ['Java', 'Android Studio', 'Firebase', 'RecyclerView'],
    },
  ];

  private readonly education = {
    degree: 'BS Computer Science',
    institution: 'Riphah International University',
    location: 'Islamabad, Pakistan',
    startDate: '2022-03-01',
    endDate: '2025-12-01',
    cgpa: '3.47',
  };

  private readonly certificates = [
    { name: 'Graphic Design', issuer: 'Cisco', date: '02/2022' },
    { name: 'IT Essentials', issuer: 'Cisco', date: '06/2022' },
    { name: 'Programming Fundamentals', issuer: 'Cisco', date: '07/2022' },
  ];

  getAll() {
    return {
      personalInfo: this.personalInfo,
      skills: this.skills,
      projects: this.projects,
      experiences: this.experiences,
      education: this.education,
      certificates: this.certificates,
    };
  }

  getProjects()     { return this.projects; }
  getSkills()       { return this.skills; }
  getExperiences()  { return this.experiences; }
  getEducation()    { return this.education; }
  getCertificates() { return this.certificates; }
}
