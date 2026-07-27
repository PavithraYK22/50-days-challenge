console.log("🚀 Synexus Engine Initialized. Ready for Logic!");

// ==========================================================================
// HERO SECTION INTERACTION
// ==========================================================================
const heroTitle = document.querySelector(".hero-card h1");
const heroCTA = document.querySelector(".hero-buttons .btn-primary");

if (heroCTA && heroTitle) {
    heroCTA.addEventListener("click", (event) => {
        event.preventDefault();

        const defaultTitle = "Welcome to Synexus Core!";

        if (heroTitle.textContent.trim() === defaultTitle) {
            heroTitle.innerHTML =
                'Architecting the <br><span class="gradient-text">Future of Developers</span>';
        } else {
            heroTitle.textContent = defaultTitle;
        }

        heroTitle.classList.toggle("active-state");
    });
}

// ==========================================================================
// THEME SWITCHER
// ==========================================================================
const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const darkEnabled = document.body.classList.contains("dark-mode");

        themeToggle.innerHTML = darkEnabled ? "☀️" : "🌙";
        themeToggle.setAttribute(
            "aria-label",
            darkEnabled ? "Enable Light Mode" : "Enable Dark Mode"
        );
    });
}

// ==========================================================================
// MENTOR MODAL
// ==========================================================================
const mentorModal = document.getElementById("mentor-modal");
const closeModalBtn = document.querySelector(".modal-close-btn");

const mentorName = document.getElementById("modal-mentor-name");
const mentorRole = document.getElementById("modal-mentor-role");
const mentorDomain = document.getElementById("modal-mentor-domain");
const mentorSkills = document.getElementById("modal-mentor-skills-list");
const mentorLinkedIn = document.getElementById("modal-mentor-linkedin");

// Open Modal
document.querySelectorAll(".explore-mentor-btn").forEach((btn) => {
    btn.addEventListener("click", () => {

        mentorName.textContent = btn.dataset.name;
        mentorRole.textContent = btn.dataset.role;
        mentorDomain.textContent = btn.dataset.domain;
        mentorLinkedIn.href = btn.dataset.linkedin;

        mentorSkills.replaceChildren();

        btn.dataset.details
            .split(";")
            .map(item => item.trim())
            .filter(item => item !== "")
            .forEach(item => {
                const listItem = document.createElement("li");
                listItem.textContent = item;
                mentorSkills.appendChild(listItem);
            });

        mentorModal.classList.add("active");
        closeModalBtn?.focus();
    });
});

// Close Modal Function
const hideModal = () => {
    mentorModal.classList.remove("active");
};

// Close Button
closeModalBtn?.addEventListener("click", hideModal);

// Click Outside Modal
window.addEventListener("click", (event) => {
    if (event.target === mentorModal) {
        hideModal();
    }
});

// Escape Key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mentorModal.classList.contains("active")) {
        hideModal();
    }
});