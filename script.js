const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  if (window.scrollY > 30) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  const scrollTopBtn = document.getElementById("scrollTop");
  if (scrollTopBtn) {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  }
});

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    navToggle.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.textContent = "☰";
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

const scrollTopBtn = document.createElement("button");
scrollTopBtn.id = "scrollTop";
scrollTopBtn.innerHTML = "↑";
scrollTopBtn.setAttribute("aria-label", "Scroll to top");
document.body.appendChild(scrollTopBtn);

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const filterBtns = document.querySelectorAll(".filter-btn");
const promiseCards = document.querySelectorAll(".promise-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    promiseCards.forEach((card) => {
      if (filter === "all" || card.dataset.status === filter) {
        card.classList.remove("hidden");
        card.style.animation = "none";
        requestAnimationFrame(() => {
          card.style.animation = "cardPop 0.3s ease forwards";
        });
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

const observerOptions = {
  threshold: 0.12,
  rootMargin: "0px 0px -40px 0px",
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.children);
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, delay);
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

const animatableSelectors = [
  ".promise-card",
  ".kand-card",
  ".timeline-card",
  ".source-card",
  ".score-item",
  ".stat-card",
  ".contact-item",
  ".section-header",
];

animatableSelectors.forEach((sel) => {
  document.querySelectorAll(sel).forEach((el) => {
    el.classList.add("fade-in");
    fadeObserver.observe(el);
  });
});

document.querySelectorAll(".promise-card, .kand-card").forEach((card) => {
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  card.addEventListener("mousemove", (e) => {
    if (isMobile()) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
    card.style.transition = "transform 0.05s ease";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
  });
});

function animateCountUp(el) {
  const raw = el.textContent.trim();
  const match = raw.match(/^(\d+)([+%]?)$/);
  if (!match) return;

  const target = parseInt(match[1], 10);
  const suffix = match[2] || "";
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = current + suffix;
    }
  }, 25);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".stat-num").forEach(animateCountUp);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

const heroStats = document.querySelector(".hero-stats");
if (heroStats) statObserver.observe(heroStats);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navLinks.classList.contains("open")) {
    navLinks.classList.remove("open");
    navToggle.textContent = "☰";
  }
});

const style = document.createElement("style");
style.textContent = `
  @keyframes cardPop {
    from { opacity: 0.5; transform: scale(0.96) translateY(8px); }
    to   { opacity: 1;   transform: scale(1) translateY(0); }
  }
`;
document.head.appendChild(style);

const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach((a) => {
          a.style.color =
            a.getAttribute("href") === `#${id}` ? "var(--primary)" : "";
        });
      }
    });
  },
  { threshold: 0.4 },
);

sections.forEach((s) => sectionObserver.observe(s));

const bgMusic = document.getElementById("bg-music");
const musicToggleBtn = document.getElementById("music-toggle");

if (bgMusic && musicToggleBtn) {
  bgMusic.volume = 0.4;

  const updateBtnState = () => {
    if (bgMusic.paused) {
      musicToggleBtn.classList.remove("playing");
      musicToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    } else {
      musicToggleBtn.classList.add("playing");
      musicToggleBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
    }
  };

  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        updateBtnState();
      })
      .catch((error) => {
        const startAudio = () => {
          bgMusic.play();
          updateBtnState();
          document.removeEventListener("click", startAudio);
        };
        document.addEventListener("click", startAudio);
      });
  }

  musicToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (bgMusic.paused) {
      bgMusic.play();
    } else {
      bgMusic.pause();
    }
    updateBtnState();
  });
}

