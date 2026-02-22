/* ============================================================
   MuttonKaji (Congress 0.2) — script.js
   Interactive effects: smooth scroll, navbar, filter, animations.
   ============================================================ */

// ---- NAVBAR: scroll shadow + mobile toggle ----
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  // Add shadow on scroll
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Show/hide scroll-to-top button
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }
});

// Mobile nav toggle
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  });

  // Close nav when a link is clicked (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.textContent = '☰';
    });
  });
}

// ---- SMOOTH SCROLL for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- SCROLL-TO-TOP BUTTON ----
// Creates a floating button dynamically
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scrollTop';
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollTopBtn);

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- PROMISE CARD FILTER ----
const filterBtns = document.querySelectorAll('.filter-btn');
const promiseCards = document.querySelectorAll('.promise-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    promiseCards.forEach(card => {
      if (filter === 'all' || card.dataset.status === filter) {
        card.classList.remove('hidden');
        // Animate in
        card.style.animation = 'none';
        requestAnimationFrame(() => {
          card.style.animation = 'cardPop 0.3s ease forwards';
        });
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ---- FADE-IN ANIMATIONS (Intersection Observer) ----
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // Stagger delay based on element index within its parent
      const siblings = Array.from(entry.target.parentElement.children);
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all cards, kand cards, timeline cards, source cards
const animatableSelectors = [
  '.promise-card',
  '.kand-card',
  '.timeline-card',
  '.source-card',
  '.score-item',
  '.stat-card',
  '.contact-item',
  '.section-header',
];

animatableSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    el.classList.add('fade-in');
    fadeObserver.observe(el);
  });
});

// ---- HOVER TILT on promise cards ----
// Subtle 3D tilt effect on mouse move for desktop
document.querySelectorAll('.promise-card, .kand-card').forEach(card => {
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  card.addEventListener('mousemove', (e) => {
    if (isMobile()) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
    card.style.transition = 'transform 0.05s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
  });
});

// ---- HERO STAT NUMBER COUNT-UP ----
function animateCountUp(el) {
  const raw = el.textContent.trim();
  // Only animate if the value is a number (ignore ∞, ~3% etc.)
  const match = raw.match(/^(\d+)([+%]?)$/);
  if (!match) return;

  const target = parseInt(match[1], 10);
  const suffix = match[2] || '';
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

// Trigger count-up when hero stats come into view
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCountUp);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);

// ---- KEYBOARD ACCESSIBILITY: close mobile nav on Escape ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    navToggle.textContent = '☰';
  }
});

// ---- CSS animation for card pop (injected) ----
const style = document.createElement('style');
style.textContent = `
  @keyframes cardPop {
    from { opacity: 0.5; transform: scale(0.96) translateY(8px); }
    to   { opacity: 1;   transform: scale(1) translateY(0); }
  }
`;
document.head.appendChild(style);

// ---- ACTIVE NAV LINK highlight on scroll ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}`
          ? 'var(--primary)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ---- BACKGROUND MUSIC TOGGLE ----
const bgMusic = document.getElementById('bg-music');
const musicToggleBtn = document.getElementById('music-toggle');

if (bgMusic && musicToggleBtn) {
  bgMusic.volume = 0.4;

  const updateBtnState = () => {
    if (bgMusic.paused) {
      musicToggleBtn.classList.remove('playing');
      musicToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    } else {
      musicToggleBtn.classList.add('playing');
      musicToggleBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
    }
  };

  // Attempt autoplay on load
  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      // Autoplay started successfully
      updateBtnState();
    }).catch(error => {
      // Autoplay was prevented by browser. Wait for first interaction.
      console.log('Autoplay blocked. Waiting for user interaction.');
      const startAudio = () => {
        bgMusic.play();
        updateBtnState();
        document.removeEventListener('click', startAudio);
      };
      document.addEventListener('click', startAudio);
    });
  }

  // Toggle button click handler
  musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering the document click handler
    if (bgMusic.paused) {
      bgMusic.play();
    } else {
      bgMusic.pause();
    }
    updateBtnState();
  });
}
