document.addEventListener('DOMContentLoaded', () => {
  
  initCreativeCursor();

  
  initGsapScrollAnimations();

  
  initScrollAnimations();

  
  initScrollProgressAndParallax();

  
  initFoldTextScrollAnimation();

  
  init3DTilt();

  
  initValuesAccordion();

  
  initCounters();

  
  initEstimator();

  
  initCarousels();

  
  initForms();

  
  initWizard();

  
  initDashboardFeatures();

  
  initBackToTop();
  initClientsFeedbackTabs();

  
  initFilterChips();
  initOfficeSwitcher();
  initSlotBooking();
  initActionSuccessModals();
  init404Stage();
});


function initCreativeCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');
  if (!dot || !ring || window.innerWidth < 992) return;

  
  const canvas = document.getElementById('cursorCanvas') || document.createElement('canvas');
  if (!canvas.id) {
    canvas.id = 'cursorCanvas';
    document.body.appendChild(canvas);
  }
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isHovered = false;
  let isViewMode = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    
    if (Math.random() > 0.4) {
      particles.push({
        x: mouseX,
        y: mouseY,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2.2 + 1.2,
        color: '#BFF747',
        alpha: 0.85,
        decay: 0.035
      });
    }
  }, { passive: true });

  
  window.addEventListener('click', (e) => {
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 / 10) * i;
      const speed = Math.random() * 2.2 + 1.2;
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 2,
        color: '#BFF747',
        alpha: 1,
        decay: 0.04
      });
    }
  });

  
  function renderCursor() {
    
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    
    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#BFF747';
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  
  function attachHoverEffects() {
    const clickableEls = document.querySelectorAll('a, button, input, select, textarea, .btn-style-one, .btn-lime-solid, .btn-join-us-dark, .services-cutout-arrow, .feedback-dash-pill, .capsule-social-circle, .accordion-button');
    clickableEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('hovered');
        dot.classList.add('hovered');
        ring.textContent = '';
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('hovered');
        dot.classList.remove('hovered');
      });
    });

    
  }

  attachHoverEffects();
  setTimeout(attachHoverEffects, 500);
}


function initFoldTextScrollAnimation() {
  const targetHeadings = document.querySelectorAll('[data-scroll-title]');
  if (!targetHeadings.length) return;

  targetHeadings.forEach(heading => {
    if (heading.dataset.foldDone) return;
    heading.dataset.foldDone = "true";
    heading.classList.add('fold-text-container');

    let globalCharIndex = 0;

    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text.trim()) return document.createTextNode(text);

        const words = text.split(/(\s+)/);
        const frag = document.createDocumentFragment();

        words.forEach(w => {
          if (!w.trim()) {
            frag.appendChild(document.createTextNode(w));
          } else {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'fold-word';

            for (const character of w) {
              const charSpan = document.createElement('span');
              charSpan.className = 'fold-char';
              charSpan.style.setProperty('--char-index', globalCharIndex);
              charSpan.textContent = character;
              wordSpan.appendChild(charSpan);
              globalCharIndex++;
            }
            frag.appendChild(wordSpan);
          }
        });
        return frag;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        
        const clone = node.cloneNode(false);
        Array.from(node.childNodes).forEach(child => {
          clone.appendChild(processNode(child));
        });
        return clone;
      }
      return node.cloneNode(true);
    }

    const children = Array.from(heading.childNodes);
    heading.innerHTML = '';
    children.forEach(c => heading.appendChild(processNode(c)));
  });

  
  let scrollUpdateQueued = false;
  function checkFoldHeadings() {
    scrollUpdateQueued = false;
    const triggerBottom = window.innerHeight * 0.92;
    const triggerTop = 30;

    targetHeadings.forEach(h => {
      const rect = h.getBoundingClientRect();
      
      if (rect.top < triggerBottom && rect.bottom > triggerTop) {
        h.classList.add('fold-revealed');
      } else {
        
        h.classList.remove('fold-revealed');
      }
    });
  }

  function requestFoldUpdate() {
    if (scrollUpdateQueued) return;
    scrollUpdateQueued = true;
    window.requestAnimationFrame(checkFoldHeadings);
  }

  window.addEventListener('scroll', requestFoldUpdate, { passive: true });
  window.addEventListener('resize', requestFoldUpdate, { passive: true });
  checkFoldHeadings();
  setTimeout(checkFoldHeadings, 150);
}


function initScrollProgressAndParallax() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  function updateProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
}


function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in, .stagger-children, .gsap-fade-up, .gsap-zoom-in, .gsap-zoom-out, .gsap-slide-left, .gsap-slide-right, .gsap-stagger-grid, .reveal-init');
  if (!elements.length) return;

  function activateElement(el) {
    el.classList.add('in-view', 'gsap-animated', 'reveal-active');
    if (el.classList.contains('stagger-children')) {
      Array.from(el.children).forEach((child, idx) => {
        child.classList.add('in-view');
        if (!child.style.transitionDelay) {
          child.style.transitionDelay = `${idx * 0.08}s`;
        }
      });
    }
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activateElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.04, rootMargin: '0px 0px 50px 0px' });

    elements.forEach(el => {
      
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        activateElement(el);
      } else {
        observer.observe(el);
      }
    });
  } else {
    elements.forEach(el => activateElement(el));
  }
}


function init3DTilt() {
  const tiltCards = document.querySelectorAll('[data-tilt], .feature-card, .review-card, .process-step-card, .calc-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}


function initCounters() {
  const counters = document.querySelectorAll('.counter-val, .js-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target')) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = target.toString().includes('.');
        const decimals = isDecimal ? target.toString().split('.')[1].length : 0;
        
        let count = 0;
        const step = target / 45;
        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            el.textContent = (isDecimal ? target.toFixed(decimals) : Math.round(target)) + suffix;
            clearInterval(timer);
          } else {
            el.textContent = (isDecimal ? count.toFixed(decimals) : Math.round(count)) + suffix;
          }
        }, 25);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}