(function initLangSwitcher() {
  const translations = {
    en: {
      "nav-home": "Home",
      "nav-promises": "Promises",
      "nav-kands": "Scandals",
      "nav-timeline": "Timeline",
      "nav-sources": "Sources",
      "nav-about": "About",
      "hero-chip": "Nepali Congress · Evaluation",
      "hero-subtitle":
        "Promise. Forget. Repeat — <strong>Nepali Congress Upgraded</strong>.<br/>(Fact-based archive of promises made &amp; forgotten.)",
      "hero-stat-1": "Promises",
      "hero-stat-2": "Fulfilled",
      "hero-stat-3": "Scandals",
      "hero-stat-4": "Apologies",
      "btn-promises": "View Promises",
      "btn-kands": "View Scandals",
      "promises-tag": "Promises",
      "promises-h2": "Promised vs. Delivered",
      "promises-desc":
        "Key election promises of Congress and their current status — fact-based.",
      "kands-tag": "Scandals",
      "kands-h2": "Notable Kands",
      "kands-desc":
        "Fact-based, sourced — notable controversies of the Congress.",
      "timeline-tag": "Timeline",
      "timeline-h2": "Key Actions & Claims",
      "timeline-desc": "Chronology of key events and promises.",
      "scorecard-tag": "Scorecard",
      "scorecard-h2": "MuttonKaji Report Card",
      "scorecard-desc": "Objective assessment",
      "scorecard-disclaimer": "See facts in the sources section.",
      "sources-tag": "Sources",
      "sources-h2": "Sources & References",
      "sources-desc": "All facts here are based on publicly available sources.",
      "about-tag": "About",
      "about-h2": "About MuttonKaji",
      "about-what-h3": "What is this?",
      "about-what-p1":
        "<strong>MuttonKaji (Congress 0.2)</strong> is a fact-based archive that presents the promises, scandals, and decisions of Nepali Congress based on public sources.",
      "about-what-p2":
        'Our goal: accountability, transparency, and informed citizenship. "MuttonKaji" — we speak up, we don\'t forget.',
      "about-contact-h3": "Contact",
      "contribute-text":
        "<strong>Contribute:</strong> Want to add facts, sources, or scandals? Email us or send a GitHub PR.",
      "filter-all": "All",
      "filter-broken": "Forgotten",
      "filter-partial": "Partial",
      "filter-kept": "Fulfilled",
      "footer-promises": "Promises",
      "footer-kands": "Scandals",
      "footer-timeline": "Timeline",
      "footer-sources": "Sources",
      "footer-about": "About",
      "disclaimer-text":
        "<strong>Disclaimer:</strong> This website is currently under construction. All claims are based on publicly available sources. It does not aim to make personal accusations against any individual or party.",
      "status-broken": "Forgotten",
      "status-partial": "Partial",
      "severity-high": "High",
      "severity-medium": "Medium",
      "source-label": "Source:",
      "tl-result-broken": "Years delayed.",
      "tl-result-disputed": "Result disputed.",
      "tl-result-partial": "Short-term stability.",
      "tl-result-eval": "Still under evaluation.",
      "tl-result-unity": "Party unity in question.",
      "score-promise": "Promise Fulfillment",
      "score-transparency": "Transparency",
      "score-infra": "Infrastructure",
      "score-corruption": "Corruption Control",
      "score-apology": "Apology Ability",
      "score-speech": "Speech Skills",
    },
    ne: {
      "nav-home": "गृह",
      "nav-promises": "वाचाहरू",
      "nav-kands": "काण्डहरू",
      "nav-timeline": "टाइमलाइन",
      "nav-sources": "स्रोतहरू",
      "nav-about": "बारेमा",
      "hero-chip": "नेपाली कांग्रेस • मूल्यांकन",
      "hero-subtitle":
        "वाचा गर्ने, भुल्ने, फेरि वाचा गर्ने — <strong>नेपाली कांग्रेसको अपग्रेड</strong>।<br/>(Fact-based archive of promises made &amp; forgotten.)",
      "hero-stat-1": "वाचाहरू",
      "hero-stat-2": "पूरा भएका",
      "hero-stat-3": "काण्डहरू",
      "hero-stat-4": "माफीहरू",
      "btn-promises": "वाचाहरू हेर्नुस्",
      "btn-kands": "काण्डहरू हेर्नुस्",
      "promises-tag": "वाचाहरू",
      "promises-h2": "Promised vs. Delivered",
      "promises-desc":
        "कांग्रेसका मुख्य चुनावी वाचा र तिनको हालत — तथ्यमा आधारित।",
      "kands-tag": "काण्डहरू",
      "kands-h2": "Notable Kands",
      "kands-desc": "तथ्यमा आधारित, स्रोत सहित — कांग्रेसका उल्लेखनीय विवाद।",
      "timeline-tag": "टाइमलाइन",
      "timeline-h2": "Key Actions & Claims",
      "timeline-desc": "मुख्य घटना र वाचाहरूको कालक्रम।",
      "scorecard-tag": "स्कोरकार्ड",
      "scorecard-h2": "MuttonKaji Report Card",
      "scorecard-desc": "वस्तुनिष्ठ मूल्यांकन",
      "scorecard-disclaimer": "तथ्यहरू स्रोत खण्डमा हेर्नुहोस्।",
      "sources-tag": "स्रोतहरू",
      "sources-h2": "Sources & References",
      "sources-desc": "यहाँका सबै तथ्य सार्वजनिक स्रोतमा आधारित छन्।",
      "about-tag": "बारेमा",
      "about-h2": "About MuttonKaji",
      "about-what-h3": "यो के हो?",
      "about-what-p1":
        "<strong>MuttonKaji (Congress 0.2)</strong> तथ्यमा आधारित अभिलेख हो जसले नेपाली कांग्रेसका वाचा, काण्ड, र निर्णयहरू सार्वजनिक स्रोतको आधारमा प्रस्तुत गर्छ।",
      "about-what-p2":
        'हाम्रो उद्देश्य: जवाफदेहिता, पारदर्शिता, र सूचित नागरिकको निर्माण। \"मटनकाजी\" — बोल्दिन्छौं, भुल्दैनौं।',
      "about-contact-h3": "सम्पर्क / Contact",
      "contribute-text":
        "<strong>Contribute:</strong> तथ्य, स्रोत, वा काण्ड थप्न चाहनुहुन्छ? इमेल गर्नुहोस् वा GitHub PR पठाउनुहोस्।",
      "filter-all": "सबै",
      "filter-broken": "भुलियो",
      "filter-partial": "आंशिक",
      "filter-kept": "पूरा",
      "footer-promises": "वाचाहरू",
      "footer-kands": "काण्डहरू",
      "footer-timeline": "टाइमलाइन",
      "footer-sources": "स्रोत",
      "footer-about": "बारेमा",
      "disclaimer-text":
        "<strong>Disclaimer:</strong> यो वेबसाइट हाल निर्माण चरणमा छ। यहाँका सबै दाबी सार्वजनिक रूपमा उपलब्ध स्रोतहरूमा आधारित छन्। यसले कुनै पनि व्यक्ति वा दलको विरुद्ध व्यक्तिगत आरोप लगाउने उद्देश्य राख्दैन।",
      "status-broken": "भुलियो",
      "status-partial": "आंशिक",
      "severity-high": "उच्च",
      "severity-medium": "मध्यम",
      "source-label": "स्रोत:",
      "tl-result-broken": "वर्षौं ढिलो।",
      "tl-result-disputed": "नतिजा विवादास्पद।",
      "tl-result-partial": "अल्पकालीन स्थिरता।",
      "tl-result-eval": "अझै मूल्यांकनमा।",
      "tl-result-unity": "पार्टी एकता प्रश्नमा।",
      "score-promise": "वाचा पूर्ति",
      "score-transparency": "पारदर्शिता",
      "score-infra": "पूर्वाधार",
      "score-corruption": "भ्रष्टाचार नियन्त्रण",
      "score-apology": "माफी माग्ने क्षमता",
      "score-speech": "भाषण कला",
    },
  };

  let currentLang = localStorage.getItem("mk-lang") || "ne";

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem("mk-lang", lang);
    document.documentElement.lang = lang === "ne" ? "ne" : "en";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const t = translations[lang][key];
      if (t !== undefined) el.innerHTML = t;
    });

    const btn = document.getElementById("lang-toggle");
    if (btn) btn.textContent = lang === "ne" ? "EN" : "ने";
  }

  function initLangBtn() {
    const btn = document.getElementById("lang-toggle");
    if (!btn) return;
    btn.textContent = currentLang === "ne" ? "EN" : "ने";
    btn.addEventListener("click", () => {
      applyLang(currentLang === "ne" ? "en" : "ne");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLangBtn();
    applyLang(currentLang);
  });

  if (document.readyState !== "loading") {
    initLangBtn();
    applyLang(currentLang);
  }
})();
