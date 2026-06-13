// ============================================
// ADMIN PANEL JAVASCRIPT
// ============================================

// Default admin credentials (stored as hash in production)
const DEFAULT_CREDENTIALS = {
    username: 'admin',
    password: 'password123' // In production, use bcrypt or similar
};

let currentUser = null;
let editingProjectId = null;
let editingSkillId = null;
let editingServiceId = null;
let editingTestimonialId = null;
let editingExperienceId = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    initializeEventListeners();
    updateStorageInfo();
    loadActivityLog();
    loadStatistics();
});

function checkAuthStatus() {
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth) {
        try {
            currentUser = JSON.parse(savedAuth);
            showDashboard();
        } catch (e) {
            showLoginScreen();
        }
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    updateUserInfo();
}

// ============================================
// LOGIN FUNCTIONALITY
// ============================================

function initializeEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            switchPage(page);
        });
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Skill level slider
    const skillLevelInput = document.getElementById('skillLevel');
    if (skillLevelInput) {
        skillLevelInput.addEventListener('input', (e) => {
            document.getElementById('skillLevelValue').textContent = e.target.value + '%';
        });
    }

    // View Website button
    document.getElementById('viewWebsite')?.addEventListener('click', () => {
        window.open('index.html', '_blank');
    });

    // Save All button
    document.getElementById('saveAll')?.addEventListener('click', saveAllData);

    // Menu toggle
    document.getElementById('menuToggle')?.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });

    document.getElementById('sidebarToggle')?.addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('active');
    });

    // Image upload previews
    setupImageUploadPreview('profileImage', 'profileImagePreview');
    setupImageUploadPreview('aboutImage', 'aboutImagePreview');
    setupImageUploadPreview('projectImage', 'projectImagePreview');
    setupImageUploadPreview('testimonialAvatar', 'testimonialAvatarPreview');
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (username === DEFAULT_CREDENTIALS.username && password === DEFAULT_CREDENTIALS.password) {
        currentUser = {
            username: username,
            loginTime: new Date().toISOString()
        };

        if (rememberMe) {
            localStorage.setItem('adminAuth', JSON.stringify(currentUser));
        }

        document.getElementById('loginForm').reset();
        showDashboard();
        showNotification('Login successful!', 'success');
        logActivity('User logged in');
    } else {
        showNotification('Invalid credentials!', 'error');
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminAuth');
        currentUser = null;
        showLoginScreen();
        showNotification('Logged out successfully!', 'info');
    }
}

function updateUserInfo() {
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.username;
    }
}

// ============================================
// PAGE NAVIGATION
// ============================================

function switchPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageName) {
            item.classList.add('active');
        }
    });

    // Show selected page
    const pageElement = document.getElementById(pageName + 'Page');
    if (pageElement) {
        pageElement.classList.add('active');
        document.getElementById('pageTitle').textContent = 
            pageName.charAt(0).toUpperCase() + pageName.slice(1);

        // Load data for specific pages
        if (pageName === 'projects') loadProjectsList();
        if (pageName === 'skills') loadSkillsList();
        if (pageName === 'services') loadServicesList();
        if (pageName === 'testimonials') loadTestimonialsList();
        if (pageName === 'experience') loadExperienceList();
        if (pageName === 'content') loadContentData();
    }

    // Close sidebar on mobile
    document.querySelector('.sidebar').classList.remove('active');
}

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });

    // Show selected tab
    const tabElement = document.getElementById(tabName + 'Tab');
    if (tabElement) {
        tabElement.classList.add('active');
    }
}

// ============================================
// CONTENT EDITING
// ============================================

function loadContentData() {
    const content = getContentData();

    document.getElementById('heroTitle').value = content.hero.title || '';
    document.getElementById('heroSubtitle').value = content.hero.subtitle || '';
    document.getElementById('heroDescription').value = content.hero.description || '';

    document.getElementById('aboutName').value = content.about.name || '';
    document.getElementById('aboutBio').value = content.about.bio || '';
    document.getElementById('aboutBadge').value = content.about.badge || '';

    document.getElementById('contactEmail').value = content.contact.email || '';
    document.getElementById('contactPhone').value = content.contact.phone || '';
    document.getElementById('contactLocation').value = content.contact.location || '';
    document.getElementById('socialTwitter').value = content.social.twitter || '';
    document.getElementById('socialLinkedin').value = content.social.linkedin || '';
    document.getElementById('socialGithub').value = content.social.github || '';
    document.getElementById('socialInstagram').value = content.social.instagram || '';

    // Load images
    if (content.hero.image) {
        document.querySelector('#profileImagePreview img').src = content.hero.image;
    }
    if (content.about.image) {
        document.querySelector('#aboutImagePreview img').src = content.about.image;
    }
}

