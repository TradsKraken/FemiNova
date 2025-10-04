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
    initDynamicCounter();
});

// Loading screen management
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        // Minimum loading time for better UX (2 seconds)
        const minLoadingTime = 2000;
        const startTime = Date.now();

        // Function to hide loading screen
        const hideLoadingScreen = () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

            setTimeout(() => {
                // Add hide animation class
                loadingScreen.classList.add('loading-screen-hide');

                // Remove from DOM after animation completes (1.5 seconds)
                setTimeout(() => {
                    loadingScreen.remove();
                }, 1500);
            }, remainingTime);
        };

        // Start hiding process
        hideLoadingScreen();
    }
});

// Team data - edit this array to update team members
const team = [
    'Nianga, Reinna Flor P.|reinnaflorpepitonianga@gmail.com',
    'Marquiso, Rean Alexa B.|mreanalexa@gmail.com',
    'Abanggan, Eljann R.|eljannabanggan1@gmail.com',
    'Arañez, Jethro T.|Akositroy17@gmail.com',
    'Cagna-an, Aian Rey B.|aianrey577@gmail.com',
    'Mamaran, Chester Ivan B.|navirethsehc@gmail.com',
    'Moniset, Rj Angelo M.|rjangelomoniset1@gmail.com',
    'Pilar, Kent Dave R.|kentdavepilar341@gmail.com',
    'Reloj, Lurense V.|lurensereloj@gmail.com',
    'Resma, Kurt Dave B.|resmakurt63@gmail.com',
    'Wasquin, Christine Mae A.|christine.wasquin@feminova.org'
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

// Mobile menu panel toggle (for the mobile navbar added in index.html)
(function initMobileNavToggle() {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('mobileMenuBtn');
        const panel = document.getElementById('mobileMenuPanel');
        const icon = document.getElementById('mobileMenuIcon');

        if (!btn || !panel || !icon) return;

        function openPanel() {
            // set a max-height large enough to fit items; uses scrollHeight for smoothness
            panel.style.maxHeight = panel.scrollHeight + 'px';
            panel.classList.add('open');
            // replace hamburger with X icon
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
            btn.setAttribute('aria-expanded', 'true');
        }

        function closePanel() {
            panel.style.maxHeight = '0';
            panel.classList.remove('open');
            // restore hamburger icon
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
            btn.setAttribute('aria-expanded', 'false');
        }

        function toggle() {
            if (panel.classList.contains('open')) closePanel(); else openPanel();
        }

        // Make closePanel globally available for onclick handlers
        window.closeMobileMenu = closePanel;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle();
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!panel.classList.contains('open')) return;
            const withinPanel = panel.contains(e.target) || btn.contains(e.target);
            if (!withinPanel) closePanel();
        });

        // Close panel when resizing to md and above
        window.addEventListener('resize', () => {
            try {
                if (window.innerWidth >= 768) {
                    closePanel();
                }
            } catch (e) {}
        });
    });
})();

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

    const desktopNav = document.querySelector('.navbar-elegant');
    const mobileNav = document.querySelector('.mobile-nav');

    let lastScrollY = window.scrollY;
    let isVisible = true;

    // Set initial state for desktop nav
    if (desktopNav) {
        desktopNav.classList.add('navbar-visible');
        desktopNav.classList.add('navbar-initial');
    }

    // Set initial state for mobile nav
    if (mobileNav) {
        mobileNav.classList.add('mobile-nav-visible');
    }

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        const scrollThreshold = 50;

        // Handle desktop navbar (only on larger screens)
        if (desktopNav && window.innerWidth >= 768) {
            // Handle navbar visibility (hide/show on scroll)
            if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
                // Scrolling down - hide navbar
                if (isVisible) {
                    desktopNav.classList.add('navbar-hidden');
                    desktopNav.classList.remove('navbar-visible');
                    isVisible = false;
                }
            } else {
                // Scrolling up or at top - show navbar
                if (!isVisible) {
                    desktopNav.classList.add('navbar-visible');
                    desktopNav.classList.remove('navbar-hidden');
                    isVisible = true;
                }
            }

            // Handle background opacity change
            if (currentScrollY > scrollThreshold) {
                desktopNav.classList.remove('navbar-initial');
                desktopNav.classList.add('navbar-scrolled');
            } else {
                desktopNav.classList.remove('navbar-scrolled');
                desktopNav.classList.add('navbar-initial');
            }
        }

        // Handle mobile navbar (only on small screens)
        if (mobileNav && window.innerWidth < 768) {
            if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
                // Scrolling down - hide navbar
                if (isVisible) {
                    mobileNav.classList.add('mobile-nav-hidden');
                    mobileNav.classList.remove('mobile-nav-visible');
                    isVisible = false;
                }
            } else {
                // Scrolling up or at top - show navbar
                if (!isVisible) {
                    mobileNav.classList.add('mobile-nav-visible');
                    mobileNav.classList.remove('mobile-nav-hidden');
                    isVisible = true;
                }
            }
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

    // Handle window resize to switch between desktop and mobile behavior
    window.addEventListener('resize', function() {
        // Reset visibility state on resize
        isVisible = true;
        if (desktopNav) {
            desktopNav.classList.remove('navbar-hidden', 'navbar-scrolled');
            desktopNav.classList.add('navbar-visible', 'navbar-initial');
        }
        if (mobileNav) {
            mobileNav.classList.remove('mobile-nav-hidden');
            mobileNav.classList.add('mobile-nav-visible');
        }
        updateNavbar(); // Update immediately on resize
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
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const menuItems = document.querySelectorAll('.mobile-menu-item');

    // Toggle hamburger icon animation
    hamburgerIcon.classList.toggle('active');

    // Toggle mobile menu animation
    mobileMenu.classList.toggle('active');

    // Handle menu items stagger animation
    if (mobileMenu.classList.contains('active')) {
        // Menu is opening - add active class to items with delay
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('active');
            }, index * 50);
        });
    } else {
        // Menu is closing - remove active class immediately
        menuItems.forEach(item => {
            item.classList.remove('active');
        });
    }
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
    showDonationModal();
}