function initEstimator() {
  
  const nodesSlider = document.getElementById('calc-nodes-slider');
  const nodesVal = document.getElementById('calc-nodes-val');
  const latencySaved = document.getElementById('calc-latency-saved');
  const costSaved = document.getElementById('calc-cost-saved');
  const recoverySaved = document.getElementById('calc-recovery-saved');

  if (nodesSlider) {
    nodesSlider.addEventListener('input', (e) => {
      const nodes = parseInt(e.target.value, 10);
      if (nodesVal) nodesVal.textContent = `${nodes} Microservice Pods`;
      if (latencySaved) latencySaved.textContent = `${Math.round(nodes * 4.2 + 15)}ms Latency Drop`;
      if (costSaved) costSaved.textContent = `$${(nodes * 1850).toLocaleString('en-US')}/mo Saved`;
      if (recoverySaved) recoverySaved.textContent = `<${Math.max(1, Math.round(18 - nodes * 0.3))}s MTTR Auto-Recovery`;
    });
  }

  
  const tierSelect = document.getElementById('calcTier');
  const scopeSelect = document.getElementById('calcScope');
  const speedRange = document.getElementById('calcSpeed');
  const resultCost = document.getElementById('calcResultCost');
  const resultRoi = document.getElementById('calcResultRoi');
  if (tierSelect && resultCost) {
    function calculate() {
      let base = 8000;
      if (tierSelect.value === 'enterprise') base = 22000;
      if (tierSelect.value === 'hyperscale') base = 48000;

      let multiplier = parseFloat(scopeSelect ? scopeSelect.value : '1.2');
      let speedFactor = speedRange ? parseFloat(speedRange.value) : 1;

      let totalCost = Math.round(base * multiplier * speedFactor);
      let roiMultiplier = (3.5 + (base / 12000)).toFixed(1);

      resultCost.innerText = '$' + totalCost.toLocaleString();
      if (resultRoi) resultRoi.innerText = roiMultiplier + 'x ROI';
    }

    [tierSelect, scopeSelect, speedRange].forEach(input => {
      if (input) input.addEventListener('input', calculate);
    });
    calculate();
  }
}


function initCarousels() {
  if (typeof Swiper === 'undefined') return;

  
  if (document.querySelector('.creovio-testimonials-swiper')) {
    new Swiper('.creovio-testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      speed: 700,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.feedback-swiper-pagination',
        clickable: true,
        bulletClass: 'feedback-dash-pill',
        bulletActiveClass: 'active',
        renderBullet: function (index, className) {
          return '<span class="' + className + '"></span>';
        }
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 28
        }
      }
    });
  }

  
  if (document.querySelector('.testimonials-swiper')) {
    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      speed: 800,
      autoplay: { 
        delay: 3500, 
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: { 
        el: '.swiper-pagination', 
        clickable: true 
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 }
      }
    });
  }

  
  if (document.querySelector('.showcase-swiper')) {
    new Swiper('.showcase-swiper', {
      slidesPerView: 1,
      loop: true,
      speed: 1000,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      autoplay: { delay: 4000, disableOnInteraction: false }
    });
  }
}


function initForms() {
  const forms = document.querySelectorAll('.js-demo-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('✓ Success! Your request has been securely dispatched to Stackly Salem HQ. We will contact you within 2 business hours.');
      form.reset();
    });
  });
}


function initWizard() {
  let currentStep = 1;
  const totalSteps = 4;
  const nextBtn = document.getElementById('wizardNextBtn');
  const prevBtn = document.getElementById('wizardPrevBtn');
  const submitBtn = document.getElementById('wizardSubmitBtn');
  if (!nextBtn) return;

  function updateSteps() {
    document.querySelectorAll('.wizard-step-pane').forEach(p => {
      p.style.display = p.getAttribute('data-step') == currentStep ? 'block' : 'none';
    });
    document.querySelectorAll('.wizard-indicator-item').forEach(ind => {
      const s = parseInt(ind.getAttribute('data-step'), 10);
      ind.classList.toggle('active', s <= currentStep);
    });

    if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    if (nextBtn) nextBtn.style.display = currentStep < totalSteps ? 'inline-flex' : 'none';
    if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';
  }

  nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps) {
      currentStep++;
      updateSteps();
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateSteps();
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      alert('✓ Welcome to Stackly! Your client account is initialized.');
      window.location.href = 'customer-dashboard.html';
    });
  }
}


