/**
 * Lakshay Ratra Portfolio - Core Application Logic
 * Particle Canvas, Audio FX, Navigation Spy, Project Modals, Skills Filtering & Interactions
 */

// Sound Effects via Web Audio API
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.04) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio not supported or blocked
    }
  }

  playClick() {
    this.playTone(800, 'triangle', 0.04, 0.03);
  }

  playHover() {
    this.playTone(450, 'sine', 0.03, 0.015);
  }

  playSuccess() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.04, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.18);
      });
    } catch (e) {}
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}

window.soundFX = new SoundEffects();

// Particle Canvas
class ParticleNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 140 };
    this.numParticles = window.innerWidth < 768 ? 40 : 85;

    this.init();
    this.animate();
    this.bindEvents();
  }

  init() {
    this.resize();
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.4 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(56, 189, 248, 0.4)'
      });
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce edges
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Mouse repulsion
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x += (dx / dist) * force * 3;
          p.y += (dy / dist) * force * 3;
        }
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();

      // Connect lines
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 110)})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Project Details Data Modal
const projectDetails = {
  aiLegal: {
    title: "AI Legal Research Agent Platform",
    subtitle: "Enterprise LangChain & RAG Workflow Automation",
    tagline: "Reduced document reasoning & query latency from minutes to under 2 seconds.",
    overview: "Architected an end-to-end AI research platform specifically engineered for automated legal analysis. Built with modular client-server REST APIs, semantic text chunking, and high-precision RAG vector embeddings.",
    metrics: [
      { label: "Query Latency", val: "< 2s" },
      { label: "Data Accuracy", val: "+40%" },
      { label: "Agentic Framework", val: "LangChain" },
      { label: "RAG Embeddings", val: "Semantic Vectors" }
    ],
    architecture: [
      "Input legal briefs / contracts parsed via asynchronous pipeline",
      "Semantic text embeddings chunked and indexed into vector store",
      "LangChain multi-step agent conducts iterative query refinement",
      "High-reliability modular REST endpoints stream synthesis back to UI"
    ],
    stack: ["Python", "LangChain", "LangGraph", "LLM APIs", "RAG Embeddings", "FastAPI/REST", "Vector DB"]
  },
  mediaCloud: {
    title: "Media Library & Cloud Platform Infrastructure",
    subtitle: "Enterprise-Scale Asset Distribution & Edge Caching",
    tagline: "Serving 1,000,000+ monthly requests with a blistering 45ms average TTFB.",
    overview: "Created a shared high-availability media library platform for enterprise clients. Conducted comprehensive CDN provider benchmarking and configured Cloudflare network edge caching with robust security rules and observability.",
    metrics: [
      { label: "Monthly Requests", val: "1,000,000+" },
      { label: "Time-To-First-Byte", val: "45ms" },
      { label: "Network Security", val: "Strict Standards" },
      { label: "CDN Caching", val: "Cloudflare Edge" }
    ],
    architecture: [
      "Extensible REST APIs handle asset ingestion, hashing, and access validation",
      "Cloudflare CDN edge distribution with intelligent caching policies",
      "Integrated health checks and structured observability logging",
      "Automated fallback routes ensuring zero-downtime availability"
    ],
    stack: ["Cloudflare CDN", "Node.js", "REST APIs", "Observability/Logging", "Edge Caching", "Enterprise Security"]
  },
  pratigya: {
    title: "Pratigya Society Official Web Platform",
    subtitle: "Community Portal & Event Registration Infrastructure",
    tagline: "Programmed official website handling university-wide registrations and membership pipelines.",
    overview: "Built and deployed the primary student organization web application for Pratigya Society using React and Node.js, providing streamlined event signups, participant management, and fast mobile-optimized UI.",
    metrics: [
      { label: "Active Team", val: "Core Tech Eng" },
      { label: "Tech Stack", val: "React + Node" },
      { label: "Features", val: "Events & Regs" },
      { label: "Accessibility", val: "WCAG Focused" }
    ],
    architecture: [
      "React responsive frontend with interactive registration workflows",
      "Node.js backend with validated CRUD endpoints",
      "Session management and automated email notification hooks",
      "Scalable database schema for dynamic event attendance tracking"
    ],
    stack: ["React", "Node.js", "Express", "REST APIs", "Tailwind CSS", "MongoDB/SQL"]
  }
};

