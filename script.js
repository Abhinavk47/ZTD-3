document.addEventListener('DOMContentLoaded', () => {
    // Collect DOM Elements
    const themeToggleBtn = document.getElementById('theme-toggle');
    const bodyElement = document.body;
    const backToTopBtn = document.getElementById('backToTop');

    // ==========================================
    // 1. DYNAMIC THEME CONTROLLER SYSTEM
    // ==========================================
    if (localStorage.getItem('theme') === 'dark') {
        bodyElement.classList.add('dark-mode');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
    } else {
        if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            bodyElement.classList.toggle('dark-mode');
            
            if (bodyElement.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.textContent = '☀️';
            } else {
                localStorage.setItem('theme', 'light');
                themeToggleBtn.textContent = '🌙';
            }
        });
    }

    // ==========================================
    // 2. BACK TO TOP SCROLL POSITION MONITORS
    // ==========================================
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'auto';
                backToTopBtn.style.transform = 'translateY(0)';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';
                backToTopBtn.style.transform = 'translateY(10px)';
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 3. SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-element');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Keeps item static once opened
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================
    // 4. DYNAMIC API-DRIVEN GALLERY LOADING ENGINE
    // ==========================================
    const projectGallery = document.getElementById('project-gallery');
    const projectCountSpan = document.getElementById('project-count');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let allProjectsData = []; // Global cache storage array for fetched data records

    // Maps programming languages to custom emojis
    function getIcon(lang) {
        if (!lang) return '🚀';
        const icons = {
            'python': '🐍',
            'javascript': '📱',
            'html': '💻',
            'css': '🎨'
        };
        return icons[lang.toLowerCase()] || '🚀';
    }

    // Completely updates and renders layout elements based on active filter selections
    function renderGallery(filterValue) {
        if (!projectGallery) return;
        
        // Clear out any old existing cards inside the grid wrapper frame
        projectGallery.innerHTML = ""; 
        let visibleCount = 0;

        allProjectsData.forEach((project, index) => {
            // Check if user selected 'all' or matches the exact category code tag
            if (filterValue === 'all' || project.category === filterValue) {
                visibleCount++;
                
                // Construct a fresh, responsive CLICKABLE link card wrapper container
                const card = document.createElement('a');
                card.className = `feature-card glass active`;
                
                // Safely extract the valid link structure from JSON schema fallback strings
                const finalUrl = project.url || project.html_url || "#";
                card.setAttribute('href', finalUrl);
                card.setAttribute('target', '_blank');
                card.setAttribute('data-category', project.category || 'web');
                
                // Card-level link styling layout rules
                card.style.transitionDelay = `${index * 0.1}s`; 
                card.style.textDecoration = 'none';
                card.style.color = 'inherit';
                card.style.display = 'block';

                // Render interior visual tags alongside the dynamic mock button design element
                card.innerHTML = `
                    <div class="icon">${getIcon(project.language)}</div>
                    <h3 style="margin: 10px 0;">${project.title || project.name}</h3>
                    <p style="margin-bottom: 15px;">${project.description || 'No description available.'}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                        <span style="font-size: 0.8rem; opacity: 0.75; font-weight: 700; color: var(--primary);">
                            ● ${project.language || 'Mixed'}
                        </span>
                        <span class="project-btn" style="font-size: 0.85rem; font-weight: 600; padding: 6px 14px; border-radius: 4px; background: var(--primary); color: #fff; transition: background 0.2s;">
                            View Project →
                        </span>
                    </div>
                `;
                
                projectGallery.appendChild(card);
            }
        });

        // Live math update strings matching exact requirements specification checklist
        if (projectCountSpan) {
            projectCountSpan.textContent = visibleCount;
        }
    }

    // Fetch dynamic JSON data payload from repository records
    fetch('projects.json')
        .then(response => response.json())
        .then(data => {
            allProjectsData = data;
            renderGallery('all'); // Initialize layout engine display setup
        })
        .catch(err => console.error("Error initializing project data records registry payload fetch:", err));

    // Handle filter button selections smoothly
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(button => button.classList.remove('active'));
            e.target.classList.add('active');
            renderGallery(e.target.getAttribute('data-filter'));
        });
    });

    // --- Skill Bars Reveal Animation ---
    const revealOnScroll = () => {
        const skillsElements = document.querySelectorAll('.reveal-element');
        skillsElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 50) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
                element.style.transition = "all 0.6s ease-out";
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('DOMContentLoaded', revealOnScroll);
});