// ============================================
// INITIALIZATION & DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadAdminContent();
    initializeApp();
});

// ============================================
// LOAD ADMIN CONTENT
// ============================================

function loadAdminContent() {
    try {
        // Load hero content
        const content = JSON.parse(localStorage.getItem('portfolioContent'));
        if (content) {
            if (content.hero) {
                const heroTitle = document.querySelector('.hero-title');
                const heroSubtitle = document.querySelector('.typing-text');
                const heroDescription = document.querySelector('.hero-description');
                const profileImg = document.querySelector('.profile-img');

                if (heroTitle && content.hero.title) {
                    heroTitle.innerHTML = content.hero.title.replace(/Creative Space/, '<span class="gradient-text">Creative Space</span>');
                }
                if (heroSubtitle && content.hero.subtitle) {
                    heroSubtitle.textContent = content.hero.subtitle;
                }
                if (heroDescription && content.hero.description) {
                    heroDescription.textContent = content.hero.description;
                }
                if (profileImg && content.hero.image) {
                    profileImg.src = content.hero.image;
                }
            }

            if (content.about) {
                const aboutName = document.querySelector('.about-text h3');
                const aboutBio = document.querySelector('.about-text p');
                const imageBadge = document.querySelector('.image-badge');
                const aboutImg = document.querySelector('.image-wrapper img');

                if (aboutName && content.about.name) {
                    aboutName.textContent = 'Hi, I\'m ' + content.about.name;
                }
                if (aboutBio && content.about.bio) {
                    const paragraphs = document.querySelectorAll('.about-text p');
                    if (paragraphs.length > 0) paragraphs[0].textContent = content.about.bio;
                }
                if (imageBadge && content.about.badge) {
                    imageBadge.textContent = content.about.badge;
                }
                if (aboutImg && content.about.image) {
                    aboutImg.src = content.about.image;
                }
            }

            if (content.contact) {
                // Update contact links
                document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
                    if (content.contact.email) {
                        link.href = 'mailto:' + content.contact.email;
                        link.textContent = content.contact.email;
                    }
                });

                document.querySelectorAll('a[href^="tel:"]').forEach(link => {
                    if (content.contact.phone) {
                        link.href = 'tel:' + content.contact.phone;
                        link.textContent = content.contact.phone;
                    }
                });

                // Update location
                const locationCard = document.querySelector('.info-card');
                if (locationCard && content.contact.location) {
                    const p = locationCard.querySelector('p');
                    if (p) p.textContent = content.contact.location;
                }
            }

            if (content.social) {
                const socialLinks = document.querySelectorAll('.social-icon');
                if (socialLinks.length >= 4) {
                    if (content.social.twitter) socialLinks[0].href = content.social.twitter;
                    if (content.social.linkedin) socialLinks[1].href = content.social.linkedin;
                    if (content.social.github) socialLinks[2].href = content.social.github;
                    if (content.social.instagram) socialLinks[3].href = content.social.instagram;
                }
            }
        }

        // Load projects
        const projects = JSON.parse(localStorage.getItem('portfolioProjects'));
        if (projects && projects.length > 0) {
            updateProjectsDisplay(projects);
        }

        // Load skills
        const skills = JSON.parse(localStorage.getItem('portfolioSkills'));
        if (skills && skills.length > 0) {
            updateSkillsDisplay(skills);
        }

        // Load services
        const services = JSON.parse(localStorage.getItem('portfolioServices'));
        if (services && services.length > 0) {
            updateServicesDisplay(services);
        }

        // Load testimonials
        const testimonials = JSON.parse(localStorage.getItem('portfolioTestimonials'));
        if (testimonials && testimonials.length > 0) {
            updateTestimonialsDisplay(testimonials);
        }

        // Load experience
        const experience = JSON.parse(localStorage.getItem('portfolioExperience'));
        if (experience && experience.length > 0) {
            updateExperienceDisplay(experience);
        }
    } catch (e) {
        console.log('No admin content found, using defaults');
    }
}

