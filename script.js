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
    // 4. STEP-2: DYNAMIC API-DRIVEN GALLERY LOADING ENGINE
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
                
                // Construct a fresh, responsive card component container
                const card = document.createElement('article');
                card.className = `feature-card glass reveal-element active`;
                card.setAttribute('data-category', project.category);
                
                // Add staggered animation delays visually calculated down the list layout
                card.style.transitionDelay = `${index * 0.1}s`; 

                card.innerHTML = `
                    <div class="icon">${getIcon(project.language)}</div>
                    <h3>
                        <a href="${project.url}" target="_blank" style="text-decoration: none; color: inherit; transition: color 0.2s;">
                            ${project.title}
                        </a>
                    </h3>
                    <p>${project.description}</p>
                    <span style="font-size: 0.8rem; display: inline-block; margin-top: 15px; opacity: 0.75; font-weight: 700; color: var(--primary);">
                        ● ${project.language}
                    </span>
                `;
                
                projectGallery.appendChild(card);
            }
        });

        // Live math update strings matching exact requirements specification checklist
        if (projectCountSpan) {
            projectCountSpan.textContent = visibleCount;
        }