function initDashboardShell() {
  const sidebar = document.getElementById('dashSidebar');
  if (!sidebar) return;

  const overlay = document.getElementById('dashOverlay');
  const toggle = document.getElementById('dashMenuToggle');
  const logoutLink = document.getElementById('dashLogout');
  const logoutModal = document.getElementById('logoutModal');
  const cancelLogout = document.getElementById('cancelLogout');
  const confirmLogout = document.getElementById('confirmLogout');

  function closeSidebar() {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    document.body.classList.remove('dash-sidebar-open');
    if (toggle) {
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  function openSidebar() {
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('show');
    document.body.classList.add('dash-sidebar-open');
    if (toggle) {
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  }

  function activateSection(section) {
    if (!section) return;
    document.querySelectorAll('.dash-section').forEach((el) => {
      el.classList.toggle('active', el.id === 'section-' + section);
    });
    document.querySelectorAll('.dash-sidebar__link[data-section]').forEach((link) => {
      link.classList.toggle('active', link.getAttribute('data-section') === section);
    });
    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) closeSidebar();
      else openSidebar();
    });
  }
  if (overlay) overlay.addEventListener('click', closeSidebar);
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) closeSidebar();
  });

  document.querySelectorAll('[data-section]').forEach((btn) => {
    btn.addEventListener('click', () => activateSection(btn.getAttribute('data-section')));
  });

  const email = localStorage.getItem('userEmail') || (document.getElementById('dashUserEmail')?.textContent || 'client@stackly.agency');
  const name = localStorage.getItem('userName') || (email.split('@')[0] || 'Client');
  const first = name.split(/\s+/)[0] || name;
  const initial = (name.charAt(0) || 'S').toUpperCase();
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  setText('dashUserEmail', email);
  setText('dashUserName', name);
  setText('dashWelcomeName', first);
  setText('dashChipName', name);
  setText('dashBillingName', name);
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  if (profileName && !profileName.value) profileName.value = name;
  if (profileEmail && !profileEmail.value) profileEmail.value = email;
  const avatar = document.getElementById('dashUserAvatar');
  if (avatar) avatar.textContent = initial;
  document.querySelectorAll('.dash-topbar__chip-avatar').forEach((a) => { a.textContent = initial; });

  function showLogoutModal(e) {
    if (e) e.preventDefault();
    if (!logoutModal) {
      logout();
      return;
    }
    logoutModal.classList.add('show');
    logoutModal.setAttribute('aria-hidden', 'false');
  }
  function hideLogoutModal() {
    if (!logoutModal) return;
    logoutModal.classList.remove('show');
    logoutModal.setAttribute('aria-hidden', 'true');
  }
  if (logoutLink) logoutLink.addEventListener('click', showLogoutModal);
  if (cancelLogout) cancelLogout.addEventListener('click', hideLogoutModal);
  if (confirmLogout) confirmLogout.addEventListener('click', () => logout());
  if (logoutModal) {
    logoutModal.addEventListener('click', (e) => {
      if (e.target === logoutModal) hideLogoutModal();
    });
  }

  document.querySelectorAll('.dash-switch').forEach((sw) => {
    sw.addEventListener('click', () => {
      const on = sw.classList.toggle('is-on');
      sw.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  });

  window.handleVerify = function (btn, result) {
    const row = btn.closest('tr');
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: result === 'approved' ? 'Sprint approved' : 'Sprint rejected',
        icon: result === 'approved' ? 'success' : 'info',
        background: '#181818',
        color: '#fff',
        timer: 1400,
        showConfirmButton: false
      });
    }
    if (row) row.remove();
  };

  (function initBookingFilters() {
    const filters = document.getElementById('bookingFilters');
    const table = document.getElementById('bookingsTable');
    const empty = document.getElementById('bookingsEmpty');
    const countBadge = document.getElementById('bookingFilterCount');
    if (!filters || !table) return;
    const scrollWrap = table.closest('.dash-table-scroll');
    const rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr[data-status]'));
    function applyFilter(status) {
      let shown = 0;
      rows.forEach((row) => {
        const rowStatus = (row.getAttribute('data-status') || '').toLowerCase();
        const match = status === 'all' || rowStatus === status;
        row.hidden = !match;
        if (match) shown += 1;
      });
      if (empty) empty.hidden = shown > 0;
      if (scrollWrap) scrollWrap.hidden = shown === 0;
      if (countBadge) countBadge.textContent = shown + ' shown';
    }
    filters.querySelectorAll('.dash-filter-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        filters.querySelectorAll('.dash-filter-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        applyFilter((chip.getAttribute('data-filter') || 'all').toLowerCase());
      });
    });
    applyFilter('all');
  })();

  (function initHistoryFilters() {
    const filters = document.getElementById('historyFilters');
    const list = document.getElementById('historyList');
    if (!filters || !list) return;
    const cards = Array.prototype.slice.call(list.querySelectorAll('.dash-history-card[data-filter]'));
    filters.querySelectorAll('.dash-filter-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        filters.querySelectorAll('.dash-filter-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const status = (chip.getAttribute('data-filter') || 'all').toLowerCase();
        cards.forEach((card) => {
          const match = status === 'all' || (card.getAttribute('data-filter') || '') === status;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  })();

  const profileSave = document.getElementById('profileSave');
  if (profileSave) {
    profileSave.addEventListener('click', () => {
      const n = document.getElementById('profileName')?.value.trim();
      const em = document.getElementById('profileEmail')?.value.trim();
      if (n) localStorage.setItem('userName', n);
      if (em) localStorage.setItem('userEmail', em);
      if (typeof Swal !== 'undefined') {
        Swal.fire({ title: 'Saved', text: 'Profile updated.', icon: 'success', background: '#181818', color: '#fff', timer: 1400, showConfirmButton: false });
      }
    });
  }

  const supportSubmit = document.getElementById('supportSubmit');
  if (supportSubmit) {
    supportSubmit.addEventListener('click', () => {
      const subject = document.getElementById('supportSubject')?.value.trim();
      const message = document.getElementById('supportMessage')?.value.trim();
      if (!subject || !message) {
        if (typeof Swal !== 'undefined') {
          Swal.fire({ title: 'Missing details', text: 'Please add a subject and message.', icon: 'warning', background: '#181818', color: '#fff' });
        }
        return;
      }
      if (typeof Swal !== 'undefined') {
        Swal.fire({ title: 'Request sent', text: 'Salem desk will reply shortly.', icon: 'success', background: '#181818', color: '#fff', timer: 1600, showConfirmButton: false });
      }
      document.getElementById('supportForm')?.reset();
    });
  }
}

function initDashboardFeatures() {
  initDashboardShell();

  if (typeof Chart === 'undefined') return;

  
  const custCanvas = document.getElementById('customerProgressChart');
  if (custCanvas) {
    new Chart(custCanvas, {
      type: 'line',
      data: {
        labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', 'Sprint 6'],
        datasets: [{
          label: 'Completed Tasks',
          data: [12, 28, 45, 68, 85, 100],
          borderColor: '#00f0ff',
          backgroundColor: 'rgba(191, 247, 71, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } }
        }
      }
    });
  }

  
  const adminRev = document.getElementById('adminRevenueChart');
  if (adminRev) {
    new Chart(adminRev, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [{
          label: 'Revenue ($K)',
          data: [140, 185, 220, 260, 310, 390, 440, 520],
          backgroundColor: '#BFF747',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } }
        }
      }
    });
  }

  
  const adminPie = document.getElementById('adminServicesPieChart');
  if (adminPie) {
    new Chart(adminPie, {
      type: 'doughnut',
      data: {
        labels: ['Cloud & DevOps', 'Applied AI', 'Full-Stack Web', 'Cybersecurity'],
        datasets: [{
          data: [40, 30, 20, 10],
          backgroundColor: ['#BFF747', '#60A5FA', '#F59E0B', '#A78BFA'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } }
      }
    });
  }

  
  const chatInput = document.getElementById('chatMsgInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatContainer = document.getElementById('chatMessagesContainer');
  if (chatSendBtn && chatInput && chatContainer) {
    chatSendBtn.addEventListener('click', () => {
      const val = chatInput.value.trim();
      if (!val) return;
      
      const userBubble = document.createElement('div');
      userBubble.className = 'd-flex justify-content-end mb-2';
      userBubble.innerHTML = `<div style="background: var(--primary-gradient); color: #fff; padding: 8px 12px; border-radius: 14px 14px 2px 14px; font-size: 0.85rem;">${val}</div>`;
      chatContainer.appendChild(userBubble);
      chatInput.value = '';
      chatContainer.scrollTop = chatContainer.scrollHeight;

      setTimeout(() => {
        const replyBubble = document.createElement('div');
        replyBubble.className = 'd-flex justify-content-start mb-2';
        replyBubble.innerHTML = `<div style="background: rgba(255,255,255,0.08); color: #e2e8f0; padding: 8px 12px; border-radius: 14px 14px 14px 2px; font-size: 0.85rem;"><strong class="text-cyan d-block" style="font-size: 0.72rem;">Salem Tech Lead:</strong> Understood! We are executing this in Sprint 5.</div>`;
        chatContainer.appendChild(replyBubble);
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 1000);
    });
  }
}


function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


document.addEventListener('DOMContentLoaded', () => {
  const videoModal = document.getElementById('videoShowreelModal');
  if (videoModal) {
    const video = videoModal.querySelector('video');

    function playVideo() {
      if (video) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Autoplay prevented or interrupted:', error);
          });
        }
      }
    }

    function stopVideo() {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }

    // Play when modal opens or button is clicked
    videoModal.addEventListener('show.bs.modal', playVideo);
    videoModal.addEventListener('shown.bs.modal', playVideo);

    const showreelBtns = document.querySelectorAll('[data-bs-target="#videoShowreelModal"]');
    showreelBtns.forEach(btn => {
      btn.addEventListener('click', playVideo);
    });

    // Pause and reset video when modal closes
    videoModal.addEventListener('hide.bs.modal', stopVideo);
    videoModal.addEventListener('hidden.bs.modal', stopVideo);
  }
});




