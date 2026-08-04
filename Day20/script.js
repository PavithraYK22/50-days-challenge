/* ========================================================================== */
/* DAY 19: SEARCH, FILTER, EVENT DELEGATION & DYNAMIC MODALS (UPDATED)       */
/* ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Project Data
    const projectsData = [
        {
            id: 1,
            title: "Project StoreLane",
            description: "A phygital hyperlocal commerce platform designed to digitize small local vendors.",
            status: "Active"
        },
        {
            id: 2,
            title: "QR Attendance Tracker",
            description: "Automated student attendance system utilizing progressive web app (PWA) tech and real-time scanning.",
            status: "Active"
        },
        {
            id: 3,
            title: "Logistics Management System",
            description: "Desktop architecture built for tracking shipments and driver status in real-time.",
            status: "Completed"
        },
        {
            id: 4,
            title: "AI Code Reviewer Engine",
            description: "Automated pull request analysis tool that detects syntax bugs and performance bottlenecks.",
            status: "Active"
        },
        {
            id: 5,
            title: "Campus Event Portal",
            description: "Centralized university platform for RSVP tracking, ticket generation, and venue scheduling.",
            status: "Completed"
        },
        {
            id: 6,
            title: "Smart Energy Monitor",
            description: "IoT dashboard providing real-time power consumption metrics and predictive outage alerts.",
            status: "Active"
        }
    ];

    // Sort Active Projects First
    projectsData.sort((a, b) => a.status === "Active" ? -1 : 1);

    // Selectors
    const gridContainer = document.getElementById('dynamic-grid') ||
        document.querySelector('.initiatives-grid') ||
        document.querySelector('.projects-grid');

    const searchInput = document.getElementById('search-projects');
    const clearBtn = document.getElementById('clear-search');

    const projectModal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal');

    const resultCounter = document.getElementById('results-count');

    // Helpers
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function highlightText(text, term) {
        if (!term) return text;

        const escaped = escapeRegExp(term);
        const regex = new RegExp(`(${escaped})`, "gi");

        return text.replace(regex, '<mark class="highlight">$1</mark>');
    }

    // Render Projects
    function renderProjects(dataArray, searchTerm = '') {

        if (!gridContainer) return;

        gridContainer.innerHTML = '';

        if (resultCounter) {
            resultCounter.textContent =
                `${dataArray.length} initiative(s) found`;
        }

        if (dataArray.length === 0) {
            gridContainer.innerHTML = `
                <div class="no-results-message">
                    <p>🔍 No initiatives match "<strong>${searchTerm}</strong>"</p>
                </div>
            `;
            return;
        }

        dataArray.forEach(project => {

            const statusClass =
                project.status === "Active"
                    ? "status-active"
                    : "status-completed";

            gridContainer.innerHTML += `
                <div class="initiative-card card ${statusClass}">
                    <div>
                        <h3>${highlightText(project.title, searchTerm)}</h3>
                        <p>${highlightText(project.description, searchTerm)}</p>
                    </div>

                    <div class="card-footer"
                        style="display:flex;
                               justify-content:space-between;
                               align-items:center;
                               margin-top:1rem;">

                        <span class="card-status-badge">
                            ${project.status}
                        </span>

                        <button
                            class="view-btn"
                            data-id="${project.id}">
                            View Details
                        </button>

                    </div>
                </div>
            `;
        });
    }

    // Initial Render
    renderProjects(projectsData);

    // Search
    if (searchInput && clearBtn) {

        searchInput.addEventListener('input', () => {

            const searchTerm = searchInput.value.trim();
            const normalized = searchTerm.toLowerCase();

            clearBtn.classList.toggle(
                'show',
                searchTerm.length > 0
            );

            const filtered = projectsData.filter(project =>

                project.title.toLowerCase().includes(normalized) ||
                project.description.toLowerCase().includes(normalized) ||
                project.status.toLowerCase().includes(normalized)

            );

            renderProjects(filtered, searchTerm);
        });

        clearBtn.addEventListener('click', () => {

            searchInput.value = '';
            clearBtn.classList.remove('show');
            searchInput.focus();

            renderProjects(projectsData);

        });
    }

    // Event Delegation
    if (gridContainer) {

        gridContainer.addEventListener('click', e => {

            const button = e.target.closest('.view-btn');

            if (!button) return;

            const projectId = Number(button.dataset.id);

            const selectedProject = projectsData.find(
                project => project.id === projectId
            );

            if (!selectedProject) return;

            modalTitle.textContent = selectedProject.title;

            if (modalBody) {
                modalBody.innerHTML = `
                    <p><strong>Description:</strong></p>
                    <p>${selectedProject.description}</p>

                    <p><strong>Status:</strong>
                    <span class="card-status-badge">
                        ${selectedProject.status}
                    </span></p>
                `;
            }

            projectModal.style.display = 'flex';

            requestAnimationFrame(() => {
                projectModal.classList.add('active');
            });

        });

    }

    // Close Modal
    function closeModal() {

        if (!projectModal) return;

        projectModal.classList.remove('active');

        setTimeout(() => {
            projectModal.style.display = 'none';
        }, 250);

    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (projectModal) {

        projectModal.addEventListener('click', e => {

            if (e.target === projectModal) {
                closeModal();
            }

        });

    }

    document.addEventListener('keydown', e => {

        if (
            e.key === 'Escape' &&
            projectModal &&
            projectModal.style.display === 'flex'
        ) {
            closeModal();
        }

    });

});

/* ========================================== */
/* 2. DAY 20: STATEFUL TASK TRACKER           */
/* ========================================== */