function updateProjectsDisplay(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    // Clear existing projects beyond the first 6 placeholders
    const existingCards = projectsGrid.querySelectorAll('.project-card');
    
    existingCards.forEach((card, index) => {
        if (index < projects.length && projects[index]) {
            const project = projects[index];
            const img = card.querySelector('.project-image img');
            const title = card.querySelector('.project-content h3');
            const desc = card.querySelector('.project-content p');
            const techBadges = card.querySelector('.project-tech');

            if (img) img.src = project.image || img.src;
            if (title) title.textContent = project.name;
            if (desc) desc.textContent = project.description;
            
            if (techBadges) {
                techBadges.innerHTML = project.tech.map(t => 
                    `<span class="tech-badge">${t}</span>`
                ).join('');
            }

            const overlay = card.querySelector('.project-overlay');
            if (overlay) {
                overlay.innerHTML = '';
                if (project.liveUrl) {
                    overlay.innerHTML += `<a href="${project.liveUrl}" class="btn-icon" aria-label="Live Demo"><i class="fas fa-external-link-alt"></i></a>`;
                }
                if (project.githubUrl) {
                    overlay.innerHTML += `<a href="${project.githubUrl}" class="btn-icon" aria-label="Source Code"><i class="fas fa-code"></i></a>`;
                }
            }
        }
    });
}

function updateSkillsDisplay(skills) {
    const skillsGrid = document.querySelector('.skills-grid');
    if (!skillsGrid) return;

    // Group skills by category
    const categories = {};
    skills.forEach(skill => {
        if (!categories[skill.category]) {
            categories[skill.category] = [];
        }
        categories[skill.category].push(skill);
    });

    // Update existing categories
    let categoryIndex = 0;
    document.querySelectorAll('.skill-category').forEach((categoryEl, index) => {
        const categoryKeys = Object.keys(categories);
        if (index < categoryKeys.length) {
            const category = categoryKeys[index];
            const categorySkills = categories[category];

            categoryEl.querySelector('h3').textContent = category;

            const skillsContainer = categoryEl.querySelector('.skill-items');
            skillsContainer.innerHTML = categorySkills.map(skill => `
                <div class="skill-item">
                    <div class="skill-header">
                        <span>${skill.name}</span>
                        <span class="skill-level">${skill.level}%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: ${skill.level}%"></div>
                    </div>
                </div>
            `).join('');
        }
    });
}

function updateServicesDisplay(services) {
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;

    const serviceCards = servicesGrid.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        if (index < services.length && services[index]) {
            const service = services[index];
            
            const icon = card.querySelector('.service-icon');
            const title = card.querySelector('h3');
            const desc = card.querySelector('p:not(.service-features *)');
            const features = card.querySelector('.service-features');

            if (icon) icon.innerHTML = `<i class="${service.icon}"></i>`;
            if (title) title.textContent = service.name;
            if (desc) desc.textContent = service.description;
            
            if (features) {
                features.innerHTML = service.features.map(feature => 
                    `<li><i class="fas fa-check"></i> ${feature}</li>`
                ).join('');
            }
        }
    });
}

function updateTestimonialsDisplay(testimonials) {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;

    const cards = slider.querySelectorAll('.testimonial-card');
    cards.forEach((card, index) => {
        if (index < testimonials.length && testimonials[index]) {
            const testimonial = testimonials[index];

            const stars = card.querySelector('.star-rating');
            const text = card.querySelector('.testimonial-text');
            const authorImg = card.querySelector('.author-avatar');
            const authorName = card.querySelector('.testimonial-author h4');
            const authorTitle = card.querySelector('.testimonial-author p');

            if (stars && testimonial.rating) {
                stars.innerHTML = Array(parseInt(testimonial.rating)).fill('<i class="fas fa-star"></i>').join('');
            }
            if (text) text.textContent = testimonial.text;
            if (authorImg) authorImg.src = testimonial.avatar;
            if (authorName) authorName.textContent = testimonial.name;
            if (authorTitle) authorTitle.textContent = testimonial.title;
        }
    });
}

