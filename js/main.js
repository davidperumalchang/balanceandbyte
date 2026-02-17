/**
 * B&B Partners - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Navbar Scroll Effect
    // ============================================
    const navbar = document.querySelector('.navbar');
    
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Check on load
    
    // ============================================
    // Smooth Scroll for Navigation Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
                
                // Scroll to target
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // Active Navigation Link on Scroll
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    
    // ============================================
    // Intersection Observer for Animations
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe about cards
    document.querySelectorAll('.about-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });
    
    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });
    
    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // ============================================
    // Parallax Effect for Hero Elements
    // ============================================
    const heroSection = document.querySelector('.hero-section');
    const circles = document.querySelectorAll('.circle');
    
    if (heroSection && circles.length > 0) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            const heroHeight = heroSection.offsetHeight;
            
            if (scrolled < heroHeight) {
                circles.forEach((circle, index) => {
                    const speed = (index + 1) * 0.05;
                    circle.style.transform = `translateY(${scrolled * speed}px) scale(${1 + scrolled * 0.0005})`;
                });
            }
        });
    }
    
    // ============================================
    // Service Card Hover Effects
    // ============================================
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
        
        // Make entire card clickable - but not if clicking the button
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking the pricing button
            if (e.target.closest('.btn-pricing')) {
                return;
            }
            const link = this.querySelector('.service-link:not(.btn-pricing)');
            if (link) {
                link.click();
            }
        });
    });
    
    // ============================================
    // Pricing Modals - Fix navbar and scroll issues
    // ============================================
    let scrollPositionBeforeModal = 0;
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('show.bs.modal', function() {
            scrollPositionBeforeModal = window.scrollY;
        });
        
        modal.addEventListener('hidden.bs.modal', function() {
            setTimeout(() => {
                window.scrollTo({
                    top: scrollPositionBeforeModal,
                    behavior: 'instant'
                });
            }, 0);
        });
    });
    
    // Handle "Discuss" buttons in any pricing modal
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-plan-cta')) {
            e.preventDefault();
            const button = e.target.closest('.btn-plan-cta');
            const plan = button.getAttribute('data-plan');
            const service = button.getAttribute('data-service') || 'Web Development';
            
            // Find and close the open modal
            const openModal = button.closest('.modal');
            if (openModal) {
                const modalInstance = bootstrap.Modal.getInstance(openModal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
            
            // Wait for modal to close, then scroll to contact
            setTimeout(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    const offsetTop = contactSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Pre-fill the service field
                    const serviceSelect = document.getElementById('service');
                    if (serviceSelect) {
                        serviceSelect.value = service;
                    }
                    
                    // Add plan info to message
                    const messageField = document.getElementById('message');
                    if (messageField && !messageField.value) {
                        messageField.value = `I'm interested in the ${plan} plan. `;
                        setTimeout(() => {
                            messageField.focus();
                            messageField.setSelectionRange(messageField.value.length, messageField.value.length);
                        }, 800);
                    }
                }
            }, 350);
        }
    });
    
    // ============================================
    // Pricing Accordion Toggle
    // ============================================
    document.querySelectorAll('[data-toggle-section]').forEach(header => {
        header.addEventListener('click', function() {
            const body = this.nextElementSibling;
            const isOpen = body.classList.contains('open');
            
            if (isOpen) {
                body.classList.remove('open');
                this.classList.add('collapsed');
            } else {
                body.classList.add('open');
                this.classList.remove('collapsed');
            }
        });
    });
    
});