function saveHeroContent() {
    const content = getContentData();
    content.hero = {
        title: document.getElementById('heroTitle').value,
        subtitle: document.getElementById('heroSubtitle').value,
        description: document.getElementById('heroDescription').value,
        image: document.querySelector('#profileImagePreview img').src
    };

    localStorage.setItem('portfolioContent', JSON.stringify(content));
    showNotification('Hero content saved!', 'success');
    logActivity('Hero section updated');
    updateMainWebsite();
}

function saveAboutContent() {
    const content = getContentData();
    content.about = {
        name: document.getElementById('aboutName').value,
        bio: document.getElementById('aboutBio').value,
        badge: document.getElementById('aboutBadge').value,
        image: document.querySelector('#aboutImagePreview img').src
    };

    localStorage.setItem('portfolioContent', JSON.stringify(content));
    showNotification('About content saved!', 'success');
    logActivity('About section updated');
    updateMainWebsite();
}

function saveContactContent() {
    const content = getContentData();
    content.contact = {
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        location: document.getElementById('contactLocation').value
    };

    content.social = {
        twitter: document.getElementById('socialTwitter').value,
        linkedin: document.getElementById('socialLinkedin').value,
        github: document.getElementById('socialGithub').value,
        instagram: document.getElementById('socialInstagram').value
    };

    localStorage.setItem('portfolioContent', JSON.stringify(content));
    showNotification('Contact info saved!', 'success');
    logActivity('Contact information updated');
    updateMainWebsite();
}

// ============================================
// PROJECTS MANAGEMENT
// ============================================

function showAddProjectForm() {
    editingProjectId = null;
    document.getElementById('projectFormTitle').textContent = 'Add New Project';
    document.getElementById('projectForm').reset();
    document.getElementById('projectFormContainer').style.display = 'block';
    document.getElementById('projectImagePreview').innerHTML = '';
    scrollToElement('projectFormContainer');
}

function cancelProjectForm() {
    document.getElementById('projectFormContainer').style.display = 'none';
    document.getElementById('projectForm').reset();
    editingProjectId = null;
}

function saveProject() {
    const projects = getProjects();
    const newProject = {
        id: editingProjectId || Date.now(),
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value,
        category: document.getElementById('projectCategory').value,
        tech: document.getElementById('projectTech').value.split(',').map(t => t.trim()),
        image: document.querySelector('#projectImagePreview img')?.src || '',
        liveUrl: document.getElementById('projectLiveUrl').value,
        githubUrl: document.getElementById('projectGithubUrl').value
    };

    if (editingProjectId) {
        const index = projects.findIndex(p => p.id === editingProjectId);
        if (index !== -1) {
            projects[index] = newProject;
        }
    } else {
        projects.push(newProject);
    }

    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
    cancelProjectForm();
    loadProjectsList();
    showNotification('Project saved!', 'success');
    logActivity('Project ' + (editingProjectId ? 'updated' : 'added'));
    updateStatistics();
    updateMainWebsite();
}

function loadProjectsList() {
    const projects = getProjects();
    const list = document.getElementById('projectsList');
    list.innerHTML = '';

    if (projects.length === 0) {
        list.innerHTML = '<p class="empty-state">No projects yet. Add your first project!</p>';
        return;
    }

    projects.forEach(project => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-content">
                ${project.image ? `<img src="${project.image}" alt="${project.name}" class="list-item-image">` : '<div class="list-item-image"></div>'}
                <div class="list-item-info">
                    <h4>${project.name}</h4>
                    <p>${project.description}</p>
                    <p><strong>Category:</strong> ${project.category}</p>
                </div>
            </div>
            <div class="list-item-actions">
                <button class="btn-edit" onclick="editProject(${project.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteProject(${project.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(item);
    });
}