function handleVolunteer() {
    showVolunteerModal();
}

// Modal functions
function showDonationModal() {
    const modal = document.getElementById('donationModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function showVolunteerModal() {
    const modal = document.getElementById('volunteerModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function showHelpConfirmationModal() {
    const modal = document.getElementById('helpConfirmationModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modals = document.querySelectorAll('[id$="Modal"]');
    modals.forEach(modal => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });
    document.body.style.overflow = 'auto';
}

// Donation form handlers
function selectAmount(amount) {
    document.getElementById('customAmount').value = amount;
    // Remove selected class from all buttons
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.classList.remove('border-pink-600', 'bg-pink-50');
        btn.classList.add('border-pink-200');
    });
    // Add selected class to clicked button
    event.target.classList.remove('border-pink-200');
    event.target.classList.add('border-pink-600', 'bg-pink-50');
}

function handleDonationSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('donorName').value;
    const email = document.getElementById('donorEmail').value;
    const phone = document.getElementById('donorPhone').value;
    const amount = document.getElementById('customAmount').value;
    const anonymous = document.getElementById('anonymous').checked;

    if (!amount || amount <= 0) {
        alert('Please enter a valid donation amount.');
        return;
    }

    // Demo success message
    const displayName = anonymous ? 'Anonymous Donor' : name;
    alert(`Thank you ${displayName} for your generous donation of ₱${amount}! We will send a confirmation email to ${email} shortly.`);

    closeModal();
    event.target.reset();
}

// Volunteer form handler
function handleVolunteerSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('volunteerName').value;
    const email = document.getElementById('volunteerEmail').value;
    const phone = document.getElementById('volunteerPhone').value;
    const availability = document.getElementById('availability').value;
    const message = document.getElementById('volunteerMessage').value;

    const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value);

    if (interests.length === 0) {
        alert('Please select at least one area of interest.');
        return;
    }

    // Demo success message
    alert(`Thank you ${name} for your interest in volunteering! We will review your application and contact you at ${email} within 3-5 business days.`);

    closeModal();
    event.target.reset();
}

// Help/Emergency form handler
function handleHelpSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('helpName').value;
    const phone = document.getElementById('helpPhone').value;
    const address = document.getElementById('helpAddress').value;
    const situation = document.getElementById('helpSituation').value;

    // Validate required fields
    if (!name.trim() || !phone.trim() || !address.trim() || !situation.trim()) {
        alert('Please fill in all required fields. Your safety is our priority.');
        return;
    }

    // Emergency contact information
    const emergencyMessage = `
EMERGENCY ASSISTANCE REQUEST
Name: ${name}
Phone: ${phone}
Address: ${address}
Situation: ${situation}

This is an urgent request for help. Please respond immediately.
Time: ${new Date().toLocaleString()}
    `.trim();

    // In a real implementation, this would send to emergency services
    // For demo purposes, show confirmation modal
    console.log('Emergency Alert:', emergencyMessage); // Log for debugging

    // Reset form and show confirmation modal
    event.target.reset();
    showHelpConfirmationModal();
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