function initValuesAccordion() {
  const cards = document.querySelectorAll('.val-acc-card');
  const container = document.querySelector('.values-accordion-container');
  if (!cards.length) return;

  cards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  if (container) {
    container.addEventListener('mouseleave', () => {
      cards.forEach(c => c.classList.remove('active'));
    });
  }
}


function initRecentWorksSwiper() {
  if (typeof Swiper === 'undefined') return;
  const recentWorksEl = document.querySelector('.recent-works-swiper');
  if (!recentWorksEl) return;

  new Swiper('.recent-works-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    speed: 700,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      nextEl: '.recent-works-next',
      prevEl: '.recent-works-prev',
    },
    breakpoints: {
      640: { slidesPerView: 1.5, spaceBetween: 20 },
      768: { slidesPerView: 2, spaceBetween: 24 },
      1024: { slidesPerView: 3, spaceBetween: 28 },
      1400: { slidesPerView: 3.5, spaceBetween: 30 }
    }
  });
}


function initCreovioTestimonialsSwiper() {
  if (typeof Swiper === 'undefined') return;
  const testEl = document.querySelector('.creovio-testimonials-swiper');
  if (!testEl) return;

  new Swiper('.creovio-testimonials-swiper', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 24,
    loop: true,
    speed: 700,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.feedback-swiper-pagination',
      clickable: true,
      bulletClass: 'feedback-dash-pill',
      bulletActiveClass: 'active',
      renderBullet: function (index, className) {
        return '<span class="' + className + '"></span>';
      }
    },
    breakpoints: {
      640: {
        slidesPerView: 1.5,
        slidesPerGroup: 1,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 2,
        slidesPerGroup: 1,
        spaceBetween: 24
      },
      1024: {
        slidesPerView: 3,
        slidesPerGroup: 1,
        spaceBetween: 28
      }
    }
  });
}


function initWordSlideTriggers() {
  const wordWraps = document.querySelectorAll('.word-slide-wrap');
  if (!wordWraps.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15 });

  wordWraps.forEach(w => observer.observe(w));
}



function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


function initValuesAccordion() {
  const cards = document.querySelectorAll('.val-acc-card');
  const container = document.querySelector('.values-accordion-container');
  if (!cards.length) return;

  cards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  if (container) {
    container.addEventListener('mouseleave', () => {
      cards.forEach(c => c.classList.remove('active'));
    });
  }
}


function initRecentWorksSwiper() {
  if (typeof Swiper === 'undefined') return;
  const recentWorksEl = document.querySelector('.recent-works-swiper');
  if (!recentWorksEl) return;

  new Swiper('.recent-works-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    speed: 700,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      nextEl: '.recent-works-next',
      prevEl: '.recent-works-prev',
    },
    breakpoints: {
      640: { slidesPerView: 1.5, spaceBetween: 20 },
      768: { slidesPerView: 2, spaceBetween: 24 },
      1024: { slidesPerView: 3, spaceBetween: 28 },
      1400: { slidesPerView: 3.5, spaceBetween: 30 }
    }
  });
}