// UI Initialization
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particles
  new ParticleNetwork('particle-canvas');

  // 2. Mouse Spotlight Follower
  const spotlight = document.getElementById('mouse-spotlight');
  if (spotlight) {
    window.addEventListener('mousemove', (e) => {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
    });
  }

  // 3. Audio Toggle
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const isMuted = window.soundFX.toggleMute();
      const icon = soundToggleBtn.querySelector('i');
      if (icon) {
        icon.className = isMuted ? 'fas fa-volume-xmark text-slate-400' : 'fas fa-volume-high text-cyan-400';
      }
      soundToggleBtn.title = isMuted ? 'Sound Muted' : 'Sound Enabled';
    });
  }

  // Hover sound on buttons & cards
  document.querySelectorAll('button, a, .card-hover-tilt').forEach(el => {
    el.addEventListener('mouseenter', () => window.soundFX.playHover());
  });

  // 4. Role Text Cycler
  const roleCycler = document.getElementById('role-cycler');
  if (roleCycler) {
    const roles = [
      "Junior Fullstack Engineer",
      "AI Agent & RAG Architect",
      "Enterprise Scalability Builder",
      "High-Performance System Crafter"
    ];
    let roleIdx = 0;
    setInterval(() => {
      roleIdx = (roleIdx + 1) % roles.length;
      roleCycler.style.opacity = '0';
      setTimeout(() => {
        roleCycler.textContent = roles[roleIdx];
        roleCycler.style.opacity = '1';
      }, 300);
    }, 3200);
  }

  // 5. Active Nav Spy
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  function updateNav() {
    const scrollPos = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateNav, { passive: true });

  // 6. Mobile Menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuDrawer.classList.toggle('hidden');
      window.soundFX.playClick();
    });
    // Close on clicking mobile link
    mobileMenuDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuDrawer.classList.add('hidden');
      });
    });
  }

  // 7. Skills Filter
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-item-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-500');
        b.classList.add('bg-slate-800/60', 'text-slate-300', 'border-slate-700/60');
      });
      btn.classList.remove('bg-slate-800/60', 'text-slate-300', 'border-slate-700/60');
      btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-500');

      const filter = btn.getAttribute('data-filter');
      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
      window.soundFX.playClick();
    });
  });

  // 8. Project Details Modal
  const projectModal = document.getElementById('project-modal');
  const projectModalContent = document.getElementById('project-modal-content');
  const closeProjectModalBtn = document.getElementById('close-project-modal-btn');

  document.querySelectorAll('.view-project-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.getAttribute('data-project');
      const data = projectDetails[projKey];
      if (!data || !projectModal) return;

      projectModalContent.innerHTML = `
        <div class="space-y-6">
          <div class="border-b border-slate-700/80 pb-4">
            <span class="text-xs uppercase font-bold tracking-wider text-cyan-400">${data.subtitle}</span>
            <h3 class="text-2xl font-bold text-white mt-1">${data.title}</h3>
            <p class="text-indigo-300 text-sm mt-1 italic">${data.tagline}</p>
          </div>

          <div>
            <h4 class="text-xs uppercase font-semibold text-slate-400 mb-2">Project Overview</h4>
            <p class="text-slate-300 text-sm leading-relaxed">${data.overview}</p>
          </div>

          <div>
            <h4 class="text-xs uppercase font-semibold text-slate-400 mb-3">Key Metrics & Impact</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              ${data.metrics.map(m => `
                <div class="p-3 rounded-lg bg-slate-800/70 border border-slate-700/60 text-center">
                  <div class="text-xl font-bold text-cyan-400">${m.val}</div>
                  <div class="text-xs text-slate-400 mt-1">${m.label}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div>
            <h4 class="text-xs uppercase font-semibold text-slate-400 mb-2">Architectural Highlights</h4>
            <ul class="space-y-2">
              ${data.architecture.map(a => `
                <li class="flex items-start gap-2 text-sm text-slate-300">
                  <i class="fas fa-check-circle text-emerald-400 text-sm mt-0.5"></i>
                  <span>${a}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <div>
            <h4 class="text-xs uppercase font-semibold text-slate-400 mb-2">Technologies Deployed</h4>
            <div class="flex flex-wrap gap-1.5">
              ${data.stack.map(s => `
                <span class="tech-pill text-xs">${s}</span>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      projectModal.classList.remove('hidden');
      projectModal.classList.add('flex');
      window.soundFX.playClick();
    });
  });

  if (closeProjectModalBtn && projectModal) {
    closeProjectModalBtn.addEventListener('click', () => {
      projectModal.classList.add('hidden');
      projectModal.classList.remove('flex');
    });
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.add('hidden');
        projectModal.classList.remove('flex');
      }
    });
  }

  // 9. Copy to Clipboard Utility
  window.copyToClipboard = function(text, label = 'Copied to clipboard!') {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label}`);
      window.soundFX.playSuccess();
    });
  };

  // Toast Notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full bg-slate-900/90 text-white border border-cyan-500/40 shadow-2xl flex items-center gap-2 text-sm z-50 animate-bounce';
    toast.innerHTML = `<i class="fas fa-check-circle text-cyan-400"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 2400);
  }

  // 10. Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name')?.value || 'Guest';

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending message...`;
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = `<i class="fas fa-check"></i> Message Sent!`;
          submitBtn.classList.remove('bg-indigo-600');
          submitBtn.classList.add('bg-emerald-600');
        }
        showToast(`Thank you, ${name}! Your note has been dispatched.`);
        window.soundFX.playSuccess();
        if (typeof confetti === 'function') {
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        }
        if (window.avatarEngine) {
          window.avatarEngine.setHeroRemark(`Thanks for reaching out, ${name}! Lakshay will get back to you shortly! 📬`, true);
        }
        contactForm.reset();
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = `<span>Send Message</span><i class="fas fa-paper-plane text-xs"></i>`;
            submitBtn.classList.remove('bg-emerald-600');
            submitBtn.classList.add('bg-indigo-600');
            submitBtn.disabled = false;
          }
        }, 4000);
      }, 1000);
    });
  }

  // 11. Print Resume Button
  const printResumeBtn = document.getElementById('print-resume-btn');
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }
});
