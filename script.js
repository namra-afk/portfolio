/* ============================================================
   ARMAN L. PUTONG — PORTFOLIO ANIMATIONS & INTERACTIONS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. PAGE ENTRANCE OVERLAY
  ---------------------------------------------------------- */
  const overlay = document.createElement('div');
  overlay.className = 'page-overlay';
  document.body.prepend(overlay);
  setTimeout(() => overlay.remove(), 900);


  /* ----------------------------------------------------------
     2. CURSOR GLOW (desktop only)
  ---------------------------------------------------------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let mx = -500, my = -500;
    let cx = -500, cy = -500;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    });

    const animateGlow = () => {
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      requestAnimationFrame(animateGlow);
    };
    animateGlow();
  }


  /* ----------------------------------------------------------
     3. NAV SCROLL SHADOW
  ---------------------------------------------------------- */
  const nav = document.querySelector('nav');
  const progress = document.querySelector('.scroll-progress');
  const toTopBtn = document.querySelector('.to-top');

  const updateScrollUI = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);

    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progress) progress.style.width = `${Math.min(Math.max(percent, 0), 100)}%`;

    if (toTopBtn) toTopBtn.classList.toggle('visible', window.scrollY > 320);
  };

  window.addEventListener('scroll', () => {
    updateScrollUI();
  }, { passive: true });
  updateScrollUI();

  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ----------------------------------------------------------
     4. SCROLL REVEAL (IntersectionObserver)
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));


  /* ----------------------------------------------------------
     5. SKILL CELL — MAGNETIC TILT ON HOVER
  ---------------------------------------------------------- */
  document.querySelectorAll('.skill-cell').forEach(cell => {
    cell.addEventListener('mousemove', e => {
      const rect = cell.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      cell.style.transform = `translateY(-2px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    cell.addEventListener('mouseleave', () => {
      cell.style.transform = '';
    });
  });


  /* ----------------------------------------------------------
     6. TYPING EFFECT on hero tag
  ---------------------------------------------------------- */
  const tag = document.querySelector('.hero-tag');
  if (tag) {
    const text = tag.textContent.trim();
    tag.textContent = '';

    // Wait for the fade-in animation, then type
    setTimeout(() => {
      let i = 0;
      const type = () => {
        if (i <= text.length) {
          tag.textContent = text.slice(0, i);
          i++;
          setTimeout(type, 45);
        }
      };
      type();
    }, 700);
  }


  /* ----------------------------------------------------------
     7. SMOOTH COUNTER for stat values (number ones)
  ---------------------------------------------------------- */
  // (none currently — placeholder for future numeric stats)


  /* ----------------------------------------------------------
     8. ACTIVE NAV LINK HIGHLIGHT on scroll
  ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => sectionObserver.observe(s));


  /* ----------------------------------------------------------
     9. PROJECT CARD — staggered reveal on first load
  ---------------------------------------------------------- */
  // Already handled by .reveal-stagger on .projects-list wrapper


  /* ----------------------------------------------------------
     10. CONTACT LINKS — letter scramble on hover
  ---------------------------------------------------------- */
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@./';

  document.querySelectorAll('.contact-link').forEach(link => {
    const textNode = [...link.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
    if (!textNode) return;

    const original = textNode.textContent.trim();
    let interval = null;
    let iteration = 0;

    link.addEventListener('mouseenter', () => {
      clearInterval(interval);
      iteration = 0;

      interval = setInterval(() => {
        textNode.textContent = ' ' + original
          .split('')
          .map((char, idx) => {
            if (idx < iteration) return original[idx];
            if (char === ' ' || char === '@' || char === '.' || char === '/') return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        if (iteration >= original.length) clearInterval(interval);
        iteration += 1.5;
      }, 30);
    });

    link.addEventListener('mouseleave', () => {
      clearInterval(interval);
      textNode.textContent = ' ' + original;
    });
  });

});