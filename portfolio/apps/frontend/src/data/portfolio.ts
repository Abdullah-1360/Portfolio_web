import type { PortfolioData } from '@/types';

export const portfolioData: PortfolioData = {
  personalInfo: {
    name: 'Abdullah Shahid',
    title: 'AI Automation Engineer',
    email: 'abdullahshahid906@gmail.com',
    phone: '+92 322 5097057',
    location: 'Rawalpindi, Pakistan',
    github: 'https://github.com/Abdullah-1360',
    linkedin: 'https://www.linkedin.com/in/abdullah-shahid-ba978b221',
    portfolio: 'https://abdullah-1360.github.io/Portfolio_web/',
    // Human voice, first person, no buzzword soup
    bio: "I build systems that think. As an AI Automation Engineer at HostBreak, I've cut operational overhead by 60%, wired LLMs into live infrastructure, and shipped self-healing platforms that manage 10,000+ servers — without a human in the loop.",
    bio2: "I'm drawn to the intersection of AI and real infrastructure: MCP servers, LLM quantization, n8n workflows, and Node.js backends that actually hold up under load. Currently exploring AI voice agents and autonomous server remediation.",
  },

  skills: [
    { name: 'LangGraph',        level: 'Proficient' as const,  category: 'AI / LLM Ops' },
    { name: 'LangChain',        level: 'Proficient' as const,  category: 'AI / LLM Ops' },
    { name: 'Multi-LLM Router', level: 'Proficient' as const,  category: 'AI / LLM Ops' },
    { name: 'MCP Dev',          level: 'Proficient' as const,  category: 'AI / LLM Ops' },
    { name: 'LLM Quant.',       level: 'Familiar'   as const,  category: 'AI / LLM Ops' },
    { name: 'Prompt Eng.',      level: 'Proficient' as const,  category: 'AI / LLM Ops' },
    { name: 'Ollama',           level: 'Familiar'   as const,  category: 'AI / LLM Ops' },
    { name: 'n8n',              level: 'Proficient' as const,  category: 'Automation' },
    { name: 'UChat',            level: 'Proficient' as const,  category: 'Automation' },
    { name: 'AI Workflows',     level: 'Proficient' as const,  category: 'Automation' },
    { name: 'Ansible EDA',      level: 'Proficient' as const,  category: 'Automation' },
    { name: 'FastAPI',          level: 'Proficient' as const,  category: 'Full-Stack' },
    { name: 'PostgreSQL',       level: 'Proficient' as const,  category: 'Full-Stack' },
    { name: 'Node.js',          level: 'Proficient' as const,  category: 'Full-Stack' },
    { name: 'Express.js',       level: 'Proficient' as const,  category: 'Full-Stack' },
    { name: 'MongoDB',          level: 'Proficient' as const,  category: 'Full-Stack' },
    { name: 'Flutter/Dart',     level: 'Proficient' as const,  category: 'Full-Stack' },
    { name: 'Python',           level: 'Proficient' as const,  category: 'Full-Stack' },
    { name: 'Redis',            level: 'Proficient' as const,  category: 'DevOps & Infra' },
    { name: 'Ansible',          level: 'Familiar'   as const,  category: 'DevOps & Infra' },
    { name: 'Linux Admin',      level: 'Familiar'   as const,  category: 'DevOps & Infra' },
    { name: 'Git',              level: 'Proficient' as const,  category: 'DevOps & Infra' },
    { name: 'WHM/cPanel',       level: 'Familiar'   as const,  category: 'DevOps & Infra' },
  ],

  projects: [
    {
      id: 'hr-ai',
      title: 'HR_AI: Multi-Agent AI Hiring Platform & Automated DevOps Engine',
      description: 'Enterprise-grade candidate evaluation platform leveraging a stateful LangGraph multi-agent architecture, dynamic fallback routing across 6+ LLM backends (Gemini, OpenAI, Groq, Mistral, Cohere, Cerebras), and an automated stealth Git CI/CD sync pipeline.',
      technologies: ['LangGraph', 'LangChain', 'FastAPI', 'Python', 'PostgreSQL', 'Redis', 'Multi-LLM Routing', 'Git Automation', 'Linux Cron', 'Docker'],
      category: 'AI / LLM Ops',
      githubUrl: '/404',
      liveUrl: '/404',
      featured: true,
      longDescription: `HR_AI is an enterprise-grade AI Hiring & Candidate Evaluation Platform engineered to automate and optimize recruitment workflows. Built upon a LangGraph multi-agent architecture, HR_AI transitions away from naive single-LLM implementations to an autonomous, resilient multi-provider orchestration system.

In addition to core hiring intelligence, HR_AI features an Automated DevOps Synchronization Pipeline—a self-contained background engine (scripts/auto_push.py) that performs intelligent, state-tracked, and stealth-scheduled code commits and repository pushes.`,
      architectureDiagram: `                               ┌──────────────────────────────┐
                               │       Frontend UI            │
                               │     React / Next.js          │
                               └─────────────┬────────────────┘
                                             │ REST / API Gateway
                               ┌─────────────▼────────────────┐
                               │       FastAPI Backend        │
                               │ Authentication & Middleware  │
                               └─────────────┬────────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       │                                           │
             ┌─────────▼───────────┐                     ┌─────────▼───────────┐
             │  PostgreSQL / Redis │                     │ Object / File Store │
             │ Job & Candidate DB  │                     │ Resumes & Artifacts │
             └─────────────────────┘                     └─────────────────────┘
                                             │
                              LangGraph Multi-Agent Orchestrator
                                             │
       ┌─────────────────────────────────────┴─────────────────────────────────────┐
       │                                                                           │
┌──────▼──────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌──────────▼────────┐
│ Resume      │   │ Job Specs   │   │ Candidate   │   │ HR Policy   │   │ Multi-Provider    │
│ Parser      │   │ Evaluator   │   │ Matcher     │   │ & Audit     │   │ Router Engine     │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘   └──────────┬────────┘
                                                                                   │
                                                          ┌────────────────────────┴────────────────────────┐
                                                          │ Gemini │ OpenAI │ Groq │ Mistral │ Cohere │ Cerebras │
                                                          └─────────────────────────────────────────────────┘`,
      keyInnovations: [
        {
          title: 'Multi-Agent LangGraph Workflow Engine',
          desc: 'Decoupled agent topology for resume parsing, job spec evaluation, candidate scoring, and policy compliance built on langgraph.graph.StateGraph for state propagation & intermediate checkpoints.'
        },
        {
          title: 'Resilient Multi-Provider LLM Router Engine',
          desc: 'Automatically routes requests across 6+ LLM providers (Gemini, OpenAI, Groq, Mistral, Cohere, Cerebras) with dynamic retry and tier switching on rate limits (429) or downtime (5xx).'
        },
        {
          title: 'Automated CI/CD & Repository Sync Engine',
          desc: 'Stealth background sync script running on an 8-hour cron cycle with randomized jitter delay (0-180m), state-aware history tracking (.pushed_history.json), and Conventional Commits generation.'
        }
      ],
      repoStructure: `HR_AI/
├── app/                      # Main application modules
├── router/                   # Multi-provider routing engine & DB logic
│   ├── db.py                 # PostgreSQL connection pool & schema utilities
│   └── router_node.py        # LangGraph routing node implementation
├── scripts/                  # Utilities & DevOps scripts
│   ├── auto_push.py          # Automated stealth GitHub sync engine
│   ├── .pushed_history.json  # Persistence state for auto-push pipeline
│   └── bulk_upload.py        # Bulk dataset ingestion pipeline
├── tests/                    # Comprehensive unit and integration test suite
├── graph.py                  # LangGraph core workflow graph & state schema
├── main.py                   # FastAPI app entrypoint & provider verification
├── plan.md                   # System architectural specifications
├── pyproject.toml            # Dependencies & build configuration
└── docker-compose.yml        # Multi-container orchestration (DB, Cache, App)`,
      demoCommands: [
        { label: 'Run Multi-Provider Router Test', cmd: 'python3 main.py' },
        { label: 'Run Sync Engine Manual Execution', cmd: 'python3 scripts/auto_push.py --no-delay' },
        { label: 'Schedule Stealth Cron Job (8 Hours)', cmd: '0 */8 * * * /usr/bin/python3 /home/ubuntu/HR_AI/scripts/auto_push.py >> /home/ubuntu/HR_AI/scripts/auto_push.log 2>&1' }
      ],
      highlights: [
        'Production-Grade Resilience: Solves real-world LLM API instability through automated fallback graphs.',
        'Full-Stack Engineering: Combines graph-based AI agent design with robust backend database pooling (PostgreSQL), task queues (Redis), and REST APIs.',
        'DevOps Automation Mastery: Demonstrates deep proficiency with Linux systems, Python subprocess management, Git workflow automation, and stealth scheduling logic.'
      ]
    },
    {
      id: 'jetbackup',
      title: 'JetBackup 5 Monitoring & Self-Healing System',
      description: 'Closed-loop backup remediation pipeline on the LOPA stack — detects failed/partial/missed backups across 5+ cPanel servers, auto-retries targeted accounts via JetBackup API, and publishes a live 5-tab Google Sheets dashboard. Zero human intervention required.',
      technologies: ['Ansible EDA', 'Python', 'JetBackup API', 'WHM API', 'Prometheus', 'Loki', 'Google Sheets API'],
      category: 'AI / Automation',
      githubUrl: 'https://github.com/Abdullah-1360/Ansible-Automations',
      liveUrl: null,
      featured: true,
    },
    {
      id: 'server-analysis',
      title: 'Automated Server Analysis Platform',
      description: 'Self-healing infrastructure platform that scans 10,000+ assets, auto-diagnoses issues across WordPress/Laravel/Node.js stacks, and remediates via SSH — no human needed.',
      technologies: ['NestJS', 'Next.js', 'BullMQ', 'SSH', 'RBAC', 'SSE', 'Node.js'],
      category: 'AI / Automation',
      githubUrl: 'https://github.com/Abdullah-1360/Control_panel_final',
      liveUrl: null,
      featured: true,
    },
    {
      id: 'sales-bot',
      title: 'Automated Bot System',
      description: 'WhatsApp + CRM chatbot that cut manual support work by 60% and response time by 90%, integrating n8n, UChat, WHMCS, and VTiger through a custom Node.js middleware.',
      technologies: ['n8n', 'UChat', 'Node.js', 'WHMCS', 'WHM', 'VTiger'],
      category: 'AI / Automation',
      githubUrl: 'https://github.com/Abdullah-1360/sales_chatbot',
      liveUrl: null,
      featured: true,
    },
    {
      id: 'plant-diag',
      title: 'AI Plant Diagnostics',
      description: 'End-to-end plant disease classifier — Python ML model, Flutter mobile app, Node.js/MongoDB backend, and a real-time Admin Panel connecting farmers with pathologists instantly.',
      technologies: ['Python', 'Flutter', 'Node.js', 'MongoDB', 'Bloc', 'Provider'],
      category: 'AI / ML',
      githubUrl: 'https://github.com/Abdullah-1360/FYP_backend',
      liveUrl: null,
      featured: true,
    },
    {
      id: 'mcp-bot',
      title: 'ChatBot with MCP',
      description: 'Chatbot powered by Model Context Protocol — gives an LLM secure, real-time access to live data sources, enabling true agentic reasoning beyond static knowledge.',
      technologies: ['MCP', 'Node.js', 'LLM', 'TypeScript'],
      category: 'AI / LLM Ops',
      githubUrl: 'https://github.com/Abdullah-1360/ChatBot_with_MCP/tree/master',
      liveUrl: null,
      featured: true,
    },
    {
      id: 'spotify',
      title: 'Spotify Clone',
      description: 'Full-featured music streaming app with auth, playlists, and audio playback — Flutter frontend backed by a FastAPI/Python server.',
      technologies: ['Flutter', 'FastAPI', 'Python', 'Riverpod'],
      category: 'Learning Project',
      githubUrl: 'https://github.com/Abdullah-1360/Spotify-clone',
      liveUrl: null,
      featured: false,
    },
    {
      id: 'task-mgr',
      title: 'Task Management App',
      description: 'Offline-first productivity app with task creation, categories, reminders, and progress tracking — all stored locally via SQLite.',
      technologies: ['Flutter', 'SQLite', 'Provider', 'Local Notifications'],
      category: 'Learning Project',
      githubUrl: 'https://github.com/Abdullah-1360/task-manager',
      liveUrl: null,
      featured: false,
    },
    {
      id: 'social-app',
      title: 'Social Media App',
      description: 'Real-time social platform with posts, comments, likes, and live messaging — built on Firebase Cloud Firestore with Flutter.',
      technologies: ['Flutter', 'Firebase', 'Cloud Firestore', 'Firebase Auth'],
      category: 'Learning Project',
      githubUrl: 'https://github.com/Abdullah-1360/social-app',
      liveUrl: null,
      featured: false,
    },
  ],

  experiences: [
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
        'Wrote Ansible playbooks for automated server provisioning — 100% environment consistency across AI and Node.js services.',
        'Built a NestJS/Next.js self-healing platform that auto-remediates 10,000+ assets via SSH job queues.',
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
      endDate: '2025-09-01',
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
        'Built Flutter mobile apps with Firebase integration for real-time data sync.',
        'Developed Node.js/Express REST APIs with MongoDB for client-facing applications.',
        'Shipped features end-to-end — from UI design to backend deployment on Railway.',
        'Participated in sprint planning and daily standups in an agile team of 6.',
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
  ],

  education: {
    degree: 'BS Computer Science',
    institution: 'Riphah International University',
    location: 'Islamabad, Pakistan',
    startDate: '2022-03-01',
    endDate: '2025-12-01',
    cgpa: '3.47',
  },

  // Removed Cisco certs — not relevant to AI Engineer positioning
  certificates: [],

  currently: [
    { label: 'Building', value: 'AI Voice Agent — real-time speech-to-action pipeline with LLM reasoning' },
    { label: 'Building', value: 'Automated Server Analysis Platform v2 — expanding to 50,000+ asset monitoring' },
    { label: 'Learning', value: 'Advanced LLM fine-tuning and RAG pipeline optimization' },
  ],
};