function updateExperienceDisplay(experience) {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const timelineItems = timeline.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        if (index < experience.length && experience[index]) {
            const entry = experience[index];

            const icon = item.querySelector('.timeline-marker i');
            const title = item.querySelector('.timeline-content h3');
            const company = item.querySelector('.timeline-company');
            const period = item.querySelector('.timeline-period');
            const description = item.querySelector('.timeline-content p:not(.timeline-company):not(.timeline-period)');

            if (icon) {
                icon.className = entry.type === 'work' ? 'fas fa-briefcase' : 'fas fa-graduation-cap';
            }
            if (title) title.textContent = entry.title;
            if (company) company.textContent = entry.company;
            if (period) period.textContent = entry.period;
            if (description) description.textContent = entry.description;
        }
    });
}

function initializeApp() {
    // Initialize features
    initCustomCursor();
    initNavigation();
    initScrollProgress();
    initSmoothScroll();
    initAOS();
    initTypingEffect();
    initCounters();
    initThemeToggle();
    initFormValidation();
    initProjectFilter();
    initTestimonialSlider();
    initBackToTop();
    initScrollTriggers();
    initHamburgerMenu();
    
    // Remove loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.animation = 'fadeOut 0.6s ease-in-out forwards';
        }
    }, 1500);
}

// ============================================
// CUSTOM CURSOR
// ============================================

function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');
    
    if (!cursor || !cursorFollower) return;
    
    document.body.classList.add('cursor-active');
    
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Main cursor
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    // Animate follower with delay
    function animate() {
        followerX += (mouseX - followerX) * 0.2;
        followerY += (mouseY - followerY) * 0.2;
        
        cursorFollower.style.left = followerX - 15 + 'px';
        cursorFollower.style.top = followerY - 15 + 'px';
        
        requestAnimationFrame(animate);
    }
    animate();
    
    // Hide cursor on leave
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';
    });
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.getElementById('navbar');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            
            // Get target section
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[data-section]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('data-section');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });
}

// ============================================
// HAMBURGER MENU
// ============================================

function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ============================================
// SCROLL PROGRESS
// ============================================

function initScrollProgress() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ============================================
// AOS INITIALIZATION
// ============================================

function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out-quart',
            once: false,
            mirror: false,
            offset: 100
        });
    }
}

// ============================================
// TYPING EFFECT
// ============================================

function initTypingEffect() {
    const typingElement = document.getElementById('typingEffect');
    if (!typingElement || typeof Typed === 'undefined') return;
    
    new Typed(typingElement, {
        strings: [
            'I\'m a Full-Stack Developer',
            'I\'m a Creative Designer',
            'I\'m a Problem Solver',
            'I\'m a Digital Innovator'
        ],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
        cursorChar: '|',
        showCursor: true
    });
}

// ============================================
// ANIMATED COUNTERS
// ============================================

function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ============================================
// THEME TOGGLE (DARK MODE)
// ============================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Check saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

// ============================================
// FORM VALIDATION
// ============================================