function initCreovioTestimonialsSwiper() {
  if (typeof Swiper === 'undefined') return;
  const testEl = document.querySelector('.creovio-testimonials-swiper');
  if (!testEl) return;

  new Swiper('.creovio-testimonials-swiper', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 24,
    loop: true,
    speed: 700,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.feedback-swiper-pagination',
      clickable: true,
      bulletClass: 'feedback-dash-pill',
      bulletActiveClass: 'active',
      renderBullet: function (index, className) {
        return '<span class="' + className + '"></span>';
      }
    },
    breakpoints: {
      640: {
        slidesPerView: 1.5,
        slidesPerGroup: 1,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 2,
        slidesPerGroup: 1,
        spaceBetween: 24
      },
      1024: {
        slidesPerView: 3,
        slidesPerGroup: 1,
        spaceBetween: 28
      }
    }
  });
}


function initWordSlideTriggers() {
  const wordWraps = document.querySelectorAll('.word-slide-wrap');
  if (!wordWraps.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15 });

  wordWraps.forEach(w => observer.observe(w));
}


function initClientsFeedbackTabs() {
  const pills = document.querySelectorAll('.feedback-dash-pill');
  const pages = document.querySelectorAll('.feedback-page-grid');
  if (!pills.length || !pages.length) return;

  let currentPage = 1;
  const totalPages = pages.length;
  let autoTimer = null;

  function goToPage(targetPage) {
    if (targetPage < 1 || targetPage > totalPages) return;
    currentPage = targetPage;

    
    pills.forEach((p, idx) => {
      if (idx + 1 === currentPage) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    
    pages.forEach((page, idx) => {
      if (idx + 1 === currentPage) {
        page.classList.remove('d-none');
        page.style.display = 'flex';
        page.style.opacity = '0';
        page.style.transform = 'translateY(8px)';
        setTimeout(() => {
          page.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          page.style.opacity = '1';
          page.style.transform = 'translateY(0)';
        }, 15);
      } else {
        page.classList.add('d-none');
        page.style.display = 'none';
        page.style.opacity = '0';
      }
    });
  }

  
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const pageNum = parseInt(pill.getAttribute('data-page'), 10);
      goToPage(pageNum);
      resetAutoTimer();
    });
  });

  function resetAutoTimer() {
    clearInterval(autoTimer);
    startAutoTimer();
  }

  
  function startAutoTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      let nextPage = currentPage + 1;
      if (nextPage > totalPages) nextPage = 1;
      goToPage(nextPage);
    }, 2000);
  }

  
  goToPage(1);
  startAutoTimer();
}


function initStacklyPreloader() {
  if (window.__stacklyPreloaderInitialized) return;
  window.__stacklyPreloaderInitialized = true;

  
  

  const PRELOADER_TOTAL_MS = 1350; 
  const EXIT_FADE_MS = 350;        
  const HARD_CAP_MS = 1800;        

  function injectPreloaderHTML() {
    if (document.getElementById('stackly-preloader')) return;
    const preloaderEl = document.createElement('div');
    preloaderEl.id = 'stackly-preloader';
    preloaderEl.innerHTML = `
      <div class="preloader-bg-glow"></div>
      <div class="preloader-bg-glow-secondary"></div>
      <div class="preloader-grid-lines"></div>
      <div class="preloader-particles">
        <span class="spark-dot"></span>
        <span class="spark-dot"></span>
        <span class="spark-dot"></span>
        <span class="spark-dot"></span>
        <span class="spark-dot"></span>
      </div>
      <div class="preloader-content">
        <div class="preloader-circle-wrapper">
          <div class="circle-ring ring-outer-spin"></div>
          <div class="circle-ring ring-middle-pulse"></div>
          <div class="circle-ring ring-inner-orbit">
            <span class="orbit-dot dot-1"></span>
            <span class="orbit-dot dot-2"></span>
            <span class="orbit-dot dot-3"></span>
            <span class="orbit-dot dot-4"></span>
          </div>
          <div class="preloader-logo-box">
            <img src="assets/top-logo.webp" alt="Stackly Logo" class="preloader-logo-img">
            <div class="logo-shimmer"></div>
          </div>
        </div>
        <div class="preloader-bar-container">
          <div class="preloader-progress-track">
            <div class="preloader-progress-fill" id="preloader-progress-fill">
              <div class="progress-glow-tip"></div>
            </div>
          </div>
          <div class="preloader-meta d-flex justify-content-between align-items-center mt-2">
            <span class="preloader-status-text" id="preloader-status-text">INITIALIZING ENTERPRISE ENVIRONMENT...</span>
            <span class="preloader-pct-badge"><span id="preloader-pct-num">0</span>%</span>
          </div>
          <div class="preloader-soundwave">
            <span class="soundwave-bar"></span>
            <span class="soundwave-bar"></span>
            <span class="soundwave-bar"></span>
            <span class="soundwave-bar"></span>
            <span class="soundwave-bar"></span>
            <span class="soundwave-bar"></span>
            <span class="soundwave-bar"></span>
          </div>
        </div>
      </div>
    `;
    if (document.body) {
      document.body.prepend(preloaderEl);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('stackly-preloader')) {
          document.body.prepend(preloaderEl);
        }
      });
    }
  }

  
  injectPreloaderHTML();

  let currentPct = 0;
  let isDone = false;
  let animStartTime = null;

  const statusMessages = [
    { threshold: 0,  text: "INITIALIZING ENTERPRISE ENVIRONMENT..." },
    { threshold: 22, text: "SECURING CLOUD INFRASTRUCTURE..." },
    { threshold: 50, text: "OPTIMIZING DIGITAL ASSETS..." },
    { threshold: 78, text: "SYNCHRONIZING DATA PIPELINES..." },
    { threshold: 95, text: "SYSTEM READY • WELCOME TO STACKLY" }
  ];

  function updateStatusText(pct) {
    const statusEl = document.getElementById('preloader-status-text');
    if (!statusEl) return;
    for (let i = statusMessages.length - 1; i >= 0; i--) {
      if (pct >= statusMessages[i].threshold) {
        if (statusEl.textContent !== statusMessages[i].text) {
          statusEl.textContent = statusMessages[i].text;
        }
        break;
      }
    }
  }

  function setProgress(pct) {
    currentPct = Math.max(currentPct, Math.min(100, pct));
    const fillEl = document.getElementById('preloader-progress-fill');
    const pctNumEl = document.getElementById('preloader-pct-num');
    if (fillEl) fillEl.style.width = currentPct.toFixed(1) + '%';
    if (pctNumEl) pctNumEl.textContent = String(Math.floor(currentPct));
    updateStatusText(Math.floor(currentPct));
  }

  function finishPreloader() {
    if (isDone) return;
    isDone = true;
    setProgress(100);

    const preloaderEl = document.getElementById('stackly-preloader') || document.getElementById('preloader') || document.getElementById('authPreloader');
    setTimeout(() => {
      if (preloaderEl) {
        preloaderEl.classList.add('preloader-hidden');
        preloaderEl.style.opacity = '0';
        setTimeout(() => {
          preloaderEl.style.display = 'none';
          
        }, EXIT_FADE_MS);
      } else {
        
      }
    }, 60);
  }

  function tick(timestamp) {
    if (isDone) return;
    if (!animStartTime) animStartTime = timestamp;
    const elapsed = timestamp - animStartTime;

    const progressRatio = Math.min(1, elapsed / PRELOADER_TOTAL_MS);
    
    const eased = 1 - Math.pow(1 - progressRatio, 2.2);
    const targetPct = eased * 100;
    setProgress(targetPct);

    if (progressRatio >= 1 || elapsed >= HARD_CAP_MS) {
      finishPreloader();
    } else {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);

  
  setTimeout(() => {
    finishPreloader();
  }, HARD_CAP_MS);
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStacklyPreloader);
} else {
  initStacklyPreloader();
}


