// ==========================================================================
// DAY 12: MOBILE MENU TOGGLE LOGIC
// ==========================================================================
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', () => {
        // 1. Toggle the mobile navigation utility class
        navLinksContainer.classList.toggle('nav-active');

        // 2. Accessibility & Morph Toggle (☰ -> ✕)
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.textContent = !isExpanded ? '✕' : '☰';
    });

    // Close menu automatically when clicking any nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('nav-active')) {
                navLinksContainer.classList.remove('nav-active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.textContent = '☰';
            }
        });
    });
}

// ==========================================================================
// DAY 11: DOM FUNDAMENTALS & HERO INTERACTION
// ==========================================================================
console.log("Synexus Engine Initialized. Ready for logic.");

// 1. DOM SELECTION
const heroHeadline = document.querySelector('.hero-card h1');
const heroButton = document.querySelector('.hero-buttons .btn-primary');

// 2. EVENT LISTENER & DOM MANIPULATION
if (heroButton && heroHeadline) {
    heroButton.addEventListener('click', function(e) {
        // Prevent default anchor jump navigation for smooth demonstration
        e.preventDefault();

        // 3. DOM MANIPULATION (Toggle Text Content)
        if (heroHeadline.textContent.includes("Welcome to Synexus Core!")) {
            heroHeadline.innerHTML = 'Architecting The <br><span class="gradient-text">Next Generation</span> of Devs';
        } else {
            heroHeadline.textContent = "Welcome to Synexus Core!";
        }

        // Bonus Challenge: Toggle active CSS state class
        heroHeadline.classList.toggle('active-state');
    });
}

// ==========================================================================
// 1. DARK MODE TOGGLE LOGIC
// ==========================================================================
const toggleBtn = document.getElementById('theme-toggle');

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
        toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
}

// ==========================================================================
// 2. DYNAMIC MENTOR MODAL LOGIC
// ==========================================================================
const modal = document.getElementById('mentor-modal');
const closeBtn = document.querySelector('.modal-close-btn');
const modalName = document.getElementById('modal-mentor-name');
const modalRole = document.getElementById('modal-mentor-role');
const modalDomain = document.getElementById('modal-mentor-domain');
const modalSkillsList = document.getElementById('modal-mentor-skills-list');
const modalLinkedin = document.getElementById('modal-mentor-linkedin');

// Attach Click Listeners to all Mentor "Explore Role" Buttons
document.querySelectorAll('.explore-mentor-btn').forEach(button => {
    button.addEventListener('click', () => {
        modalName.textContent = button.getAttribute('data-name');
        modalRole.textContent = button.getAttribute('data-role');
        modalDomain.textContent = button.getAttribute('data-domain');
        modalLinkedin.setAttribute('href', button.getAttribute('data-linkedin'));
        
        // Clear previous bullet points
        modalSkillsList.innerHTML = '';
        
        // Parse semicolon-separated details and append as list items
        const structuralPoints = button.getAttribute('data-details').split(';');
        structuralPoints.forEach(point => {
            if (point.trim().length > 0) {
                const li = document.createElement('li');
                li.textContent = point.trim();
                modalSkillsList.appendChild(li);
            }
        });
        
        // Show modal and move focus for accessibility
        modal.classList.add('active');
        if (closeBtn) closeBtn.focus();
    });
});

// Close Modal Event Listeners
if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
}

// Close when clicking backdrop outside modal box
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// Close on Escape Key press
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
    }
});

// ==========================================================================
// DAY 13: ENHANCED CLIENT-SIDE FORM VALIDATION
// ==========================================================================

const form = document.querySelector(".membership-form");

const fullName = document.getElementById("fullName");
const email = document.getElementById("emailAddress");
const motivation = document.getElementById("motivation");

if (form) {

    // Remove previous validation messages
    function clearErrors() {
        document.querySelectorAll(".error-text, .form-success-banner").forEach(element => {
            element.remove();
        });

        [fullName, email, motivation].forEach(input => {
            if (input) input.classList.remove("input-error");
        });
    }

    // Display error message
    function displayError(input, message) {
        input.classList.add("input-error");

        const error = document.createElement("small");
        error.className = "error-text";
        error.textContent = message;

        input.insertAdjacentElement("afterend", error);
    }

    // Email validation
    function validEmail(emailValue) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(emailValue);
    }

    // Remove error while typing
    [fullName, email, motivation].forEach(input => {
        if (input) {
            input.addEventListener("input", () => {
                input.classList.remove("input-error");

                const next = input.nextElementSibling;
                if (next && next.classList.contains("error-text")) {
                    next.remove();
                }
            });
        }
    });

    // Form Submit
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        clearErrors();

        const nameValue = fullName.value.trim();
        const emailValue = email.value.trim();
        const motivationValue = motivation ? motivation.value.trim() : "";

        let formValid = true;

        // Name validation
        if (nameValue.length < 3) {
            displayError(fullName, "Please enter at least 3 characters.");
            formValid = false;
        }

        // Email validation
        if (emailValue === "") {
            displayError(email, "Email address is required.");
            formValid = false;
        } else if (!validEmail(emailValue)) {
            displayError(email, "Please enter a valid email address.");
            formValid = false;
        }

        // Optional motivation validation
        if (motivation && motivationValue !== "" && motivationValue.length < 15) {
            displayError(motivation, "Please write at least 15 characters.");
            formValid = false;
        }

        // Success
        if (formValid) {

            console.log("Validated Form Data:", {
                fullName: nameValue,
                email: emailValue,
                motivation: motivationValue
            });

            const success = document.createElement("div");
            success.className = "form-success-banner";
            success.innerHTML = "✅ Your application has been validated successfully!";

            form.appendChild(success);

            form.reset();

            setTimeout(() => {
                success.remove();
            }, 3000);

            // Uncomment this if you're using FormSubmit
            // setTimeout(() => form.submit(), 1000);
        }

    });

}

