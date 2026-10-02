/**
 * FutureTech — Interactive JavaScript
 * Navigation, Form Validation, Smooth Scrolling, and UI Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollSpy();
  initContactForm();
  initCardInteractions();
});

/* --------------------------------------------------------------------------
   1. Navbar Scroll Effect
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger initial state
}

/* --------------------------------------------------------------------------
   2. Mobile Hamburger Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta-mobile a');

  if (!hamburgerBtn || !navMenu) return;

  const toggleMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !navMenu.classList.contains('open');
    hamburgerBtn.classList.toggle('open', shouldOpen);
    navMenu.classList.toggle('open', shouldOpen);
    hamburgerBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close menu on click outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   3. ScrollSpy & Active Link Management
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href').replace('#', '');
          if (href === currentId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   4. Contact Form JavaScript Validation & Submission
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const messageInput = document.getElementById('userMessage');
  const charCounter = document.getElementById('charCounter');
  const submitBtn = document.getElementById('submitBtn');
  const feedbackToast = document.getElementById('formFeedback');

  const nameGroup = document.getElementById('nameGroup');
  const emailGroup = document.getElementById('emailGroup');
  const messageGroup = document.getElementById('messageGroup');

  // Email regex RFC 5322 standard
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Live Character Counter for Message
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 500`;
      if (len > 500) {
        charCounter.style.color = 'var(--accent-danger)';
      } else {
        charCounter.style.color = 'var(--text-muted)';
      }
    });
  }

  // Field validation helpers
  function validateName() {
    const val = nameInput.value.trim();
    if (val.length < 2) {
      nameGroup.classList.add('has-error');
      nameGroup.classList.remove('has-success');
      return false;
    } else {
      nameGroup.classList.remove('has-error');
      nameGroup.classList.add('has-success');
      return true;
    }
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    if (!emailPattern.test(val)) {
      emailGroup.classList.add('has-error');
      emailGroup.classList.remove('has-success');
      return false;
    } else {
      emailGroup.classList.remove('has-error');
      emailGroup.classList.add('has-success');
      return true;
    }
  }

  function validateMessage() {
    const val = messageInput.value.trim();
    if (val.length < 10 || val.length > 500) {
      messageGroup.classList.add('has-error');
      messageGroup.classList.remove('has-success');
      return false;
    } else {
      messageGroup.classList.remove('has-error');
      messageGroup.classList.add('has-success');
      return true;
    }
  }

  // Instant real-time feedback on blur/input
  nameInput.addEventListener('blur', validateName);
  nameInput.addEventListener('input', () => {
    if (nameGroup.classList.contains('has-error')) validateName();
  });

  emailInput.addEventListener('blur', validateEmail);
  emailInput.addEventListener('input', () => {
    if (emailGroup.classList.contains('has-error')) validateEmail();
  });

  messageInput.addEventListener('blur', validateMessage);
  messageInput.addEventListener('input', () => {
    if (messageGroup.classList.contains('has-error')) validateMessage();
  });

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous feedback
    hideFeedback();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      showFeedback('Please correct the highlighted fields before sending.', 'error');

      // Auto-focus the first invalid field
      if (!isNameValid) nameInput.focus();
      else if (!isEmailValid) emailInput.focus();
      else if (!isMessageValid) messageInput.focus();
      return;
    }

    // Submit Simulation (Loading State)
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      // Simulate Successful Submission
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;

      const userName = nameInput.value.trim();
      showFeedback(`Thank you, ${userName}! Your message was successfully received. Our engineering team will respond within 24 hours.`, 'success');

      // Reset form
      form.reset();
      nameGroup.classList.remove('has-success', 'has-error');
      emailGroup.classList.remove('has-success', 'has-error');
      messageGroup.classList.remove('has-success', 'has-error');
      if (charCounter) charCounter.textContent = '0 / 500';

      // Auto dismiss success toast after 6 seconds
      setTimeout(() => {
        hideFeedback();
      }, 6000);
    }, 1200);
  });

  function showFeedback(message, type) {
    feedbackToast.textContent = message;
    feedbackToast.className = 'form-toast-feedback';
    if (type === 'success') {
      feedbackToast.classList.add('show-success');
    } else {
      feedbackToast.classList.add('show-error');
    }
  }

  function hideFeedback() {
    feedbackToast.className = 'form-toast-feedback';
    feedbackToast.textContent = '';
  }
}

/* --------------------------------------------------------------------------
   5. Interactive Subtle Hover and Card Effects
   -------------------------------------------------------------------------- */
function initCardInteractions() {
  const cards = document.querySelectorAll('.feature-card');

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease';
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}