function initSpotlight() {
  const spotlightContainers = document.querySelectorAll('.about-final-cta, .blog-final-cta, .section-final-spotlight');
  spotlightContainers.forEach(container => {
    const spotlight = container.querySelector('.cta-spotlight');
    if (!spotlight) return;

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlight.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    });
  });
}
document.addEventListener('DOMContentLoaded', initSpotlight);


function initFlipCards() {
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', function () {
      flipCards.forEach(c => {
        if (c !== this) c.classList.remove('active');
      });
      this.classList.toggle('active');
    });
  });
}
document.addEventListener('DOMContentLoaded', initFlipCards);


function toggleVisibility(inputId, iconElement) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const type = input.getAttribute("type") === "password" ? "text" : "password";
  input.setAttribute("type", type);
  if (iconElement) {
    iconElement.classList.toggle("fa-eye");
    iconElement.classList.toggle("fa-eye-slash");
  }
}
window.toggleVisibility = toggleVisibility;


function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');
}
window.toggleSidebar = toggleSidebar;

function switchTab(tabId, navElement, titleText) {
  
  const allTabs = document.querySelectorAll('.content-tab');
  allTabs.forEach(t => {
    t.classList.remove('active-tab');
    t.style.display = 'none';
  });

  
  const target = document.getElementById(tabId);
  if (target) {
    target.classList.add('active-tab');
    target.style.display = 'block';
  }

  
  const allNavs = document.querySelectorAll('.dashboard-nav-item, .nav-item, .nav-item-link, .dash-sidebar__link');
  allNavs.forEach(n => n.classList.remove('active'));
  if (navElement) navElement.classList.add('active');

  
  const pageTitle = document.getElementById('dynamic-page-title');
  if (pageTitle && titleText) pageTitle.textContent = titleText;
}
window.switchTab = switchTab;

function logout() {
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
  window.location.href = 'signin.html';
}
window.logout = logout;


function initGsapScrollAnimations() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.gsap-fade-up').forEach(element => {
      gsap.fromTo(element,
        { y: 35, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%' }
        }
      );
    });

    gsap.utils.toArray('.gsap-zoom-in').forEach(element => {
      gsap.fromTo(element,
        { scale: 0.85, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.85, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: element, start: 'top 88%' }
        }
      );
    });

    gsap.utils.toArray('.gsap-zoom-out').forEach(element => {
      gsap.fromTo(element,
        { scale: 1.08, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.85, ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 88%' }
        }
      );
    });

    gsap.utils.toArray('.gsap-slide-left').forEach(element => {
      gsap.fromTo(element,
        { x: -50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%' }
        }
      );
    });

    gsap.utils.toArray('.gsap-slide-right').forEach(element => {
      gsap.fromTo(element,
        { x: 50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%' }
        }
      );
    });

    gsap.utils.toArray('.gsap-stagger-grid').forEach(grid => {
      const items = grid.children;
      if (!items.length) return;
      gsap.fromTo(items,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.65, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: grid, start: 'top 88%' }
        }
      );
    });
  } else {
    
    const animEls = document.querySelectorAll('.gsap-fade-up, .gsap-zoom-in, .gsap-zoom-out, .gsap-slide-left, .gsap-slide-right, .gsap-stagger-grid');
    if (!animEls.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('gsap-animated');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    animEls.forEach(el => observer.observe(el));
  }
}