function editProject(id) {
    const projects = getProjects();
    const project = projects.find(p => p.id === id);
    
    if (project) {
        editingProjectId = id;
        document.getElementById('projectFormTitle').textContent = 'Edit Project';
        document.getElementById('projectName').value = project.name;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectCategory').value = project.category;
        document.getElementById('projectTech').value = project.tech.join(', ');
        document.getElementById('projectLiveUrl').value = project.liveUrl;
        document.getElementById('projectGithubUrl').value = project.githubUrl;
        
        if (project.image) {
            document.getElementById('projectImagePreview').innerHTML = `<img src="${project.image}" alt="${project.name}">`;
        }
        
        document.getElementById('projectFormContainer').style.display = 'block';
        scrollToElement('projectFormContainer');
    }
}

function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        const projects = getProjects().filter(p => p.id !== id);
        localStorage.setItem('portfolioProjects', JSON.stringify(projects));
        loadProjectsList();
        showNotification('Project deleted!', 'success');
        logActivity('Project deleted');
        updateStatistics();
        updateMainWebsite();
    }
}

// ============================================
// SKILLS MANAGEMENT
// ============================================

function showAddSkillForm() {
    editingSkillId = null;
    document.getElementById('skillFormTitle').textContent = 'Add New Skill';
    document.getElementById('skillForm').reset();
    document.getElementById('skillLevel').value = 80;
    document.getElementById('skillLevelValue').textContent = '80%';
    document.getElementById('skillFormContainer').style.display = 'block';
    scrollToElement('skillFormContainer');
}

function cancelSkillForm() {
    document.getElementById('skillFormContainer').style.display = 'none';
    document.getElementById('skillForm').reset();
    editingSkillId = null;
}

function saveSkill() {
    const skills = getSkills();
    const newSkill = {
        id: editingSkillId || Date.now(),
        category: document.getElementById('skillCategory').value,
        name: document.getElementById('skillName').value,
        level: document.getElementById('skillLevel').value
    };

    if (editingSkillId) {
        const index = skills.findIndex(s => s.id === editingSkillId);
        if (index !== -1) {
            skills[index] = newSkill;
        }
    } else {
        skills.push(newSkill);
    }

    localStorage.setItem('portfolioSkills', JSON.stringify(skills));
    cancelSkillForm();
    loadSkillsList();
    showNotification('Skill saved!', 'success');
    logActivity('Skill ' + (editingSkillId ? 'updated' : 'added'));
    updateStatistics();
    updateMainWebsite();
}

function loadSkillsList() {
    const skills = getSkills();
    const list = document.getElementById('skillsList');
    list.innerHTML = '';

    if (skills.length === 0) {
        list.innerHTML = '<p class="empty-state">No skills yet. Add your first skill!</p>';
        return;
    }

    skills.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-content">
                <div class="list-item-info" style="width: 100%;">
                    <h4>${skill.name}</h4>
                    <p><strong>Category:</strong> ${skill.category}</p>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                        <div style="flex: 1; height: 8px; background: #e0e0e0; border-radius: 4px;">
                            <div style="width: ${skill.level}%; height: 100%; background: #667eea; border-radius: 4px;"></div>
                        </div>
                        <span style="min-width: 50px; font-weight: 600;">${skill.level}%</span>
                    </div>
                </div>
            </div>
            <div class="list-item-actions">
                <button class="btn-edit" onclick="editSkill(${skill.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteSkill(${skill.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(item);
    });
}

function editSkill(id) {
    const skills = getSkills();
    const skill = skills.find(s => s.id === id);
    
    if (skill) {
        editingSkillId = id;
        document.getElementById('skillFormTitle').textContent = 'Edit Skill';
        document.getElementById('skillCategory').value = skill.category;
        document.getElementById('skillName').value = skill.name;
        document.getElementById('skillLevel').value = skill.level;
        document.getElementById('skillLevelValue').textContent = skill.level + '%';
        document.getElementById('skillFormContainer').style.display = 'block';
        scrollToElement('skillFormContainer');
    }
}

function deleteSkill(id) {
    if (confirm('Are you sure you want to delete this skill?')) {
        const skills = getSkills().filter(s => s.id !== id);
        localStorage.setItem('portfolioSkills', JSON.stringify(skills));
        loadSkillsList();
        showNotification('Skill deleted!', 'success');
        logActivity('Skill deleted');
        updateStatistics();
        updateMainWebsite();
    }
}

// ============================================
// SERVICES MANAGEMENT
// ============================================

