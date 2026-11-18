/**
 * Lakshay Ratra - Interactive AI Avatar Engine
 * Provides animated interactions, dynamic speech synthesis, reactive scroll commentary,
 * emotion transitions, and recruiter Q&A intelligence.
 */

class AvatarEngine {
  constructor() {
    this.speechSynth = window.speechSynthesis;
    this.isSpeaking = false;
    this.isMuted = false;
    this.currentEmotion = 'happy';
    this.typingInterval = null;

    // Avatar clean image references (no #OPENTOWORK banner)
    this.images = {
      happy: 'assets/images/lakshay-happy.png',
      work: 'assets/images/lakshay-clean.png'
    };

    // Recruiter instant answers
    this.faqs = {
      whyHire: {
        q: "Why hire Lakshay?",
        a: "Lakshay pairs exceptional academic rigor (9.79 CGPA at TIET, 2x Merit Scholar) with proven enterprise impact at Optum and Growth Jockey—building microservices handling 5,000+ daily requests, reducing data processing by 99% with AI, and scaling React apps to 10k concurrent users."
      },
      aiWork: {
        q: "What is his AI agent experience?",
        a: "Lakshay architected an AI Legal Research Agent using LangChain and RAG semantic embeddings (improving relevance by 40% with sub-2s latency) and deployed GenAI tool-calling pipelines inside Docker containers at Optum."
      },
      scaleWork: {
        q: "How does he handle scalability?",
        a: "He optimized hybrid ClickHouse + PostgreSQL queries for a 40% speedup, built enterprise Cloudflare CDN media infrastructure with 45ms TTFB for 1M+ requests, and automated BPMN workflows with 99.5% reliability."
      },
      availability: {
        q: "Is he open to opportunities?",
        a: "Yes! Lakshay is actively exploring Junior Fullstack, AI Engineering, and Software Engineering roles where he can solve mission-critical problems."
      }
    };

    // Scroll contextual lines
    this.sectionRemarks = {
      'hero': "Hey there! I'm Lakshay's AI Avatar guide. Ready to explore?",
      'about': "Fun fact: Lakshay earned a 9.79 CGPA at TIET and 96.33% in CBSE PCM!",
      'experience': "Notice the 99% data processing speedup Lakshay achieved with GenAI at Optum!",
      'projects': "Check out the AI Legal Research Platform with LangChain & RAG!",
      'skills': "Lakshay blends Python, React, Docker, ClickHouse, and modern AI Agent stacks.",
      'education': "Consistent top 5% departmental ranking and 2-time Merit Scholarship holder!",
      'achievements': "40-hr AI Primer certification and leadership across major tech fests!",
      'terminal': "You can type commands here like 'skills', 'optum', or 'hire'!",
      'contact': "Interested in working together? Drop Lakshay a direct message below!"
    };

    this.init();
  }

  init() {
    this.bindDomElements();
    this.setupSpeechBubbleIntro();
    this.setupScrollObserver();
    this.setupEmotionSwitch();
    this.setupQuickQuestionModal();
  }