function initFilterChips() {
  const filterChips = document.querySelectorAll('.filter-chip');
  if (!filterChips.length) return;

  filterChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const parentBar = chip.closest('.filter-bar');
      if (!parentBar) return;

      parentBar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filterVal = (chip.getAttribute('data-filter') || 'all').toLowerCase().trim();
      const targetGrid = document.querySelector(chip.getAttribute('data-target-grid') || '.blog-grid, .portfolio-grid, .team-grid-filterable, .services-grid-filterable');
      
      if (targetGrid) {
        const items = targetGrid.querySelectorAll('[data-category]');
        items.forEach(item => {
          const itemCat = (item.getAttribute('data-category') || '').toLowerCase().trim();
          if (filterVal === 'all' || itemCat.includes(filterVal)) {
            item.style.display = '';
            item.style.opacity = '0';
            item.style.transform = 'translateY(15px)';
            setTimeout(() => {
              item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 10);
          } else {
            item.style.display = 'none';
          }
        });
      }
    });
  });
}


function initOfficeSwitcher() {
  const officeCards = document.querySelectorAll('.office-card');
  const detailsTitle = document.getElementById('activeOfficeTitle');
  const detailsAddress = document.getElementById('activeOfficeAddress');
  const detailsPhone = document.getElementById('activeOfficePhone');
  const detailsEmail = document.getElementById('activeOfficeEmail');
  const detailsHours = document.getElementById('activeOfficeHours');
  const mapIframe = document.getElementById('officeMapIframe') || document.getElementById('contactMapFrame');

  if (!officeCards.length) return;

  const officeData = {
    salem: {
      title: "Salem HQ & AI Command Center",
      address: "MMR Complex, Chinna Thirupathi, Salem, Tamil Nadu 636008, India",
      phone: "+91 98765 43210",
      email: "salem.hq@stackly.com",
      hours: "Mon - Sat: 9:00 AM - 8:00 PM IST (24/7 SRE)",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.161609877049!2d78.17140487386634!3d11.682956588526372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babefef7fd970bb%3A0xe11aef1a71994f9!2sStackly!5e0!3m2!1sen!2sin!4v1781692635052!5m2!1sen!2sin"
    },
    ny: {
      title: "New York Wall Street Advisory Hub",
      address: "45 Rockefeller Plaza, Suite 4400, New York, NY 10111, USA",
      phone: "+1 (212) 555-0199",
      email: "ny.office@stackly.com",
      hours: "Mon - Fri: 8:30 AM - 6:30 PM EST",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215707134371!2d-73.9806497!3d40.758895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258ffb4e85741%3A0x6b772c914bf4e8c1!2sRockefeller%20Center!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
    },
    london: {
      title: "London City Financial District Hub",
      address: "25 Old Broad Street, Tower 42, London EC2N 1HN, United Kingdom",
      phone: "+44 20 7946 0912",
      email: "london.desk@stackly.com",
      hours: "Mon - Fri: 8:00 AM - 6:00 PM GMT",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.0531816773347!2d-0.0863004!3d51.5140889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48760352ef2df6e5%3A0x24795b6cb21eebe3!2sTower%2042!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk"
    }
  };

  officeCards.forEach(card => {
    card.addEventListener('click', () => {
      officeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const locKey = card.getAttribute('data-location') || 'salem';
      const data = officeData[locKey];
      if (!data) return;

      if (detailsTitle) detailsTitle.textContent = data.title;
      if (detailsAddress) detailsAddress.textContent = data.address;
      if (detailsPhone) {
        detailsPhone.textContent = data.phone;
        detailsPhone.href = `tel:${data.phone.replace(/[^0-9+]/g, '')}`;
      }
      if (detailsEmail) {
        detailsEmail.textContent = data.email;
        detailsEmail.href = `mailto:${data.email}`;
      }
      if (detailsHours) detailsHours.textContent = data.hours;
      if (mapIframe && data.map) mapIframe.src = data.map;
    });
  });
}


function initSlotBooking() {
  const slotButtons = document.querySelectorAll('.slot-btn');
  const selectedSlotInput = document.getElementById('selectedSlotTime');

  slotButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      slotButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (selectedSlotInput) {
        selectedSlotInput.value = btn.getAttribute('data-slot') || btn.textContent.trim();
      }
    });
  });
}


function initActionSuccessModals() {
  const overlay = document.getElementById('actionSuccessOverlay');
  const closeBtn = document.getElementById('closeSuccessOverlayBtn');
  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('is-visible');
    });
  }
}

