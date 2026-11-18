/**
 * Lakshay Ratra - Interactive Developer Terminal
 * Provides interactive CLI commands for tech leads and recruiters.
 */

class InteractiveTerminal {
  constructor() {
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    this.container = document.getElementById('terminal-container');
    this.history = [];
    this.historyIndex = -1;

    this.commands = {
      help: () => `
<span class="text-cyan-400 font-bold">AVAILABLE COMMANDS:</span>
  <span class="text-emerald-400">about</span>        - Who is Lakshay Ratra?
  <span class="text-emerald-400">experience</span>   - Career history at Optum & Growth Jockey
  <span class="text-emerald-400">projects</span>     - Key enterprise & AI projects
  <span class="text-emerald-400">skills</span>       - Fullstack, Cloud & AI Agent tech stack
  <span class="text-emerald-400">education</span>    - TIET (9.79 CGPA) & Scholastic records
  <span class="text-emerald-400">achievements</span> - Merit scholarships & certifications
  <span class="text-emerald-400">contact</span>      - Reach out to Lakshay directly
  <span class="text-emerald-400">hire</span>         - Ready to schedule an interview?
  <span class="text-emerald-400">avatar</span>       - Say hi to Lakshay's AI avatar
  <span class="text-emerald-400">clear</span>        - Clear terminal screen
`,
      about: () => `
<span class="text-indigo-400 font-semibold">[Lakshay Ratra - Bio]</span>
Junior Fullstack Engineer & AI Agent Specialist with a B.E. in Computer Engineering from TIET (CGPA: 9.79).
Hands-on experience architecting scalable enterprise REST APIs, data validation pipelines, 
and integrating AI-agent frameworks (LLMs, RAG, LangChain) into production environments.
`,
      experience: () => `
<span class="text-indigo-400 font-semibold">[Work Experience]</span>
1. <span class="text-yellow-400 font-bold">TDP Associate @ Optum Global Solutions</span> (Aug 2026 - Present | On-site)
   • Built scalable Python/Java data validation pipelines & REST APIs (5,000+ daily requests).
   • Automated CI/CD & Camunda/BPMN human-in-the-loop agentic workflows (99.5% accuracy).
   • Production observability & metrics reducing manual intervention by 40%.

2. <span class="text-yellow-400 font-bold">SDE Associate Intern @ Growth Jockey</span> (Jan 2026 - Jun 2026 | Gurugram)
   • Hybrid ClickHouse + PostgreSQL pipeline boosting query speeds by 40%.
   • React UI supporting 10,000 concurrent user events with WCAG accessibility.
   • Deployed Node.js/TypeScript internal infrastructure with 99.9% reliability.

3. <span class="text-yellow-400 font-bold">Technical Developer Intern @ Optum</span> (Jun 2025 - Aug 2025 | On-site)
   • Built GenAI LLM automation tool cutting data processing time by 99%.
   • Containerized full-stack Docker services validated on 100+ live database payloads.
`,
      projects: () => `
<span class="text-indigo-400 font-semibold">[Featured Projects]</span>
1. <span class="text-cyan-400 font-bold">AI Legal Research Agent Platform</span>
   • LangChain + LangGraph + Semantic Embeddings RAG architecture.
   • +40% data retrieval accuracy on complex datasets, &lt;2s query latency.

2. <span class="text-cyan-400 font-bold">Media Library & Cloud Platform Infrastructure</span>
   • Cloudflare CDN & Extensible REST APIs serving 1,000,000+ monthly requests.
   • 45ms average Time-To-First-Byte (TTFB) with strict security compliance.

3. <span class="text-cyan-400 font-bold">Pratigya Society Official Web Platform</span>
   • React + Node.js portal powering event registrations and memberships.
`,
      skills: () => `
<span class="text-indigo-400 font-semibold">[Technical Arsenal]</span>
• <span class="text-slate-300 font-medium">Languages:</span> Python, Java, JavaScript, TypeScript, SQL, C++, HTML, CSS
• <span class="text-slate-300 font-medium">Frontend & Web:</span> React, Angular, Node.js, Express, REST APIs, WCAG Accessibility
• <span class="text-slate-300 font-medium">AI & Agentic Systems:</span> LLMs, LangChain, LangGraph, RAG, Tool Use, Prompt Engineering
• <span class="text-slate-300 font-medium">Cloud & DevOps:</span> Docker, CI/CD, Cloudflare, Cloud Platforms, Observability, Secure Coding
• <span class="text-slate-300 font-medium">Databases:</span> PostgreSQL, ClickHouse, MongoDB, Redis, SQL
• <span class="text-slate-300 font-medium">Core CS:</span> Scalable System Design, Data Structures & Algorithms, Troubleshooting
`,
      education: () => `
<span class="text-indigo-400 font-semibold">[Education]</span>
🎓 <span class="text-emerald-400 font-bold">TIET (Thapar Institute of Engineering & Technology)</span>
   • B.E. in Computer Engineering (2022 - 2026)
   • <span class="text-yellow-400 font-bold">CGPA: 9.79 / 10</span> (Departmental Top 5% Rank)

🏫 <span class="text-emerald-400 font-bold">OSDAV Public School</span>
   • Class XII CBSE (PCM): <span class="text-yellow-400 font-bold">96.33%</span> (2021 - 2022)
`,
      achievements: () => `
<span class="text-indigo-400 font-semibold">[Honors & Leadership]</span>
🏆 <span class="text-yellow-400 font-bold">University-wide Merit Scholarship:</span> Awarded across 2 consecutive academic years for top 5% rank.
📜 <span class="text-cyan-400 font-bold">AI Certification:</span> 40-hour Artificial Intelligence Primer program (LLM & ML concepts).
👥 <span class="text-indigo-300 font-bold">Leadership:</span> Pratigya Society Tech Lead & IEI ORION Coordinator (1,000+ attendees).
`,
      contact: () => `
<span class="text-indigo-400 font-semibold">[Contact Channels]</span>
📧 Email:    <a href="mailto:lakshayratra2004@gmail.com" class="text-cyan-400 underline">lakshayratra2004@gmail.com</a>
📱 Phone:    <a href="tel:7015477229" class="text-cyan-400 underline">+91 7015477229</a>
💼 LinkedIn: <a href="https://linkedin.com/in/lakshay-ratra" target="_blank" class="text-cyan-400 underline">linkedin.com/in/lakshay-ratra</a>
🐙 GitHub:   <a href="https://github.com/LAKSHAYRATRA" target="_blank" class="text-cyan-400 underline">github.com/LAKSHAYRATRA</a>
`,
      hire: () => `
<span class="text-emerald-400 font-bold">🚀 READY TO CONNECT?</span>
Lakshay is ready to bring high-performance fullstack engineering, AI automation,
and system reliability to your engineering team.
Click below to trigger an immediate email draft:
<a href="mailto:lakshayratra2004@gmail.com?subject=Interview%20Invitation%20for%20Lakshay%20Ratra" class="inline-block mt-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40 font-semibold hover:bg-emerald-500/30">
  👉 Compose Email to lakshayratra2004@gmail.com
</a>
`,
      avatar: () => {
        if (window.avatarEngine) {
          window.avatarEngine.celebrate();
          window.avatarEngine.setHeroRemark("You triggered me from the terminal! Happy to see you testing things out! 🚀", true);
        }
        return `<span class="text-cyan-400">✨ Avatar activated! Listen to the voice intro above!</span>`;
      },
      clear: () => {
        this.output.innerHTML = '';
        return '';
      }
    };

    this.init();
  }