  bindDomElements() {
    this.heroAvatarImg = document.getElementById('hero-avatar-img');
    this.heroSpeechText = document.getElementById('hero-speech-text');
    this.heroVoiceBtn = document.getElementById('hero-voice-btn');
    this.heroEmotionBadge = document.getElementById('hero-emotion-badge');
    
    // Docked companion
    this.companion = document.getElementById('avatar-companion');
    this.companionBubble = document.getElementById('companion-bubble-text');
    this.companionImg = document.getElementById('companion-avatar-img');
    this.companionVoiceBtn = document.getElementById('companion-voice-btn');
    this.companionToggleBtn = document.getElementById('companion-toggle-btn');
    this.companionFaqBtn = document.getElementById('companion-faq-btn');
    this.faqModal = document.getElementById('faq-modal');
    this.closeFaqBtn = document.getElementById('close-faq-btn');
    this.faqList = document.getElementById('faq-list');

    if (this.heroVoiceBtn) {
      this.heroVoiceBtn.addEventListener('click', () => this.toggleSpeech(this.heroSpeechText.textContent));
    }

    if (this.companionVoiceBtn) {
      this.companionVoiceBtn.addEventListener('click', () => this.toggleSpeech(this.companionBubble.textContent));
    }

    if (this.companionToggleBtn) {
      this.companionToggleBtn.addEventListener('click', () => {
        this.companion.classList.toggle('minimized');
        const icon = this.companionToggleBtn.querySelector('i');
        if (icon) {
          icon.classList.toggle('fa-chevron-down');
          icon.classList.toggle('fa-chevron-up');
        }
      });
    }

    if (this.companionFaqBtn && this.faqModal) {
      this.companionFaqBtn.addEventListener('click', () => this.openFaqModal());
    }

    if (this.closeFaqBtn && this.faqModal) {
      this.closeFaqBtn.addEventListener('click', () => this.closeFaqModal());
    }

    // Avatar card click confetti
    if (this.heroAvatarImg) {
      this.heroAvatarImg.addEventListener('click', () => {
        this.celebrate();
        this.setHeroRemark("Yay! Thanks for saying hi! Lakshay is super passionate about building great tech. 🚀");
      });
    }

    if (this.companionImg) {
      this.companionImg.addEventListener('click', () => {
        this.celebrate();
        this.setCompanionRemark("Hey! Need a quick tour or answers to recruiter questions? Click the question mark icon! 💡");
      });
    }
  }

  setupSpeechBubbleIntro() {
    const greetingText = "Hi there! 👋 I'm Lakshay Ratra's AI Avatar guide. Welcome to my portfolio! I build high-impact Fullstack platforms, scalable REST microservices, and AI Agent workflows. Feel free to explore my experience, live projects, or run commands in the terminal!";
    this.typewriterEffect(this.heroSpeechText, greetingText, 25);
  }