function showSuccessModal(title, msg) {
  let overlay = document.getElementById('actionSuccessOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'actionSuccessOverlay';
    overlay.className = 'action-success-overlay';
    overlay.innerHTML = `
      <div class="action-success-modal">
        <div class="success-icon-wrap">
          <i class="fas fa-circle-check"></i>
        </div>
        <h3 class="fw-bold text-white mb-2" id="successModalTitle">Success!</h3>
        <p class="text-light-muted mb-4 small" id="successModalMessage">Your request has been securely processed.</p>
        <button type="button" class="btn-lime-solid w-100 justify-content-center py-2" id="closeSuccessOverlayBtn">
          <span>Continue</span> <i class="fas fa-arrow-right ms-2"></i>
        </button>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#closeSuccessOverlayBtn').addEventListener('click', () => {
      overlay.classList.remove('is-visible');
    });
  }

  const tEl = overlay.querySelector('#successModalTitle');
  const mEl = overlay.querySelector('#successModalMessage');
  if (tEl && title) tEl.textContent = title;
  if (mEl && msg) mEl.textContent = msg;

  overlay.classList.add('is-visible');
}
window.showSuccessModal = showSuccessModal;


function init404Stage() {
  const canvas = document.getElementById('bgAnimationCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h;
    let nodes = [];
    let mouse = { x: -1000, y: -1000 };

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      initNodes();
    }

    function initNodes() {
      nodes = [];
      const count = Math.min(Math.floor((w * h) / 14000), 70);
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.3
        });
      }
    }

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    function render() {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;

        if (n1.x < 0 || n1.x > w) n1.vx *= -1;
        if (n1.y < 0 || n1.y > h) n1.vy *= -1;

        
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(191, 247, 71, ${0.2 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }

        
        const mdx = n1.x - mouse.x;
        const mdy = n1.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 160) {
          ctx.strokeStyle = `rgba(191, 247, 71, ${0.45 * (1 - mdist / 160)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        ctx.fillStyle = '#BFF747';
        ctx.globalAlpha = n1.alpha;
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      requestAnimationFrame(render);
    }

    window.addEventListener('resize', resize);
    resize();
    render();
  }

  
  const heroStage = document.getElementById('errorHeroStage');
  const viewport = document.getElementById('errorViewport');

  if (heroStage && viewport && window.matchMedia('(hover: hover)').matches) {
    viewport.addEventListener('mousemove', (e) => {
      const rect = viewport.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (mouseY / (rect.height / 2)) * -6;
      const rotateY = (mouseX / (rect.width / 2)) * 6;

      heroStage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    viewport.addEventListener('mouseleave', () => {
      heroStage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }
}







window.submitInquiryForm = function() {
  const form = document.getElementById('proContactForm');
  if (!form) return;
  
  
  const existingErrors = form.querySelectorAll('.text-danger.error-msg');
  existingErrors.forEach(err => err.remove());
  
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      const errorMsg = document.createElement('small');
      errorMsg.className = 'text-danger error-msg mt-1 d-block';
      errorMsg.textContent = 'This field is required.';
      input.parentNode.appendChild(errorMsg);
      input.style.borderColor = '#ef4444';
    } else {
      input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }
  });
  
  if (isValid) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'Inquiry Sent!',
        text: 'Our corporate team will contact you shortly.',
        icon: 'success',
        background: '#181818',
        color: '#fff',
        confirmButtonColor: '#BFF747'
      }).then(() => {
        window.location.href = 'index.html'; 
      });
    } else {
      alert("Inquiry Sent! Redirecting...");
      window.location.href = 'index.html';
    }
  }
};


document.addEventListener('DOMContentLoaded', () => {
  const navOverlay = document.getElementById('navOverlay');
  if (navOverlay) {
    let isOverlayOpen = false;

    function toggleOverlay(forceState = null) {
      isOverlayOpen = forceState !== null ? forceState : !isOverlayOpen;
      
      const burgerBtns = document.querySelectorAll('#mobileMenuToggle, .stackly-burger-btn');
      burgerBtns.forEach(btn => {
        if (isOverlayOpen) {
          btn.classList.remove('collapsed');
          btn.classList.add('open');
        } else {
          btn.classList.add('collapsed');
          btn.classList.remove('open');
        }
      });

      navOverlay.classList.toggle('open', isOverlayOpen);
      document.body.style.overflow = isOverlayOpen ? 'hidden' : '';
    }

    document.addEventListener('click', (e) => {
      const toggleTrigger = e.target.closest('#mobileMenuToggle, .stackly-burger-btn');
      if (toggleTrigger) {
        e.preventDefault();
        e.stopPropagation();
        toggleOverlay();
        return;
      }

      const closeTrigger = e.target.closest('#overlayCloseBtn, .nav-overlay__close');
      if (closeTrigger) {
        e.preventDefault();
        e.stopPropagation();
        toggleOverlay(false);
        return;
      }

      const linkClick = e.target.closest('.nav-overlay__link, .nav-overlay__brand, .nav-overlay__footer a');
      if (linkClick) {
        toggleOverlay(false);
      }
    });
  }
});





(function() {
  function highlight() {
    let page = window.location.pathname.split('/').pop() || 'index.html';
    page = page.split('?')[0].split('#')[0]; 
    if (page === '') page = 'index.html';

    document.querySelectorAll('.nav-overlay__link').forEach(link => {
      let href = link.getAttribute('href');
      if (href) {
        href = href.split('?')[0].split('#')[0];
        if (href === page) {
          link.classList.add('active');
          
          link.style.color = '#BFF747';
          link.style.transform = 'translateX(4px)';
          link.style.fontWeight = '900';
        }
      }
    });
  }
 
  highlight();
  document.addEventListener('DOMContentLoaded', highlight);
})();

function initStacklySelects() {
  const selects = document.querySelectorAll('.js-stackly-select');
  selects.forEach(select => {
    if(select.nextElementSibling && select.nextElementSibling.classList.contains('stackly-select')) return;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'stackly-select';
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    const trigger = document.createElement('div');
    trigger.className = 'stackly-select__trigger';
    trigger.innerHTML = `<span>${select.options[select.selectedIndex]?.text || 'Select...'}</span><i class="fa-solid fa-chevron-down"></i>`;
    wrapper.appendChild(trigger);

    const menu = document.createElement('div');
    menu.className = 'stackly-select__menu';
    
    Array.from(select.options).forEach((option, index) => {
      if(index === 0 && option.disabled) return;
      const item = document.createElement('div');
      item.className = 'stackly-select__item';
      if(option.selected) item.classList.add('selected');
      item.textContent = option.text;
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        select.value = option.value;
        select.dispatchEvent(new Event('change'));
        trigger.querySelector('span').textContent = option.text;
        wrapper.classList.remove('open');
        menu.querySelectorAll('.stackly-select__item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
      });
      menu.appendChild(item);
    });
    wrapper.appendChild(menu);

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.stackly-select').forEach(s => {
        if(s !== wrapper) s.classList.remove('open');
      });
      wrapper.classList.toggle('open');
      if(wrapper.classList.contains('open')) {
        const rect = wrapper.getBoundingClientRect();
        menu.style.width = `${rect.width}px`;
      }
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.stackly-select').forEach(s => s.classList.remove('open'));
  });
}
document.addEventListener('DOMContentLoaded', initStacklySelects);