  init() {
    if (!this.input || !this.output) return;

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = this.input.value.trim().toLowerCase();
        if (cmd) {
          this.executeCommand(cmd);
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex] || '';
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      }
    });

    // Preset chips
    const chips = document.querySelectorAll('.terminal-cmd-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) {
          this.executeCommand(cmd);
          if (window.soundFX) window.soundFX.playClick();
        }
      });
    });
  }

  executeCommand(cmd) {
    const promptLine = document.createElement('div');
    promptLine.className = 'flex items-center gap-2 text-slate-400 mt-2';
    promptLine.innerHTML = `
      <span class="text-emerald-400 font-bold">visitor@lakshay-os</span>:<span class="text-cyan-400">~</span>$ 
      <span class="text-white font-mono">${cmd}</span>
    `;
    this.output.appendChild(promptLine);

    const resultContainer = document.createElement('div');
    resultContainer.className = 'text-slate-300 font-mono text-sm leading-relaxed mb-3';

    if (this.commands[cmd]) {
      const res = this.commands[cmd]();
      if (res) {
        resultContainer.innerHTML = res;
        this.output.appendChild(resultContainer);
      }
    } else {
      resultContainer.innerHTML = `
        <span class="text-red-400">command not found: "${cmd}". Type <span class="text-yellow-400 font-bold underline cursor-pointer" onclick="window.terminalEngine.executeCommand('help')">help</span> to view available options.</span>
      `;
      this.output.appendChild(resultContainer);
    }

    if (this.container) {
      this.container.scrollTop = this.container.scrollHeight;
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.terminalEngine = new InteractiveTerminal();
});
