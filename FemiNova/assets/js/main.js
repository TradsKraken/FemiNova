// FemiNova Website JavaScript
// Handles affirmation fetching, team rendering, search, accordions, and UI interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality when DOM is ready
    loadAffirmation();
    renderTeam();
    initAccordion();
    initSmoothScrolling();
    initScrollAnimations();
    initNavbarAnimation();
});

// Team data - edit this array to update team members
const team = [
    'Kent Dave R. Pilar|kent.pilar@feminova.org',
    'Chesterr Ivan Mamaran|chester.mamaran@feminova.org',
    'Reinna Nianga|reinna.nianga@feminova.org',
    'Lurense Reloj|lurense.reloj@feminova.org',
    'Jethro Arañez|jethro.aranez@feminova.org',
    'Kurt Dave Resma|kurt.resma@feminova.org',
    'AR Cagna-an|ar.cagnaan@feminova.org',
    'Christine Wasquin|christine.wasquin@feminova.org',
    'Eljhann Abanggan|eljhann.abanggan@feminova.org',
    'Rin Marquiso|rin.marquiso@feminova.org',
    'RJ Angelo Moniset|rj.moniset@feminova.org'
];

// Affirmation of the Day functionality
async function loadAffirmation() {
    const affirmationElement = document.getElementById('affirmationText');
    
    try {
        const response = await fetch('https://www.affirmations.dev/');
        const data = await response.json();
        
        if (data && data.affirmation) {
            affirmationElement.textContent = `"${data.affirmation}"`;
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        // Fallback affirmations when API is unavailable
        const fallbackAffirmations = [
            "You are capable of amazing things.",
            "Your voice matters and deserves to be heard.",
            "You have the strength to overcome any challenge.",
            "You are worthy of love, respect, and success.",
            "Your dreams are valid and achievable.",
            "You are making a positive difference in the world.",
            "You have the power to create the change you want to see.",
            "You are resilient, brave, and unstoppable."
        ];
        
        const randomAffirmation = fallbackAffirmations[Math.floor(Math.random() * fallbackAffirmations.length)];
        affirmationElement.textContent = `"${randomAffirmation}"`;
    }
}

// Team rendering functionality
function renderTeam() {
    const teamContainer = document.getElementById('teamContainer');
    if (!teamContainer) return;
    
    teamContainer.innerHTML = team.map(member => {
        const [name, email] = member.split('|');
        const initials = name.split(' ').map(part => part[0]).join('').substring(0, 2);
        
        return `
            <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow reveal">
                <div class="text-center">
                    <div class="w-20 h-20 bg-pink-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                        ${initials}
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">${name}</h3>
                    <a href="mailto:${email}" class="text-pink-600 hover:text-pink-800 transition-colors text-sm">
                        ${email}
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

// Scroll reveal using IntersectionObserver
function initScrollAnimations() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // debug: log visibility changes
            try { console.debug('scroll-reveal:', entry.target, 'isIntersecting=', entry.isIntersecting); } catch (e) {}
            if (entry.isIntersecting) {
                const target = entry.target;

                // If the element is a stagger container, reveal its children with delays
                if (target.classList && target.classList.contains('reveal-stagger')) {
                    const children = Array.from(target.children || []);
                    children.forEach((child, i) => {
                        setTimeout(() => child.classList.add('revealed'), i * 80);
                    });
                } else {
                    target.classList.add('revealed');
                }

                // Unobserve default elements to avoid repeated work
                try { observer.unobserve(target); } catch (e) {}
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.06
    });

    // Delay observing a tick to allow layout to stabilize (helps when content is injected)
    setTimeout(() => {
        const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-stagger');
        els.forEach(el => {
            // If reveal-stagger, observe the container; observer will stagger children
            observer.observe(el);
            try { console.debug('scroll-reveal: observing', el); } catch (e) {}
        });
    }, 50);
}

// Navbar scroll animation
function initNavbarAnimation() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const nav = document.querySelector('nav');
    if (!nav) return;

    let lastScrollY = window.scrollY;
    let isVisible = true;

    // Set initial state
    nav.classList.add('navbar-visible');
    nav.classList.add('navbar-initial');

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        const scrollThreshold = 50;

        // Handle navbar visibility (hide/show on scroll)
        if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
            // Scrolling down - hide navbar
            if (isVisible) {
                nav.classList.remove('navbar-visible');
                isVisible = false;
            }
        } else {
            // Scrolling up or at top - show navbar
            if (!isVisible) {
                nav.classList.add('navbar-visible');
                isVisible = true;
            }
        }

        // Handle background opacity change
        if (currentScrollY > scrollThreshold) {
            nav.classList.remove('navbar-initial');
            nav.classList.add('navbar-scrolled');
        } else {
            nav.classList.remove('navbar-scrolled');
            nav.classList.add('navbar-initial');
        }

        lastScrollY = currentScrollY;
    }

    // Throttle scroll events for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateNavbar();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call
    updateNavbar();
}

// Search functionality
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
        alert('Please enter a search term');
        return;
    }
    
    // Simple keyword-based routing
    if (query.includes('campaign') || query.includes('karahasan') || query.includes('kwentong') || query.includes('testimonyal')) {
        window.location.href = 'campaigns.html';
    } else if (query.includes('team') || query.includes('member') || query.includes('staff')) {
        window.location.href = 'index.html#team';
    } else if (query.includes('about') || query.includes('mission') || query.includes('vision')) {
        window.location.href = 'index.html#about';
    } else if (query.includes('contact') || query.includes('email') || query.includes('phone')) {
        window.location.href = 'index.html#contact';
    } else {
        alert(`Searching for: "${query}"\n\nTry searching for: campaigns, team, about, or contact`);
    }
    
    searchInput.value = '';
}

// Allow search on Enter key
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.id === 'searchInput') {
        performSearch();
    }
});

// Accordion functionality for campaigns page
function initAccordion() {
    // Set up accordion animations
    const campaignContents = document.querySelectorAll('.campaign-content');
    campaignContents.forEach(content => {
        content.style.maxHeight = '0';
        content.style.overflow = 'hidden';
    });
}

function toggleCampaign(campaignId) {
    const content = document.getElementById(campaignId);
    const icon = document.getElementById(`${campaignId}-icon`);
    
    if (!content || !icon) return;
    
    const isExpanded = content.style.maxHeight !== '0px' && content.style.maxHeight !== '';
    
    if (isExpanded) {
        // Collapse
        content.style.maxHeight = '0';
        icon.style.transform = 'rotate(0deg)';
    } else {
        // Expand
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
    }
}

// Modal functionality
function showLogin() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('loginModal').classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function showSignup() {
    document.getElementById('signupModal').classList.remove('hidden');
    document.getElementById('signupModal').classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('loginModal').classList.remove('flex');
    document.getElementById('signupModal').classList.add('hidden');
    document.getElementById('signupModal').classList.remove('flex');
    document.body.style.overflow = 'auto';
}

function showSignupFromLogin() {
    closeModal();
    setTimeout(showSignup, 100);
}

function showLoginFromSignup() {
    closeModal();
    setTimeout(showLogin, 100);
}

// Mobile menu functionality
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
}

// Form handlers (demo functionality)
function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Demo handler - in production, this would send to a backend
    alert(`Thank you, ${name}! Your message has been received. We'll get back to you at ${email} soon.`);
    
    // Reset form
    event.target.reset();
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    
    // Demo handler - in production, this would authenticate with backend
    alert(`Login successful! Welcome back, ${email}`);
    closeModal();
    event.target.reset();
}

function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    
    // Demo handler - in production, this would create account via backend
    alert(`Welcome to FemiNova, ${name}! Your account has been created with email: ${email}`);
    closeModal();
    event.target.reset();
}

function handleDonation() {
    // Demo handler
    alert('Thank you for your interest in donating! This will redirect to our secure donation portal.');
}

function handleVolunteer() {
    // Demo handler
    alert('Thank you for your interest in volunteering! We will contact you with opportunities.');
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (e.target === loginModal || e.target === signupModal) {
        closeModal();
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});