  typewriterEffect(element, text, speed = 20) {
    if (!element) return;
    if (this.typingInterval) clearInterval(this.typingInterval);
    
    element.innerHTML = '';
    let i = 0;
    this.typingInterval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(this.typingInterval);
      }
    }, speed);
  }

  setHeroRemark(text, speak = false) {
    if (!this.heroSpeechText) return;
    this.typewriterEffect(this.heroSpeechText, text, 15);
    if (speak && !this.isMuted) {
      this.speakText(text);
    }
  }

  setCompanionRemark(text, speak = false) {
    if (!this.companionBubble) return;
    this.companionBubble.textContent = text;
    this.companionBubble.classList.remove('animate-fade-in');
    void this.companionBubble.offsetWidth;
    this.companionBubble.classList.add('animate-fade-in');
    if (speak && !this.isMuted) {
      this.speakText(text);
    }
  }

  setupEmotionSwitch() {
    const emotions = [
      { id: 'happy', label: '😊 Happy & Ready to Build', img: this.images.happy },
      { id: 'coding', label: '💻 Deep in Code & AI', img: this.images.happy },
      { id: 'work', label: '🚀 Ready for Impact & Roles', img: this.images.work },
      { id: 'celebrate', label: '🎉 9.79 CGPA & 2x Scholar', img: this.images.happy }
    ];
    let idx = 0;

    const emotionBtn = document.getElementById('avatar-emotion-toggle');
    if (emotionBtn) {
      emotionBtn.addEventListener('click', () => {
        idx = (idx + 1) % emotions.length;
        const current = emotions[idx];
        this.currentEmotion = current.id;
        
        if (this.heroAvatarImg) this.heroAvatarImg.src = current.img;
        if (this.heroEmotionBadge) this.heroEmotionBadge.innerHTML = current.label;

        if (window.soundFX) window.soundFX.playClick();
        
        if (current.id === 'work') {
          this.setHeroRemark("Lakshay is looking for Junior Fullstack and AI Engineer positions! Let's build something extraordinary together.");
        } else if (current.id === 'celebrate') {
          this.celebrate();
          this.setHeroRemark("Proud to maintain a 9.79 CGPA at TIET and win consecutive Merit Scholarships!");
        } else if (current.id === 'coding') {
          this.setHeroRemark("Currently exploring autonomous agent orchestration, RAG pipelines, and high-performance databases!");
        } else {
          this.setHeroRemark("Smiling and positive! Great collaboration is just as important as clean code.");
        }
      });
    }
  }

  setupScrollObserver() {
    const sections = Object.keys(this.sectionRemarks);
    let activeSection = 'hero';

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 250;
      
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            if (activeSection !== sectionId) {
              activeSection = sectionId;
              this.onSectionEnter(sectionId);
            }
            break;
          }
        }
      }
    }, { passive: true });
  }

  onSectionEnter(sectionId) {
    const remark = this.sectionRemarks[sectionId];
    if (remark) {
      this.setCompanionRemark(remark);
    }
  }

  toggleSpeech(text) {
    if (!this.speechSynth) {
      alert("Speech synthesis is not supported on your browser.");
      return;
    }

    if (this.speechSynth.speaking) {
      this.speechSynth.cancel();
      this.isSpeaking = false;
      this.updateVoiceVisualizer(false);
      return;
    }

    this.speakText(text);
  }

  speakText(text) {
    if (!this.speechSynth || this.isMuted) return;
    this.speechSynth.cancel();

    // Clean emojis from speech
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.05;

    const voices = this.speechSynth.getVoices();
    const naturalVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David')));
    if (naturalVoice) utterance.voice = naturalVoice;

    this.updateVoiceVisualizer(true);

    utterance.onend = () => {
      this.isSpeaking = false;
      this.updateVoiceVisualizer(false);
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.updateVoiceVisualizer(false);
    };

    this.speechSynth.speak(utterance);
    this.isSpeaking = true;
  }

  updateVoiceVisualizer(speaking) {
    const visualizers = document.querySelectorAll('.voice-wave-container');
    visualizers.forEach(v => {
      if (speaking) {
        v.classList.remove('hidden');
        v.classList.add('flex');
      } else {
        v.classList.add('hidden');
        v.classList.remove('flex');
      }
    });

    const voiceIcons = document.querySelectorAll('.voice-icon-btn i');
    voiceIcons.forEach(icon => {
      if (speaking) {
        icon.className = 'fas fa-volume-up text-cyan-400 animate-pulse';
      } else {
        icon.className = 'fas fa-volume-high text-slate-300';
      }
    });
  }

  celebrate() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#38bdf8', '#10b981', '#fbbf24']
      });
    }
    if (window.soundFX) window.soundFX.playSuccess();
  }

  openFaqModal() {
    if (!this.faqModal) return;
    this.faqModal.classList.remove('hidden');
    this.faqModal.classList.add('flex');
    this.renderFaqList();
    if (window.soundFX) window.soundFX.playClick();
  }

  closeFaqModal() {
    if (!this.faqModal) return;
    this.faqModal.classList.add('hidden');
    this.faqModal.classList.remove('flex');
  }

  renderFaqList() {
    if (!this.faqList) return;
    this.faqList.innerHTML = '';

    Object.entries(this.faqs).forEach(([key, item]) => {
      const card = document.createElement('div');
      card.className = 'p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-indigo-500/50 transition-all cursor-pointer group';
      card.innerHTML = `
        <div class="flex items-center justify-between font-semibold text-slate-100 group-hover:text-cyan-400 mb-2">
          <span>${item.q}</span>
          <i class="fas fa-chevron-right text-xs opacity-60 group-hover:translate-x-1 transition-transform"></i>
        </div>
        <p class="text-sm text-slate-300 leading-relaxed">${item.a}</p>
        <div class="mt-3 flex gap-2">
          <button class="speak-faq-btn text-xs px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 flex items-center gap-1.5" data-text="${encodeURIComponent(item.a)}">
            <i class="fas fa-volume-up"></i> Listen to Avatar
          </button>
        </div>
      `;
      
      const speakBtn = card.querySelector('.speak-faq-btn');
      speakBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.speakText(decodeURIComponent(speakBtn.getAttribute('data-text')));
      });

      this.faqList.appendChild(card);
    });
  }
}

// Global Avatar Engine instance initializer
window.addEventListener('DOMContentLoaded', () => {
  window.avatarEngine = new AvatarEngine();
});