// Dynamic Counter for Women Impacted
function initDynamicCounter() {
    const counterElement = document.querySelector('[data-counter="women-impacted"]');
    if (!counterElement) return;

    // Date-based counter initialization
    // Reference launch date (fixed) - Set to past date so counter shows meaningful numbers
    const launchDate = new Date('2025-09-01T00:00:00'); // September 1, 2025 (past date)
    
    // Calculate value purely from launch date with fixed subtraction for thousands display
    function calculateBaseValue() {
        const now = new Date();
        const secondsSinceLaunch = Math.max(0, (now - launchDate) / 1000);
        // Fixed subtraction to bring into thousands range
        const adjustedValue = Math.floor(secondsSinceLaunch) - 2000000; // Fixed subtraction of 2M
        return Math.max(0, adjustedValue); // Ensure never negative
    }

    let currentImpacted = calculateBaseValue();

    // State for expanded view
    let isExpanded = false;

    // Format number with K/M abbreviations or full numbers
    function formatNumber(num, forceExpanded = false) {
        if (isExpanded || forceExpanded) {
            return num.toLocaleString(); // Full number with commas
        }
        
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M'; // 1.2M
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K'; // 1.2K
        }
        return num.toString();
    }

    // Enhanced scrolling animation with more visible effects
    function animateCounter(from, to, duration = 1200) {
        const start = Date.now();
        const fromNum = typeof from === 'number' ? from : parseFloat(from.replace(/[K+,]/g, '')) * (from.includes('K+') ? 1000 : 1);
        const toNum = typeof to === 'number' ? to : parseFloat(to.replace(/[K+,]/g, '')) * (to.includes('K+') ? 1000 : 1);
        const parent = counterElement.closest('.bg-white\\/10');

        // Add updating class for visual effects
        parent.classList.add('counter-enhanced', 'updating');

        // Create digit-by-digit animation effect with enhanced visibility
        function createDigitAnimation(targetText) {
            const digits = targetText.split('');
            let animatedText = '';

            digits.forEach((digit, index) => {
                if (!isNaN(digit) || digit === ',') {
                    animatedText += `<span class="counter-digit">${digit}</span>`;
                } else {
                    animatedText += digit;
                }
            });

            return animatedText;
        }

        function update() {
            const now = Date.now();
            const progress = Math.min((now - start) / duration, 1);

            // Enhanced easing function for more noticeable motion
            const easeOutBack = 1 - Math.pow(1 - progress, 3) * (1 - Math.sin(progress * Math.PI * 2) * 0.1);
            const currentNum = Math.floor(fromNum + (toNum - fromNum) * easeOutBack);
            const displayText = formatNumber(currentNum);

            // Add motion blur effect during animation
            if (progress < 1) {
                // Create scrolling effect with individual digit animations
                counterElement.innerHTML = createDigitAnimation(displayText);

                // Trigger digit animations with more visible delays and longer duration
                const digitElements = counterElement.querySelectorAll('.counter-digit');
                digitElements.forEach((digit, index) => {
                    setTimeout(() => {
                        digit.classList.add('scrolling');
                        // Remove class after animation with longer duration
                        setTimeout(() => digit.classList.remove('scrolling'), 1200);
                    }, index * 120);
                });

                requestAnimationFrame(update);
            } else {
                // Final state - clean text without spans
                counterElement.textContent = displayText;
                parent.classList.remove('updating');
            }
        }

        requestAnimationFrame(update);
    }

    // Handle click to expand/collapse between abbreviated and full format
    function handleCounterClick() {
        const parent = counterElement.closest('.bg-white\\/10');
        const currentValue = currentImpacted;

        isExpanded = !isExpanded;

        // Add enhanced click animation feedback
        parent.classList.add('click-animate');
        setTimeout(() => {
            parent.classList.remove('click-animate');
        }, 600);

        // Animate between abbreviated and full format
        if (isExpanded) {
            // Expanding: show full number
            animateCounter(formatNumber(currentValue, false), currentValue, 800);
            parent.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
        } else {
            // Collapsing: show abbreviated format
            animateCounter(currentValue, formatNumber(currentValue, false), 800);
            parent.style.backgroundColor = '';
        }
    }

    // Set initial value
    counterElement.textContent = formatNumber(currentImpacted);

    // Add click listener
    counterElement.addEventListener('click', handleCounterClick);
    counterElement.style.cursor = 'pointer';
    counterElement.title = 'Click to toggle between abbreviated and full numbers';

    // Update counter at random intervals (4-9 seconds) with 3 per second growth
    function scheduleNextUpdate() {
        // Random interval between 4-9 seconds
        const randomDelay = 4000 + Math.random() * 5000;

        setTimeout(() => {
            const oldValue = currentImpacted;
            // Growth of 3 per second, multiplied by actual seconds elapsed
            const secondsElapsed = randomDelay / 1000;
            const growthAmount = Math.floor(3 * secondsElapsed);
            currentImpacted += growthAmount;

            animateCounter(oldValue, currentImpacted, 1200);
            scheduleNextUpdate(); // Schedule next update
        }, randomDelay);
    }

    // Start the random updates
    scheduleNextUpdate();
}