const projects = [
    {
        title: "Project StoreLane",
        description: "A phygital hyperlocal commerce platform designed to digitize small local vendors.",
        status: "Active"
    },
    {
        title: "QR Attendance Tracker",
        description: "Automated student attendance system utilizing progressive web app (PWA) tech and real-time scanning.",
        status: "Active"
    },
    {
        title: "Logistics Management System",
        description: "Desktop architecture built for tracking shipments and driver status in real-time.",
        status: "Completed"
    }
];

const container = document.querySelector("#dynamic-grid");

if (container) {
    container.textContent = "";

    const cards = projects.map(({ title, description, status }) => {
        const badgeClass =
            status === "Active"
                ? "status-active"
                : "status-completed";

        return `
            <article class="initiative-card card ${badgeClass}">
                <div class="card-content">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
                <span class="card-status-badge">${status}</span>
            </article>
        `;
    });

    container.insertAdjacentHTML("beforeend", cards.join(""));
}

const projectsData = [
    {
        title: "Project StoreLane",
        description: "A phygital hyperlocal commerce platform designed to digitize small local vendors.",
        status: "Active"
    },
    {
        title: "QR Attendance Tracker",
        description: "Automated student attendance system utilizing progressive web app (PWA) tech and real-time scanning.",
        status: "Active"
    },
    {
        title: "Logistics Management System",
        description: "Desktop architecture built for tracking shipments and driver status in real-time.",
        status: "Completed"
    },
    {
        title: "AI Code Reviewer Engine",
        description: "Automated pull request analysis tool that detects syntax bugs and performance bottlenecks.",
        status: "Active"
    },
    {
        title: "Campus Event Portal",
        description: "Centralized university platform for RSVP tracking, ticket generation, and venue scheduling.",
        status: "Completed"
    },
    {
        title: "Smart Energy Monitor",
        description: "IoT dashboard providing real-time power consumption metrics and predictive outage alerts.",
        status: "Active"
    }
];

const gridContainer = document.getElementById("dynamic-grid");
const searchInput = document.getElementById("search-projects");
const clearBtn = document.getElementById("clear-search");

// Create result counter
const resultCount = document.createElement("p");
resultCount.className = "search-result-count";

if (searchInput) {
    searchInput.parentElement.insertAdjacentElement("afterend", resultCount);
}

// Escape HTML
function escapeHTML(text) {
    return text.replace(/[&<>"']/g, match => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[match]);
}

// Escape regex
function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Highlight text
function highlight(text, keyword) {
    if (!keyword) return escapeHTML(text);

    const regex = new RegExp(`(${escapeRegExp(keyword)})`, "gi");

    return escapeHTML(text).replace(
        regex,
        '<mark class="highlight">$1</mark>'
    );
}

// Render cards
function renderProjects(data, keyword = "") {

    gridContainer.innerHTML = "";

    resultCount.textContent = `${data.length} Initiative${data.length !== 1 ? "s" : ""} Found`;

    if (!data.length) {

        gridContainer.innerHTML = `
        <div class="no-results-message">
            <h3>No Results Found</h3>
            <p>Try another keyword.</p>
        </div>`;

        return;
    }

    const fragment = document.createDocumentFragment();

    data.forEach(project => {

        const card = document.createElement("div");

        card.className = `initiative-card card ${
            project.status === "Active"
                ? "status-active"
                : "status-completed"
        }`;

        card.innerHTML = `
            <div>
                <h3>${highlight(project.title, keyword)}</h3>
                <p>${highlight(project.description, keyword)}</p>
            </div>

            <span class="card-status-badge">
                ${project.status}
            </span>
        `;

        fragment.appendChild(card);

    });

    gridContainer.appendChild(fragment);

}

renderProjects(projectsData);

// Debounce
let timer;

searchInput.addEventListener("input", () => {

    clearTimeout(timer);

    timer = setTimeout(() => {

        const keyword = searchInput.value.trim().toLowerCase();

        clearBtn.classList.toggle("show", keyword.length);

        const filtered = projectsData.filter(project =>

            project.title.toLowerCase().includes(keyword) ||

            project.description.toLowerCase().includes(keyword) ||

            project.status.toLowerCase().includes(keyword)

        );

        renderProjects(filtered, keyword);

    }, 250);

});

// Clear button
clearBtn.addEventListener("click", () => {

    searchInput.value = "";

    clearBtn.classList.remove("show");

    renderProjects(projectsData);

    searchInput.focus();

});

// ESC key clears search
searchInput.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        searchInput.value = "";

        clearBtn.classList.remove("show");

        renderProjects(projectsData);

    }

});