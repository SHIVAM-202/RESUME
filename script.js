document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    const body = document.body;
    
    // Theme toggles
    const themeToggleBtn = document.getElementById('theme-toggle');
    const floatThemeToggleBtn = document.getElementById('float-theme-toggle');
    
    // Print triggers
    const printBtn = document.getElementById('print-btn');
    const floatPrintBtn = document.getElementById('float-print-btn');
    
    // Skill filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-category-card');
    
    // Modal Customizer elements
    const editModal = document.getElementById('edit-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const customizerTrigger = document.getElementById('customizer-trigger');
    const resumeForm = document.getElementById('resume-form');
    
    // Resume data fields (DOM elements to update)
    const resumeName = document.getElementById('resume-name');
    const resumeTitle = document.getElementById('resume-title');
    const resumeEmail = document.getElementById('resume-email');
    const resumeEmailLink = document.getElementById('resume-email-link');
    const resumePhone = document.getElementById('resume-phone');
    const resumePhoneLink = document.getElementById('resume-phone-link');
    const resumeLocation = document.getElementById('resume-location');
    const resumeLinkedin = document.getElementById('resume-linkedin');
    const resumeLinkedinLink = document.getElementById('resume-linkedin-link');
    const resumeGithub = document.getElementById('resume-github');
    const resumeGithubLink = document.getElementById('resume-github-link');
    const resumeSummary = document.getElementById('resume-summary');
    const footerName = document.getElementById('footer-name');
    
    // Form input fields
    const inputName = document.getElementById('input-name');
    const inputTitle = document.getElementById('input-title');
    const inputEmail = document.getElementById('input-email');
    const inputPhone = document.getElementById('input-phone');
    const inputLocation = document.getElementById('input-location');
    const inputSummary = document.getElementById('input-summary');

    // ==========================================================================
    // THEME TOGGLE LOGIC
    // ==========================================================================
    const setTheme = (theme) => {
        if (theme === 'light') {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('resume-theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('resume-theme', 'dark');
        }
    };

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('resume-theme') || 'dark';
    setTheme(savedTheme);

    const toggleTheme = () => {
        if (body.classList.contains('dark-theme')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    };

    themeToggleBtn.addEventListener('click', toggleTheme);
    floatThemeToggleBtn.addEventListener('click', toggleTheme);

    // ==========================================================================
    // PRINT LOGIC
    // ==========================================================================
    const triggerPrint = () => {
        window.print();
    };

    printBtn.addEventListener('click', triggerPrint);
    floatPrintBtn.addEventListener('click', triggerPrint);

    // ==========================================================================
    // SKILLS FILTER LOGIC
    // ==========================================================================
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('fade-out');
                    card.style.display = 'block';
                } else {
                    card.classList.add('fade-out');
                    // Add delay matching transition before hiding to make it smoother
                    setTimeout(() => {
                        if (card.classList.contains('fade-out')) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });

    // ==========================================================================
    // RESUME CUSTOMIZATION LOGIC (LOCAL STORAGE & MODAL)
    // ==========================================================================
    
    // Load resume data from local storage
    const loadResumeData = () => {
        const data = localStorage.getItem('resume-custom-data');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                
                // Update DOM text
                if (parsed.name) {
                    resumeName.textContent = parsed.name;
                    footerName.textContent = parsed.name;
                    inputName.value = parsed.name;
                }
                if (parsed.title) {
                    resumeTitle.textContent = parsed.title;
                    inputTitle.value = parsed.title;
                }
                if (parsed.email) {
                    resumeEmail.textContent = parsed.email;
                    resumeEmailLink.href = `mailto:${parsed.email}`;
                    inputEmail.value = parsed.email;
                }
                if (parsed.phone) {
                    resumePhone.textContent = parsed.phone;
                    resumePhoneLink.href = `tel:${parsed.phone.replace(/[^0-9+]/g, '')}`;
                    inputPhone.value = parsed.phone;
                }
                if (parsed.location) {
                    resumeLocation.textContent = parsed.location;
                    inputLocation.value = parsed.location;
                }
                if (parsed.summary) {
                    resumeSummary.textContent = parsed.summary;
                    inputSummary.value = parsed.summary;
                }
                
                // Adjust document title dynamically
                if (parsed.name && parsed.title) {
                    document.title = `${parsed.name} | ${parsed.title} Resume`;
                }
            } catch (e) {
                console.error("Error parsing local resume data", e);
            }
        }
    };

    // Save resume data to local storage and update DOM
    const saveResumeData = (e) => {
        e.preventDefault();
        
        const resumeData = {
            name: inputName.value.trim(),
            title: inputTitle.value.trim(),
            email: inputEmail.value.trim(),
            phone: inputPhone.value.trim(),
            location: inputLocation.value.trim(),
            summary: inputSummary.value.trim()
        };

        localStorage.setItem('resume-custom-data', JSON.stringify(resumeData));
        loadResumeData();
        closeModal();
    };

    // Modal view helper functions
    const openModal = () => {
        editModal.classList.add('active');
        body.style.overflow = 'hidden'; // Disable background scrolling
    };

    const closeModal = () => {
        editModal.classList.remove('active');
        body.style.overflow = ''; // Enable background scrolling
    };

    // Event listeners for Modal
    if (customizerTrigger) {
        customizerTrigger.addEventListener('click', openModal);
    }
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal on background click
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeModal();
        }
    });

    // Close modal on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && editModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle form submit
    resumeForm.addEventListener('submit', saveResumeData);

    // Initial load
    loadResumeData();
});
