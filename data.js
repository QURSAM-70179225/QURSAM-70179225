/* =========================================================
   PORTFOLIO CONTENT — edit this file to update your site.
   Everything below (projects, experience, awards, certs)
   is rendered automatically by script.js. No HTML editing needed.
   ========================================================= */

const PORTFOLIO = {

  name: "Qursam Bibi",
  title: "AI Developer & Full-Stack Engineer",
  cgpa: "3.89",
  location: "Lahore, Pakistan",
  github: "https://github.com/QURSAM-70179225",
  linkedin: "https://www.linkedin.com/in/qursam-bibi-b3309b320/",

  // Scrolling highlights strip under the hero
  ticker: [
    "🎓 3.89 CGPA",
    "🏅 Honhaar Merit Scholar",
    "☁️ Alibaba Cloud AI Hackathon",
    "🎃 Hacktoberfest Hack Day Lahore",
    "👩‍💻 Women Tech Quest 2026",
    "🤖 Skkillo AI Challenge",
    "🌍 Aspire Leaders Scholar",
    "💚 Alkhidmat Fellow",
    "🎤 TEDx UOL Operations",
    "🥇 1st Place · Omecta Quiz",
    "🚀 DreamVerse AI is live"
  ],

  // Tech that orbits your photo in the hero
  orbit: ["Python", "React", "FastAPI", "Flutter", "Gemini", "OpenAI", "Ollama", "Node.js", "TypeScript", "Tailwind"],

  // Rotating titles in the hero typing animation
  roles: [
    "AI Developer",
    "Full-Stack Engineer",
    "LLM Integration Builder",
    "Flutter App Developer",
    "Hackathon Builder"
  ],

  // Path to your resume (put the PDF in the repo root with this name)
  resume: "resume.pdf",

  // Formspree form ID — create a free form at https://formspree.io,
  // then paste the ID (the part after /f/). Leave as-is to fall back to email.
  formspreeId: "YOUR_FORM_ID",
  email: "qursam21@gmail.com",

  // Stats on the About section are counted automatically from the lists below.
  // Add an extra fixed stat here if you like, e.g. { num: "500+", label: "TEDx attendees managed" }
  extraStats: [
    { num: "3.89", label: "CGPA" }
  ],

  // What you offer freelance clients
  services: [
    { icon: "fa-robot", title: "AI & LLM Integration", text: "Chatbots, RAG, summarizers and content tools powered by Gemini, OpenAI or open-weight models." },
    { icon: "fa-layer-group", title: "Full-Stack Web Apps", text: "React frontends with FastAPI or Node backends, real-time features and clean REST APIs." },
    { icon: "fa-mobile-alt", title: "Cross-Platform Mobile", text: "Flutter apps for Android and iOS from a single codebase, with AI features built in." },
    { icon: "fa-file-invoice", title: "Data & Automation", text: "OCR pipelines, Python automation and Streamlit dashboards that turn messy data into answers." }
  ],

  // category: any of "hack", "ai", "web", "uol"   |   status: "Shipped", "Live", "In Progress", "Hackathon", "Open Source"
  // featured: true puts a project in the big Featured Work grid (art = emoji, tagline = one punchy line)
  projects: [
    {
      id: "safepath",
      title: "SafePath AI",
      category: ["hack", "ai", "web"],
      event: "Alibaba Cloud AI Hackathon Pakistan · Oct 2026",
      status: "Hackathon",
      featured: true,
      art: "🛰️",
      tagline: "Built solo. Streams live hazard data and reroutes people to safety in real time.",
      summary: "Solo-built disaster response platform with live data streaming and AI-driven evacuation routing.",
      role: "Solo Developer",
      problem: "During floods and emergencies, people and responders lack live, reliable information about which routes are safe.",
      solution: "An end-to-end system that streams live situation data over WebSockets and uses AI model APIs to recalculate safe evacuation routes as conditions change.",
      highlights: [
        "Built the whole platform solo: React client, FastAPI backend and WebSocket streaming layer",
        "Connected real-time AI model endpoints for adaptive evacuation routing",
        "Presented at the Alibaba Cloud AI Hackathon regional evaluation"
      ],
      stack: ["React", "FastAPI", "WebSockets", "AI APIs", "Python"],
      links: {}
    },
    {
      id: "studybuddy",
      title: "Study Buddy",
      category: ["hack", "ai"],
      event: "Hacktoberfest Hack Day Lahore · Oct 2026",
      status: "Hackathon",
      featured: true,
      art: "📚",
      tagline: "Drop in your notes, get a study guide and a quiz — powered by Gemma 4.",
      summary: "Flutter mobile app that turns notes into study guides and dynamic quizzes using Google Gemma 4.",
      role: "Full-Stack Developer",
      problem: "Students spend more time organizing material than actually revising it.",
      solution: "A cross-platform app that synthesizes study guides automatically and generates adaptive quizzes from the learner's own content.",
      highlights: [
        "Built the cross-platform Flutter client",
        "Integrated Gemma 4 through the Gemini API for guide synthesis and quiz generation",
        "Awarded the DEV Attendee Badge"
      ],
      stack: ["Flutter", "Dart", "Gemma 4", "Gemini API"],
      links: {}
    },
    {
      id: "billanalytics",
      title: "Smart Bill Analytics Pipeline",
      category: ["hack", "ai"],
      event: "Women Tech Quest 2026 · 10Pearls Lahore",
      status: "Hackathon",
      summary: "OCR + multi-turn Q&A pipeline that structures unstructured utility invoices.",
      role: "Developer",
      problem: "Utility bills arrive as scanned, inconsistent documents that are hard to analyze or ask questions about.",
      solution: "An automated pipeline that extracts invoice fields with OCR, structures them in Pandas, and lets users ask follow-up questions in a chat interface.",
      highlights: [
        "OCR extraction into structured tables",
        "Multi-turn Q&A over extracted data with Gemini 3.5 Flash-Lite",
        "Interactive Streamlit interface"
      ],
      stack: ["Python", "Streamlit", "Gemini API", "Pandas", "OCR"],
      links: {}
    },
    {
      id: "sentiment",
      title: "AI Sentiment & Customer Insight Engine",
      category: ["hack", "ai"],
      event: "Skkillo AI Challenge · Aug 2026",
      status: "Hackathon",
      summary: "Async microservice for sentiment scoring and intent classification of customer feedback.",
      role: "Backend Developer",
      problem: "Businesses collect large volumes of customer text but can't quickly tell how people feel or what they want.",
      solution: "A FastAPI microservice that scores sentiment and classifies intent asynchronously, returning validated, structured insights.",
      highlights: [
        "Asynchronous request handling for high throughput",
        "Strict schemas with Pydantic",
        "LLM-based classification via OpenAI APIs"
      ],
      stack: ["Python", "FastAPI", "Pydantic", "OpenAI API"],
      links: {}
    },
    {
      id: "dreamverse",
      title: "DreamVerse AI",
      category: ["ai", "web"],
      event: "Personal Project · 2026",
      status: "Live",
      featured: true,
      art: "🌌",
      tagline: "A 3D world where an AI mentor helps you design your future. Live now.",
      summary: "Immersive AI life-simulation web app: a 3D world, an AI mentor called Nova, goal roadmaps and XP. Live on Netlify.",
      role: "Full-Stack Developer",
      problem: "Career and life planning tools feel static and uninspiring for students.",
      solution: "An interactive 3D world where users design goals, get guidance from the AI mentor Nova, follow roadmaps and earn XP as they progress.",
      highlights: [
        "3D world built with React Three Fiber",
        "AI mentor powered by an open-weight LLM via Groq",
        "JWT auth, MongoDB Atlas and gamified progress",
        "Deployed: frontend on Netlify, API on Render, email via Brevo"
      ],
      stack: ["React", "Vite", "Tailwind", "Three.js", "Node.js", "MongoDB", "Groq"],
      links: { github: "https://github.com/QURSAM-70179225/Dream-Verse", demo: "https://dreamverseai.netlify.app" }
    },
    {
      id: "skillforge",
      title: "SkillForge",
      category: ["ai"],
      event: "Open Source · 2026",
      status: "Open Source",
      summary: "Open-weight agent harness that generates structured SKILL.md files with local Gemma models.",
      role: "Co-Developer",
      problem: "Writing and maintaining reliable skill files for AI agents is slow and error-prone.",
      solution: "A CLI agent harness that reads a local repository and generates, validates and repairs structured SKILL.md files using open-weight models running locally.",
      highlights: [
        "Runs fully locally with Gemma open-weight models via Ollama",
        "Custom agent harness with automated validation",
        "Tested with pytest"
      ],
      stack: ["Python", "Gemma", "Ollama", "pytest"],
      links: {}
    },
    {
      id: "prompt",
      title: "Prompt Engineering Showcase",
      category: ["ai"],
      event: "TechNova Internship",
      status: "Shipped",
      summary: "Zero-shot, few-shot and chain-of-thought prompts across 10 real use cases.",
      role: "GenAI Intern",
      problem: "LLM output quality varies hugely depending on how prompts are written.",
      solution: "A documented library of optimized prompt patterns tested across 10 API use cases.",
      highlights: ["10 documented use cases", "Compared zero-shot, few-shot and chain-of-thought strategies"],
      stack: ["Python", "LLM APIs", "Prompt Engineering"],
      links: { github: "https://github.com/QURSAM-70179225/prompt-engineering-showcase" }
    },
    {
      id: "story",
      title: "AI Story & Content Generator",
      category: ["ai", "web"],
      event: "TechNova Internship",
      status: "Shipped",
      summary: "Web app that generates stories, blogs and poems with user-defined structure.",
      role: "GenAI Intern",
      problem: "Writers need a fast starting point that still respects their tone and format.",
      solution: "A content engine that turns LLM output into structured stories, blogs and poems from flexible user constraints.",
      highlights: ["Configurable genre, length and structure", "API-based generation"],
      stack: ["Python", "LLM APIs", "HTML/CSS"],
      links: { github: "https://github.com/QURSAM-70179225/TechNova-ai-story-generator" }
    },
    {
      id: "summarizer",
      title: "AI Text Summarizer",
      category: ["ai"],
      event: "TechNova Internship",
      status: "Shipped",
      summary: "NLP summarization tool built on Hugging Face pipelines.",
      role: "GenAI Intern",
      problem: "Long articles and reports take too long to read in full.",
      solution: "A web interface over pre-trained Hugging Face models that produces concise, accurate summaries.",
      highlights: ["Pre-trained transformer pipelines", "Real-time summarization"],
      stack: ["Python", "Hugging Face", "NLP"],
      links: { github: "https://github.com/QURSAM-70179225/Novatech_ai-text-summarizer" }
    },
    {
      id: "evac",
      title: "Automated Zone Evacuation System",
      category: ["uol"],
      event: "University of Lahore",
      status: "Shipped",
      summary: "Embedded robot that navigates and evacuates zones using sensor-based pathfinding.",
      role: "Hardware & Firmware",
      problem: "Evacuation paths must adapt instantly to obstacles in hazardous areas.",
      solution: "A 3D robot whose microcontroller reads distance sensors and overrides its path to avoid obstacles in real time.",
      highlights: ["Microcontroller programming", "Asynchronous sensor processing", "Real-time obstacle avoidance"],
      stack: ["Embedded Systems", "Microcontrollers", "Sensors"],
      links: {}
    },
    {
      id: "school",
      title: "School Management System",
      category: ["uol"],
      event: "University of Lahore",
      status: "Shipped",
      summary: "OOP application for students, staff and grading with role-based access.",
      role: "Developer",
      problem: "Schools juggle records, access rules and grading across disconnected files.",
      solution: "A layered C++ application applying strict OOP design for secure data access and grading workflows.",
      highlights: ["Class-based architecture", "Multi-user access rules"],
      stack: ["C++", "OOP"],
      links: {}
    },
    {
      id: "crypto",
      title: "Encryption & Decryption Tool",
      category: ["uol"],
      event: "University of Lahore",
      status: "Shipped",
      summary: "Security tool implementing classic encryption algorithms, in OOP and functional versions.",
      role: "Developer",
      problem: "Understanding encryption requires implementing the algorithms, not just using libraries.",
      solution: "Two implementations of core cipher algorithms: one object-oriented, one purely functional.",
      highlights: ["Core cipher algorithms", "OOP and functional versions compared"],
      stack: ["C++", "Algorithms"],
      links: {}
    },
    {
      id: "moodcanva",
      title: "Mood Canva",
      category: ["web"],
      event: "Personal Project",
      status: "Shipped",
      summary: "Responsive vanilla-JS web app with modern UI patterns.",
      role: "Frontend Developer",
      problem: "A simple, fast mood-board experience that works on any device.",
      solution: "A fully responsive frontend built from scratch with no frameworks.",
      highlights: ["Cross-browser responsive layout", "Vanilla JavaScript interactivity"],
      stack: ["JavaScript", "HTML5", "CSS3"],
      links: {}
    }
  ],

  experience: [
    { date: "Jul 2026 – Present", title: "Generative AI Intern", org: "TechNova", type: "Full-time", icon: "fa-brain",
      points: ["Built LLM-powered tools: story generator, summarizer and prompt library"] },
    { date: "Jun 2026 – Jul 2026", title: "Python Programming Intern", org: "Decodelabs", type: "Remote", icon: "fa-code",
      points: ["Python automation and problem-solving projects"] },
    { date: "May 2026", title: "Volunteer Field Assistant", org: "World Health Organization (WHO)", type: "Volunteer", icon: "fa-hand-holding-medical",
      points: ["Supported a public health awareness campaign"] },
    { date: "Jul 2025 – Dec 2025", title: "IT Summer Intern", org: "BugsLink TECH", type: "On-site", icon: "fa-shield-alt",
      points: ["Hands-on IT support and systems work"] }
  ],

  achievements: [
    { icon: "fa-award", color: "gold", date: "Sept 2026", title: "Honhaar Scholarship Recipient", org: "Merit award · BS Information Engineering Technology",
      text: "Full merit-based scholarship for top academic performance in Information Engineering Technology." },
    { icon: "fa-laptop-code", color: "green", date: "Sept 2026", title: "Alkhidmat Fellowship & Internship", org: "Alkhidmat Foundation",
      text: "6-week intensive program in prompt engineering, software product design and technology entrepreneurship." },
    { icon: "fa-microphone-alt", color: "red", date: "Sept 2026", title: "TEDx Operations Team", org: "TEDx The University of Lahore",
      text: "Coordinated event logistics, attendee management and venue execution for 500+ attendees." },
    { icon: "fa-globe", color: "purple", date: "2026", title: "Aspire Leaders Scholar", org: "Aspire Institute (Harvard-founded)",
      text: "Completed global leadership and critical-thinking modules in a competitive international cohort." },
    { icon: "fa-medal", color: "gold", date: "Competitions", title: "1st Place — Omecta Quiz", org: "6th Place — International Essay Competition",
      text: "Recognized for analytical reasoning and written communication." }
  ],

  // image: file in the repo shown when the card is clicked (optional)
  certifications: [
    { title: "Full-Stack & Python Specializations", org: "REST APIs, databases, async Python" },
    { title: "Aspire Leaders Program", org: "Aspire Institute · Aug 2025", image: "aspire_cert.jpg" },
    { title: "Programming for Everybody (Python)", org: "University of Michigan", image: "python_cert.jpg" },
    { title: "HTML, CSS & JavaScript for Web Developers", org: "Johns Hopkins University", image: "web_cert.jpg" },
    { title: "Understanding Basic SQL Syntax", org: "Coursera Project Network", image: "sql_cert.jpg" },
    { title: "Effective Problem-Solving", org: "UC Irvine · Apr 2025", image: "problemsolving_cert.jpg" },
    { title: "Organizational Leadership", org: "IIM Ahmedabad · May 2024", image: "leadership_cert.jpg" },
    { title: "Developing Interpersonal Skills", org: "IBM · May 2025", image: "ibm_cert.jpg" },
    { title: "Foundations of Digital Marketing", org: "Google · Jun 2025", image: "google_cert.jpg" },
    { title: "Training and Learning Online", org: "University of Leeds · Jul 2024", image: "leeds_cert.jpg" },
    { title: "Finding Your Professional Voice", org: "Royal Holloway, University of London · Jun 2024", image: "london_cert.jpg" }
  ]
};
