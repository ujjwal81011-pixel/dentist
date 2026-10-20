/**
 * Modern Dentist Website - Interactive Engine
 * Handles Mobile Drawer, Interactive Before/After Slider,
 * Multi-Step Booking Wizard, Cost Estimator, FAQ Accordion, and Filters.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initBeforeAfterSlider();
  initServicesFilter();
  initBookingWizard();
  initCostEstimator();
  initFaqAccordion();
  initContactForm();
});

/* ==========================================================================
   Header Scroll Effect
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const closeBtn = document.getElementById('closeMobileNav');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburgerBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    hamburgerBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   Before & After Interactive Comparison Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const rangeInput = document.getElementById('baRange');
  const afterLayer = document.getElementById('baAfterLayer');
  const sliderHandle = document.getElementById('baHandle');
  const tabBtns = document.querySelectorAll('.gallery-tab-btn');
  const titleElem = document.getElementById('baCaseTitle');
  const descElem = document.getElementById('baCaseDesc');

  if (!rangeInput || !afterLayer || !sliderHandle) return;

  function updateSlider(val) {
    afterLayer.style.width = `${val}%`;
    sliderHandle.style.left = `${val}%`;
  }

  rangeInput.addEventListener('input', (e) => {
    updateSlider(e.target.value);
  });

  // Support Cases
  const casesData = {
    whitening: {
      title: 'Professional In-Office Teeth Whitening',
      desc: 'Achieved 7 shades brighter in a single 60-minute pain-free session supervised by Dr. [Lead Dentist Name].',
      beforeFilter: 'sepia(40%) contrast(90%) brightness(88%)',
      afterFilter: 'brightness(108%) contrast(102%)'
    },
    veneers: {
      title: 'Handcrafted Porcelain Veneers',
      desc: 'Corrected chipped enamel, minor gaps, and discoloration with 6 custom ultra-thin porcelain veneers.',
      beforeFilter: 'contrast(85%) brightness(92%) blur(0.5px)',
      afterFilter: 'brightness(105%) contrast(105%)'
    },
    aligners: {
      title: 'Clear Aligners Orthodontic Alignment',
      desc: 'Gentle crowding correction completed in 8 months without metal brackets or discomfort.',
      beforeFilter: 'hue-rotate(-15deg) contrast(90%)',
      afterFilter: 'brightness(104%) contrast(102%)'
    }
  };

  const beforeImg = document.getElementById('baBeforeImg');
  const afterImg = document.getElementById('baAfterImg');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const caseKey = btn.getAttribute('data-case');
      const data = casesData[caseKey];

      if (data) {
        if (titleElem) titleElem.textContent = data.title;
        if (descElem) descElem.textContent = data.desc;
        if (beforeImg) beforeImg.style.filter = data.beforeFilter;
        if (afterImg) afterImg.style.filter = data.afterFilter;
        rangeInput.value = 50;
        updateSlider(50);
      }
    });
  });
}

/* ==========================================================================
   Services Filter
   ========================================================================== */
function initServicesFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (!filterBtns.length || !serviceCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 300ms ease';
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   Appointment Wizard Modal
   ========================================================================== */
let bookingState = {
  service: 'General Checkup & Clean',
  doctor: 'Dr. [Lead Dentist Name], DDS',
  date: '',
  time: '10:00 AM',
  patientName: '',
  phone: '',
  email: '',
  notes: ''
};

function initBookingWizard() {
  const modalBackdrop = document.getElementById('bookingModal');
  const openBtns = document.querySelectorAll('.open-booking-modal');
  const closeBtns = document.querySelectorAll('.close-booking-modal');
  const nextBtn = document.getElementById('wizardNextBtn');
  const prevBtn = document.getElementById('wizardPrevBtn');
  const steps = document.querySelectorAll('.wizard-step');
  const nodeSteps = document.querySelectorAll('.wizard-step-node');

  let currentStep = 1;

  if (!modalBackdrop) return;

  function openModal(preselectedService = null) {
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (preselectedService) {
      bookingState.service = preselectedService;
      highlightSelectedOption('[data-group="service"]', preselectedService);
    }
    setStep(1);
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const srv = btn.getAttribute('data-service');
      openModal(srv);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

  // Option selection logic
  function setupSelectionGroup(groupAttr, stateKey) {
    const items = document.querySelectorAll(`[data-group="${groupAttr}"]`);
    items.forEach(item => {
      item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        bookingState[stateKey] = item.getAttribute('data-value');
      });
    });
  }

  setupSelectionGroup('service', 'service');
  setupSelectionGroup('doctor', 'doctor');
  setupSelectionGroup('time', 'time');

  function highlightSelectedOption(selector, value) {
    const items = document.querySelectorAll(selector);
    items.forEach(item => {
      if (item.getAttribute('data-value') === value) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
  }

  // Set default appointment date to tomorrow
  const dateInput = document.getElementById('appointmentDateInput');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
    bookingState.date = dateInput.value;

    dateInput.addEventListener('change', (e) => {
      bookingState.date = e.target.value;
    });
  }

  function setStep(stepNum) {
    currentStep = stepNum;

    steps.forEach((step, idx) => {
      if (idx + 1 === stepNum) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    nodeSteps.forEach((node, idx) => {
      if (idx + 1 === stepNum) {
        node.classList.add('active');
        node.classList.remove('completed');
      } else if (idx + 1 < stepNum) {
        node.classList.remove('active');
        node.classList.add('completed');
      } else {
        node.classList.remove('active');
        node.classList.remove('completed');
      }
    });

    // Button states
    if (prevBtn) {
      prevBtn.style.display = currentStep > 1 && currentStep < 4 ? 'inline-flex' : 'none';
    }

    if (nextBtn) {
      if (currentStep === 3) {
        nextBtn.textContent = 'Confirm Appointment';
      } else if (currentStep === 4) {
        nextBtn.textContent = 'Done & Close';
      } else {
        nextBtn.textContent = 'Continue';
      }
    }

    // Populate confirmation step
    if (currentStep === 4) {
      renderConfirmationSummary();
    }
  }

  function renderConfirmationSummary() {
    const summaryService = document.getElementById('summaryService');
    const summaryDoctor = document.getElementById('summaryDoctor');
    const summaryDateTime = document.getElementById('summaryDateTime');
    const summaryPatient = document.getElementById('summaryPatient');

    if (summaryService) summaryService.textContent = bookingState.service;
    if (summaryDoctor) summaryDoctor.textContent = bookingState.doctor;
    if (summaryDateTime) summaryDateTime.textContent = `${bookingState.date || 'Tomorrow'} at ${bookingState.time}`;
    if (summaryPatient) summaryPatient.textContent = `${bookingState.patientName || '[Patient Full Name]'} (${bookingState.phone || '[Phone]'})`;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep === 1) {
        setStep(2);
      } else if (currentStep === 2) {
        setStep(3);
      } else if (currentStep === 3) {
        // Collect form data
        const nameInput = document.getElementById('wizardPatientName');
        const phoneInput = document.getElementById('wizardPatientPhone');
        const emailInput = document.getElementById('wizardPatientEmail');

        if (!nameInput.value.trim()) {
          nameInput.focus();
          nameInput.style.borderColor = '#e11d48';
          return;
        } else {
          nameInput.style.borderColor = '';
        }

        if (!phoneInput.value.trim()) {
          phoneInput.focus();
          phoneInput.style.borderColor = '#e11d48';
          return;
        } else {
          phoneInput.style.borderColor = '';
        }

        bookingState.patientName = nameInput.value.trim();
        bookingState.phone = phoneInput.value.trim();
        bookingState.email = emailInput ? emailInput.value.trim() : '';
        setStep(4);
      } else if (currentStep === 4) {
        closeModal();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        setStep(currentStep - 1);
      }
    });
  }

  // Quick form on Hero / Consult strip connects to wizard
  const quickConsultForm = document.getElementById('quickConsultForm');
  if (quickConsultForm) {
    quickConsultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const srvSelect = document.getElementById('quickServiceSelect');
      const dateSelect = document.getElementById('quickDateSelect');
      if (srvSelect) bookingState.service = srvSelect.value;
      if (dateSelect) bookingState.date = dateSelect.value;
      openModal();
      setStep(2);
    });
  }
}

/* ==========================================================================
   Cost & Insurance Estimator
   ========================================================================== */
function initCostEstimator() {
  const treatmentSelect = document.getElementById('calcTreatment');
  const insuranceSelect = document.getElementById('calcInsurance');
  const resultElem = document.getElementById('calcEstimatedTotal');
  const monthlyElem = document.getElementById('calcMonthlyTotal');

  if (!treatmentSelect || !insuranceSelect || !resultElem) return;

  const treatmentBasePrices = {
    cleaning: 180,
    whitening: 350,
    filling: 220,
    implant: 2400,
    aligners: 3600,
    crown: 980
  };

  const coverageMultipliers = {
    none: 1.0,
    inhouse: 0.75, // 25% discount
    standard50: 0.50, // 50% insurance coverage
    premier80: 0.20   // 80% insurance coverage
  };

  function updateEstimate() {
    const base = treatmentBasePrices[treatmentSelect.value] || 200;
    const mult = coverageMultipliers[insuranceSelect.value] || 1.0;
    const finalCost = Math.round(base * mult);
    const monthlyCost = Math.round(finalCost / 12);

    resultElem.textContent = `$${finalCost.toLocaleString()}`;
    if (monthlyElem) {
      monthlyElem.textContent = `Or as low as $${monthlyCost}/month with 0% APR financing`;
    }
  }

  treatmentSelect.addEventListener('change', updateEstimate);
  insuranceSelect.addEventListener('change', updateEstimate);
  updateEstimate();
}

/* ==========================================================================
   FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other items
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq-question-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   Contact Form Handler
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactClinicForm');
  const successBox = document.getElementById('contactSuccessNotice');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = 'Sending Request...';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.innerHTML = originalText;
      if (successBox) {
        successBox.style.display = 'block';
        setTimeout(() => {
          successBox.style.display = 'none';
        }, 6000);
      }
    }, 800);
  });
}