function showAddServiceForm() {
    editingServiceId = null;
    document.getElementById('serviceFormTitle').textContent = 'Add New Service';
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceFormContainer').style.display = 'block';
    scrollToElement('serviceFormContainer');
}

function cancelServiceForm() {
    document.getElementById('serviceFormContainer').style.display = 'none';
    document.getElementById('serviceForm').reset();
    editingServiceId = null;
}

function saveService() {
    const services = getServices();
    const features = document.getElementById('serviceFeatures').value
        .split('\n')
        .map(f => f.trim())
        .filter(f => f);

    const newService = {
        id: editingServiceId || Date.now(),
        name: document.getElementById('serviceName').value,
        description: document.getElementById('serviceDescription').value,
        icon: document.getElementById('serviceIcon').value,
        features: features
    };

    if (editingServiceId) {
        const index = services.findIndex(s => s.id === editingServiceId);
        if (index !== -1) {
            services[index] = newService;
        }
    } else {
        services.push(newService);
    }

    localStorage.setItem('portfolioServices', JSON.stringify(services));
    cancelServiceForm();
    loadServicesList();
    showNotification('Service saved!', 'success');
    logActivity('Service ' + (editingServiceId ? 'updated' : 'added'));
    updateStatistics();
    updateMainWebsite();
}

function loadServicesList() {
    const services = getServices();
    const list = document.getElementById('servicesList');
    list.innerHTML = '';

    if (services.length === 0) {
        list.innerHTML = '<p class="empty-state">No services yet. Add your first service!</p>';
        return;
    }

    services.forEach(service => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-content">
                <div style="font-size: 2rem; color: #667eea;">
                    <i class="${service.icon}"></i>
                </div>
                <div class="list-item-info">
                    <h4>${service.name}</h4>
                    <p>${service.description}</p>
                </div>
            </div>
            <div class="list-item-actions">
                <button class="btn-edit" onclick="editService(${service.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteService(${service.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(item);
    });
}

function editService(id) {
    const services = getServices();
    const service = services.find(s => s.id === id);
    
    if (service) {
        editingServiceId = id;
        document.getElementById('serviceFormTitle').textContent = 'Edit Service';
        document.getElementById('serviceName').value = service.name;
        document.getElementById('serviceDescription').value = service.description;
        document.getElementById('serviceIcon').value = service.icon;
        document.getElementById('serviceFeatures').value = service.features.join('\n');
        document.getElementById('serviceFormContainer').style.display = 'block';
        scrollToElement('serviceFormContainer');
    }
}

function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        const services = getServices().filter(s => s.id !== id);
        localStorage.setItem('portfolioServices', JSON.stringify(services));
        loadServicesList();
        showNotification('Service deleted!', 'success');
        logActivity('Service deleted');
        updateStatistics();
        updateMainWebsite();
    }
}

// ============================================
// TESTIMONIALS MANAGEMENT
// ============================================

function showAddTestimonialForm() {
    editingTestimonialId = null;
    document.getElementById('testimonialFormTitle').textContent = 'Add New Testimonial';
    document.getElementById('testimonialForm').reset();
    document.getElementById('testimonialFormContainer').style.display = 'block';
    document.getElementById('testimonialAvatarPreview').innerHTML = '';
    scrollToElement('testimonialFormContainer');
}

function cancelTestimonialForm() {
    document.getElementById('testimonialFormContainer').style.display = 'none';
    document.getElementById('testimonialForm').reset();
    editingTestimonialId = null;
}

function saveTestimonial() {
    const testimonials = getTestimonials();
    const newTestimonial = {
        id: editingTestimonialId || Date.now(),
        name: document.getElementById('testimonialName').value,
        title: document.getElementById('testimonialTitle').value,
        text: document.getElementById('testimonialText').value,
        rating: document.getElementById('testimonialRating').value,
        avatar: document.querySelector('#testimonialAvatarPreview img')?.src || 'https://via.placeholder.com/50x50'
    };

    if (editingTestimonialId) {
        const index = testimonials.findIndex(t => t.id === editingTestimonialId);
        if (index !== -1) {
            testimonials[index] = newTestimonial;
        }
    } else {
        testimonials.push(newTestimonial);
    }

    localStorage.setItem('portfolioTestimonials', JSON.stringify(testimonials));
    cancelTestimonialForm();
    loadTestimonialsList();
    showNotification('Testimonial saved!', 'success');
    logActivity('Testimonial ' + (editingTestimonialId ? 'updated' : 'added'));
    updateStatistics();
    updateMainWebsite();
}