let taskState = [];

const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskListContainer = document.getElementById('task-list');

function saveStateToStorage() {
    localStorage.setItem('synexus_taskState', JSON.stringify(taskState));
}

function loadStateFromStorage() {
    const storedTasks = localStorage.getItem('synexus_taskState');

    if (!storedTasks) return;

    try {
        taskState = JSON.parse(storedTasks);
    } catch (error) {
        taskState = [];
    }
}

function renderTasks() {
    if (!taskListContainer) return;

    taskListContainer.innerHTML = '';

    if (taskState.length === 0) {
        taskListContainer.innerHTML = `
            <li class="empty-state" style="text-align:center; color:var(--text-muted,#64748b); padding:1rem 0; list-style:none;">
                ✨ No milestones yet. Add your first task above!
            </li>
        `;
        return;
    }

    // Show incomplete tasks first
    const sortedTasks = [...taskState].sort((a, b) => a.completed - b.completed);

    sortedTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'done' : ''}`;

        li.innerHTML = `
            <input
                type="checkbox"
                class="toggle-check"
                data-id="${task.id}"
                ${task.completed ? 'checked' : ''}
            >
            <span>${task.text}</span>
            <button
                class="delete-btn"
                data-id="${task.id}"
                aria-label="Delete Task">
                &times;
            </button>
        `;

        taskListContainer.appendChild(li);
    });
}

function handleAddTask() {
    if (!taskInput) return;

    const textValue = taskInput.value.replace(/\s+/g, ' ').trim();

    if (textValue === '') return;

    // Prevent duplicate tasks
    const duplicate = taskState.some(
        task => task.text.toLowerCase() === textValue.toLowerCase()
    );

    if (duplicate) {
        alert("Task already exists!");
        return;
    }

    taskState.push({
        id: Date.now(),
        text: textValue,
        completed: false
    });

    saveStateToStorage();
    renderTasks();

    taskInput.value = '';
    taskInput.focus();
}

if (addTaskBtn) {
    addTaskBtn.addEventListener('click', handleAddTask);
}

if (taskInput) {
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTask();
        }
    });
}

if (taskListContainer) {
    taskListContainer.addEventListener('click', (e) => {

        const targetId = Number(e.target.dataset.id);

        if (!targetId) return;

        if (e.target.classList.contains('delete-btn')) {

            if (confirm("Delete this task?")) {
                taskState = taskState.filter(task => task.id !== targetId);
                saveStateToStorage();
                renderTasks();
            }

            return;
        }

        if (e.target.classList.contains('toggle-check')) {

            const task = taskState.find(task => task.id === targetId);

            if (task) {
                task.completed = !task.completed;
                saveStateToStorage();
                renderTasks();
            }
        }
    });
}

// Initial Load
loadStateFromStorage();
renderTasks();