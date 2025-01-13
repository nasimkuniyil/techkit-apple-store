// DOM Elements
const header = {
    mobileToggle: document.querySelector('.header-mobile-toggle'),
    navContent: document.querySelector('.header-nav-content'),
    searchToggle: document.querySelector('.header-search-toggle'),
    searchOverlay: document.querySelector('.header-search-overlay'),
    searchClose: document.querySelector('.header-search-close'),
    searchInput: document.querySelector('.header-search-input')
  };
  
  // Mobile Menu Toggle
  header.mobileToggle?.addEventListener('click', () => {
    header.navContent?.classList.toggle('active');
    
    // Animate hamburger to X
    const spans = header.mobileToggle.getElementsByTagName('span');
    header.mobileToggle.classList.toggle('active');
    
    if (header.mobileToggle.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
  
  // Search Overlay Toggle
  header.searchToggle?.addEventListener('click', () => {
    header.searchOverlay?.classList.add('active');
    header.searchInput?.focus();
    document.body.style.overflow = '';
  });
  
  header.searchClose?.addEventListener('click', () => {
    header.searchOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // Close search on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.searchOverlay?.classList.contains('active')) {
      header.searchOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    const dropdowns = document.querySelectorAll('.header-dropdown');
    dropdowns.forEach(dropdown => {
      // Check if click is outside the dropdown
      if (!dropdown.contains(e.target)) {
        const content = dropdown.querySelector('.header-dropdown-content');
        if (content) {
          content.style.opacity = '0';
          content.style.visibility = 'hidden';
          
          // Reset after transition
          setTimeout(() => {
            if (!dropdown.matches(':hover')) {
              content.removeAttribute('style');
            }
          }, 200);
        }
      }
    });
  });
  
  // Handle mobile dropdown toggles
  const dropdownLinks = document.querySelectorAll('.header-dropdown > .header-nav-link');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Only handle clicks on mobile
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const content = link.nextElementSibling;
        if (content?.classList.contains('header-dropdown-content')) {
          content.style.display = content.style.display === 'none' ? 'block' : 'none';
        }
      }
    });
  });
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    // Clear previous timeout
    clearTimeout(resizeTimer);
    
    // Set new timeout to avoid excessive calculations
    resizeTimer = setTimeout(() => {
      // Reset mobile menu styles on desktop
      if (window.innerWidth > 768) {
        header.navContent?.classList.remove('active');
        header.mobileToggle?.classList.remove('active');
        
        // Reset hamburger animation
        const spans = header.mobileToggle?.getElementsByTagName('span');
        if (spans) {
          Array.from(spans).forEach(span => {
            span.removeAttribute('style');
          });
        }
        
        // Reset dropdown visibility
        document.querySelectorAll('.header-dropdown-content').forEach(content => {
          content.removeAttribute('style');
        });
      }
    }, 250);
  });
  
  // Handle scroll behavior
  let lastScroll = 0;
  const headerMain = document.querySelector('.header-main');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Don't do anything if search or mobile menu is open
    if (header.searchOverlay?.classList.contains('active') || 
        header.navContent?.classList.contains('active')) {
      return;
    }
    
    // Add shadow on scroll
    if (currentScroll > 0) {
      headerMain?.classList.add('header-scrolled');
    } else {
      headerMain?.classList.remove('header-scrolled');
    }
    
    // Hide header on scroll down, show on scroll up
    if (currentScroll > lastScroll && currentScroll > 44) {
      headerMain?.classList.add('header-hidden');
    } else {
      headerMain?.classList.remove('header-hidden');
    }
    
    lastScroll = currentScroll;
  });