function loadTestimonialsList() {
    const testimonials = getTestimonials();
    const list = document.getElementById('testimonialsList');
    list.innerHTML = '';

    if (testimonials.length === 0) {
        list.innerHTML = '<p class="empty-state">No testimonials yet. Add your first testimonial!</p>';
        return;
    }

    testimonials.forEach(testimonial => {
        const stars = Array(parseInt(testimonial.rating)).fill('★').join('');
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-content">
                <img src="${testimonial.avatar}" alt="${testimonial.name}" class="list-item-image" style="border-radius: 50%; width: 50px; height: 50px;">
                <div class="list-item-info">
                    <h4>${testimonial.name}</h4>
                    <p><strong>${testimonial.title}</strong></p>
                    <p>${testimonial.text.substring(0, 100)}...</p>
                    <p style="color: #f39c12;">${stars}</p>
                </div>
            </div>
            <div class="list-item-actions">
                <button class="btn-edit" onclick="editTestimonial(${testimonial.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteTestimonial(${testimonial.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(item);
    });
}

function editTestimonial(id) {
    const testimonials = getTestimonials();
    const testimonial = testimonials.find(t => t.id === id);
    
    if (testimonial) {
        editingTestimonialId = id;
        document.getElementById('testimonialFormTitle').textContent = 'Edit Testimonial';
        document.getElementById('testimonialName').value = testimonial.name;
        document.getElementById('testimonialTitle').value = testimonial.title;
        document.getElementById('testimonialText').value = testimonial.text;
        document.getElementById('testimonialRating').value = testimonial.rating;
        
        if (testimonial.avatar) {
            document.getElementById('testimonialAvatarPreview').innerHTML = `<img src="${testimonial.avatar}" alt="${testimonial.name}">`;
        }
        
        document.getElementById('testimonialFormContainer').style.display = 'block';
        scrollToElement('testimonialFormContainer');
    }
}

function deleteTestimonial(id) {
    if (confirm('Are you sure you want to delete this testimonial?')) {
        const testimonials = getTestimonials().filter(t => t.id !== id);
        localStorage.setItem('portfolioTestimonials', JSON.stringify(testimonials));
        loadTestimonialsList();
        showNotification('Testimonial deleted!', 'success');
        logActivity('Testimonial deleted');
        updateStatistics();
        updateMainWebsite();
    }
}

// ============================================
// EXPERIENCE MANAGEMENT
// ============================================

function showAddExperienceForm() {
    editingExperienceId = null;
    document.getElementById('experienceFormTitle').textContent = 'Add Experience/Education';
    document.getElementById('experienceForm').reset();
    document.getElementById('experienceFormContainer').style.display = 'block';
    scrollToElement('experienceFormContainer');
}

function cancelExperienceForm() {
    document.getElementById('experienceFormContainer').style.display = 'none';
    document.getElementById('experienceForm').reset();
    editingExperienceId = null;
}

function saveExperience() {
    const experience = getExperience();
    const newEntry = {
        id: editingExperienceId || Date.now(),
        type: document.getElementById('experienceType').value,
        title: document.getElementById('experienceTitle').value,
        company: document.getElementById('experienceCompany').value,
        period: document.getElementById('experiencePeriod').value,
        description: document.getElementById('experienceDescription').value
    };

    if (editingExperienceId) {
        const index = experience.findIndex(e => e.id === editingExperienceId);
        if (index !== -1) {
            experience[index] = newEntry;
        }
    } else {
        experience.push(newEntry);
    }

    localStorage.setItem('portfolioExperience', JSON.stringify(experience));
    cancelExperienceForm();
    loadExperienceList();
    showNotification('Experience saved!', 'success');
    logActivity('Experience ' + (editingExperienceId ? 'updated' : 'added'));
    updateMainWebsite();
}