function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate form
        let isValid = true;
        const fields = form.querySelectorAll('[required]');
        
        fields.forEach(field => {
            const error = field.nextElementSibling;
            
            if (!field.value.trim()) {
                isValid = false;
                error.textContent = 'This field is required';
                error.classList.add('show');
            } else if (field.type === 'email' && !isValidEmail(field.value)) {
                isValid = false;
                error.textContent = 'Please enter a valid email';
                error.classList.add('show');
            } else {
                error.textContent = '';
                error.classList.remove('show');
            }
        });
        
        if (isValid) {
            // Show success message
            showNotification('Message sent successfully!', 'success');
            form.reset();
            
            // Here you would normally send the form data to a server
            console.log('Form submitted:', {
                name: form.name.value,
                email: form.email.value,
                phone: form.phone.value,
                subject: form.subject.value,
                message: form.message.value
            });
        }
    });
    
    // Real-time validation
    form.querySelectorAll('[required]').forEach(field => {
        field.addEventListener('blur', () => {
            const error = field.nextElementSibling;
            
            if (!field.value.trim()) {
                error.textContent = 'This field is required';
                error.classList.add('show');
            } else if (field.type === 'email' && !isValidEmail(field.value)) {
                error.textContent = 'Please enter a valid email';
                error.classList.add('show');
            } else {
                error.textContent = '';
                error.classList.remove('show');
            }
        });
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideInLeft 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============================================
// PROJECT FILTER
// ============================================

function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            const filter = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ============================================
// TESTIMONIALS SLIDER
// ============================================

function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    if (testimonials.length === 0) return;
    
    let currentSlide = 0;
    let autoplayTimer;
    
    function showSlide(n) {
        testimonials.forEach(slide => {
            slide.classList.add('hidden');
            slide.style.opacity = '0';
        });
        
        testimonials[n].classList.remove('hidden');
        testimonials[n].style.opacity = '1';
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
        resetAutoplay();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
        showSlide(currentSlide);
        resetAutoplay();
    }
    
    function resetAutoplay() {
        clearInterval(autoplayTimer);
        startAutoplay();
    }
    
    function startAutoplay() {
        autoplayTimer = setInterval(() => {
            nextSlide();
        }, 5000);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    showSlide(0);
    startAutoplay();
}

// ============================================
// BACK TO TOP BUTTON
// ============================================

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// SCROLL TRIGGERS (GSAP)
// ============================================

function initScrollTriggers() {
    if (typeof gsap === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate project cards on scroll
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 20%',
                scrub: false,
                onEnter: () => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }
            },
            opacity: 0,
            y: 50,
            duration: 0.6,
            delay: index * 0.1
        });
    });
    
    // Animate skill bars
    gsap.utils.toArray('.skill-progress').forEach((bar) => {
        gsap.from(bar, {
            scrollTrigger: {
                trigger: bar,
                start: 'top 80%',
                end: 'top 20%',
                onEnter: () => {
                    bar.style.width = bar.parentElement.parentElement.querySelector('.skill-level').textContent;
                }
            },
            width: '0%',
            duration: 1.5,
            ease: 'power2.out'
        });
    });
    
    // Parallax effect on hero
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        gsap.to(heroImage, {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom center',
                scrub: 1
            },
            y: 100,
            opacity: 0.5
        });
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Get scroll percentage
function getScrollPercentage() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return (scrollTop / docHeight) * 100;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', (e) => {
    // Skip to main content
    if (e.ctrlKey && e.key === '.') {
        const mainContent = document.querySelector('main') || document.querySelector('section');
        if (mainContent) {
            mainContent.focus();
        }
    }
    
    // Close menu with Escape
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    }
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Lazy load images
document.addEventListener('DOMContentLoaded', () => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }
});

// ============================================
// PWA SUPPORT
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service Worker registration would go here
        // navigator.serviceWorker.register('/sw.js');
    });
}

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

// Announce scroll position to screen readers
window.addEventListener('scroll', throttle(() => {
    const scrollPercentage = Math.round(getScrollPercentage());
    document.body.setAttribute('aria-label', `Page scrolled ${scrollPercentage}% down`);
}, 1000));

// Enhance focus management
document.querySelectorAll('button, a, input').forEach(element => {
    element.addEventListener('focus', (e) => {
        e.target.style.outline = '2px solid var(--primary)';
        e.target.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', (e) => {
        e.target.style.outline = 'none';
    });
});

// ============================================
// EXTRA FEATURES
// ============================================

// Floating animation for skill cards
gsap.utils.toArray('.skill-category').forEach((card, index) => {
    gsap.to(card, {
        y: -10,
        duration: 2 + index * 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
});

// Add glow effect on hover
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            boxShadow: '0 15px 40px rgba(102, 126, 234, 0.8)',
            duration: 0.3
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            duration: 0.3
        });
    });
});

// ============================================
// SMOOTH PAGE TRANSITIONS
// ============================================

// Handle page unload
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0.9';
});

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log(
    '%cWelcome to My Premium Portfolio! 🚀',
    'font-size: 20px; font-weight: bold; color: #667eea;'
);
console.log(
    '%cDesigned & Built with ❤️ using HTML, CSS & JavaScript',
    'font-size: 14px; color: #764ba2;'
);

// ============================================
// EXPORT FOR MODULE USAGE (IF NEEDED)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        initCustomCursor,
        initNavigation,
        initThemeToggle,
        initFormValidation,
        isValidEmail,
        showNotification
    };
}