function loadExperienceList() {
    const experience = getExperience();
    const list = document.getElementById('experienceList');
    list.innerHTML = '';

    if (experience.length === 0) {
        list.innerHTML = '<p class="empty-state">No experience yet. Add your first entry!</p>';
        return;
    }

    experience.forEach(entry => {
        const icon = entry.type === 'work' ? 'fas fa-briefcase' : 'fas fa-graduation-cap';
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-content">
                <div style="font-size: 1.5rem; color: #667eea; min-width: 40px; text-align: center;">
                    <i class="${icon}"></i>
                </div>
                <div class="list-item-info">
                    <h4>${entry.title}</h4>
                    <p><strong>${entry.company}</strong> • ${entry.period}</p>
                    <p>${entry.description}</p>
                </div>
            </div>
            <div class="list-item-actions">
                <button class="btn-edit" onclick="editExperience(${entry.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteExperience(${entry.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(item);
    });
}

function editExperience(id) {
    const experience = getExperience();
    const entry = experience.find(e => e.id === id);
    
    if (entry) {
        editingExperienceId = id;
        document.getElementById('experienceFormTitle').textContent = 'Edit Experience/Education';
        document.getElementById('experienceType').value = entry.type;
        document.getElementById('experienceTitle').value = entry.title;
        document.getElementById('experienceCompany').value = entry.company;
        document.getElementById('experiencePeriod').value = entry.period;
        document.getElementById('experienceDescription').value = entry.description;
        document.getElementById('experienceFormContainer').style.display = 'block';
        scrollToElement('experienceFormContainer');
    }
}

function deleteExperience(id) {
    if (confirm('Are you sure you want to delete this entry?')) {
        const experience = getExperience().filter(e => e.id !== id);
        localStorage.setItem('portfolioExperience', JSON.stringify(experience));
        loadExperienceList();
        showNotification('Entry deleted!', 'success');
        logActivity('Experience deleted');
        updateMainWebsite();
    }
}

// ============================================
// SETTINGS
// ============================================

function updateCredentials() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!newPassword && !confirmPassword) {
        showNotification('Please enter a new password', 'warning');
        return;
    }

    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    // In production, send this to server securely
    DEFAULT_CREDENTIALS.password = newPassword;
    document.getElementById('credentialsForm').reset();
    showNotification('Credentials updated successfully!', 'success');
    logActivity('Admin credentials updated');
}

function exportData() {
    const data = {
        content: getContentData(),
        projects: getProjects(),
        skills: getSkills(),
        services: getServices(),
        testimonials: getTestimonials(),
        experience: getExperience(),
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    showNotification('Data exported successfully!', 'success');
    logActivity('Data exported');
}

function showImportForm() {
    document.getElementById('importFormContainer').style.display = 'block';
}

function hideImportForm() {
    document.getElementById('importFormContainer').style.display = 'none';
    document.getElementById('importFile').value = '';
}

function importData() {
    const file = document.getElementById('importFile').files[0];
    
    if (!file) {
        showNotification('Please select a file', 'warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.content) localStorage.setItem('portfolioContent', JSON.stringify(data.content));
            if (data.projects) localStorage.setItem('portfolioProjects', JSON.stringify(data.projects));
            if (data.skills) localStorage.setItem('portfolioSkills', JSON.stringify(data.skills));
            if (data.services) localStorage.setItem('portfolioServices', JSON.stringify(data.services));
            if (data.testimonials) localStorage.setItem('portfolioTestimonials', JSON.stringify(data.testimonials));
            if (data.experience) localStorage.setItem('portfolioExperience', JSON.stringify(data.experience));

            hideImportForm();
            showNotification('Data imported successfully!', 'success');
            logActivity('Data imported');
            updateStatistics();
            location.reload();
        } catch (error) {
            showNotification('Invalid file format!', 'error');
        }
    };

    reader.readAsText(file);
}

function resetToDefault() {
    if (confirm('WARNING: This will delete all your custom data and reset to default. Continue?')) {
        if (confirm('Are you absolutely sure? This action cannot be undone.')) {
            localStorage.removeItem('portfolioContent');
            localStorage.removeItem('portfolioProjects');
            localStorage.removeItem('portfolioSkills');
            localStorage.removeItem('portfolioServices');
            localStorage.removeItem('portfolioTestimonials');
            localStorage.removeItem('portfolioExperience');
            
            showNotification('All data has been reset to default!', 'success');
            logActivity('Portfolio reset to default');
            location.reload();
        }
    }
}

// ============================================
// DATA RETRIEVAL FUNCTIONS
// ============================================

function getContentData() {
    return JSON.parse(localStorage.getItem('portfolioContent')) || {
        hero: {
            title: 'Welcome to my Creative Space',
            subtitle: "I'm a Full-Stack Developer",
            description: 'Crafting beautiful digital experiences...',
            image: 'https://via.placeholder.com/400x400/667eea/ffffff?text=Profile'
        },
        about: {
            name: 'Your Name',
            bio: 'I am a passionate full-stack developer...',
            badge: '5+ Years Experience',
            image: 'https://via.placeholder.com/500x500/667eea/ffffff?text=About'
        },
        contact: {
            email: 'hello@yourname.com',
            phone: '+1 (234) 567-8900',
            location: 'San Francisco, CA'
        },
        social: {
            twitter: 'https://twitter.com',
            linkedin: 'https://linkedin.com',
            github: 'https://github.com',
            instagram: 'https://instagram.com'
        }
    };
}

function getProjects() {
    return JSON.parse(localStorage.getItem('portfolioProjects')) || [];
}

function getSkills() {
    return JSON.parse(localStorage.getItem('portfolioSkills')) || [];
}

function getServices() {
    return JSON.parse(localStorage.getItem('portfolioServices')) || [];
}

function getTestimonials() {
    return JSON.parse(localStorage.getItem('portfolioTestimonials')) || [];
}

function getExperience() {
    return JSON.parse(localStorage.getItem('portfolioExperience')) || [];
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function setupImageUploadPreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const preview = document.getElementById(previewId);
                preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

function showNotification(message, type = 'info') {
    const toast = document.getElementById('notificationToast');
    toast.textContent = message;
    toast.className = `notification ${type}`;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function logActivity(activity) {
    const activities = JSON.parse(localStorage.getItem('adminActivities')) || [];
    activities.unshift({
        timestamp: new Date().toLocaleString(),
        activity: activity
    });

    // Keep only last 20 activities
    activities.splice(20);
    localStorage.setItem('adminActivities', JSON.stringify(activities));
    localStorage.setItem('lastUpdated', new Date().toLocaleString());

    loadActivityLog();
}

function loadActivityLog() {
    const activities = JSON.parse(localStorage.getItem('adminActivities')) || [];
    const log = document.getElementById('activityLog');

    if (!log) return;

    if (activities.length === 0) {
        log.innerHTML = '<p class="empty-state">No recent changes yet</p>';
        return;
    }

    log.innerHTML = activities.slice(0, 10).map(item => 
        `<div class="activity-item">${item.timestamp} - ${item.activity}</div>`
    ).join('');
}

function updateStatistics() {
    document.getElementById('totalProjects').textContent = getProjects().length;
    document.getElementById('totalServices').textContent = getServices().length;
    document.getElementById('totalSkills').textContent = getSkills().length;
    document.getElementById('totalTestimonials').textContent = getTestimonials().length;
}

function loadStatistics() {
    updateStatistics();
    const lastUpdated = localStorage.getItem('lastUpdated');
    if (lastUpdated) {
        document.getElementById('lastUpdated').textContent = lastUpdated;
    }
}

function updateStorageInfo() {
    try {
        let size = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                size += localStorage[key].length + key.length;
            }
        }
        const sizeInKB = (size / 1024).toFixed(2);
        document.getElementById('storageUsed').textContent = sizeInKB + ' KB';
    } catch (e) {
        document.getElementById('storageUsed').textContent = 'N/A';
    }

    // Browser info
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = 'Chrome';
    } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = 'Firefox';
    } else if (userAgent.match(/safari/i)) {
        browserName = 'Safari';
    } else if (userAgent.match(/opr\//i)) {
        browserName = 'Opera';
    } else if (userAgent.match(/edg/i)) {
        browserName = 'Edge';
    }
    document.getElementById('browserInfo').textContent = browserName;
}

function scrollToElement(elementId) {
    setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
}

function saveAllData() {
    showNotification('All data saved! Ready to publish.', 'success');
    logActivity('All changes saved');
    updateMainWebsite();
}

function updateMainWebsite() {
    // This updates the main website to reflect changes
    // In production, you might want to reload an iframe or use localStorage events
    console.log('Website data updated. Changes will be visible on main portfolio.');
}

// Sync data across tabs
window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('portfolio')) {
        console.log('Data updated from another tab');
        location.reload();
    }
});

console.log('%c✨ Admin Panel Loaded', 'color: #667eea; font-size: 20px; font-weight: bold;');
