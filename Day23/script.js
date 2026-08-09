document.addEventListener('DOMContentLoaded', () => {

    /* ========================================== */
/* DAY 23: KANBAN BOARD - DRAG & DROP         */
/* ========================================== */

function initKanbanBoard() {

    const board = document.querySelector('.kanban-board');

    if (!board) return;

    const cards = board.querySelectorAll('.task-card');
    const columns = board.querySelectorAll('.kanban-column');


    /* ========================================== */
    /* UPDATE TASK COUNTS                         */
    /* ========================================== */

    const refreshCounts = () => {

        columns.forEach(column => {

            const list = column.querySelector('.task-list');
            const badge = column.querySelector('.column-count');

            if (!list || !badge) return;

            const totalTasks = list.querySelectorAll('.task-card').length;

            badge.textContent = totalTasks;
        });
    };


    /* ========================================== */
    /* FIND CARD POSITION                         */
    /* ========================================== */

    function findDropPosition(list, mouseY) {

        const availableCards = [
            ...list.querySelectorAll(
                '.task-card:not(.is-dragging)'
            )
        ];

        let closestCard = null;
        let closestOffset = Number.NEGATIVE_INFINITY;

        availableCards.forEach(card => {

            const rectangle = card.getBoundingClientRect();

            const offset =
                mouseY -
                rectangle.top -
                rectangle.height / 2;

            if (
                offset < 0 &&
                offset > closestOffset
            ) {
                closestOffset = offset;
                closestCard = card;
            }
        });

        return closestCard;
    }


    /* ========================================== */
    /* CARD DRAG EVENTS                           */
    /* ========================================== */

    cards.forEach(card => {

        card.addEventListener('dragstart', () => {

            card.classList.add('is-dragging');

        });


        card.addEventListener('dragend', () => {

            card.classList.remove('is-dragging');

            columns.forEach(column => {
                column.classList.remove('drag-over');
            });

            refreshCounts();

        });

    });


    /* ========================================== */
    /* COLUMN DROP EVENTS                         */
    /* ========================================== */

    columns.forEach(column => {

        const list = column.querySelector('.task-list');

        if (!list) return;


        column.addEventListener('dragover', event => {

            event.preventDefault();

            column.classList.add('drag-over');

            const draggedCard =
                board.querySelector('.task-card.is-dragging');

            if (!draggedCard) return;


            const nextCard =
                findDropPosition(
                    list,
                    event.clientY
                );


            if (nextCard) {

                list.insertBefore(
                    draggedCard,
                    nextCard
                );

            } else {

                list.appendChild(
                    draggedCard
                );

            }

        });


        column.addEventListener('dragleave', event => {

            /*
             * Prevent removing the highlight when
             * moving between elements inside the column.
             */
            if (!column.contains(event.relatedTarget)) {

                column.classList.remove('drag-over');

            }

        });


        column.addEventListener('drop', event => {

            event.preventDefault();

            column.classList.remove('drag-over');

            refreshCounts();

        });

    });


    /* ========================================== */
    /* INITIALIZE COUNTS                          */
    /* ========================================== */

    refreshCounts();

}
/* ========================================== */
/* DAY 22: INTERSECTION OBSERVER API          */
/* ========================================== */

// Create the scroll animation observer
const scrollObserver = new IntersectionObserver((entries, observer) => {

    entries.forEach((entry) => {

        // Run animation when element enters viewport
        if (entry.isIntersecting) {

            // Reveal the element
            entry.target.classList.add('show');

            // Stop observing after animation
            observer.unobserve(entry.target);
        }

    });

}, {
    threshold: 0.2,              // Start when 20% is visible
    rootMargin: "0px 0px -40px 0px"
});


// Observe all hidden elements
function observeElements() {

    const elements = document.querySelectorAll(".hidden");

    elements.forEach((element) => {
        scrollObserver.observe(element);
    });
}


// Start observing after page loads
if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded", observeElements);

} else {

    observeElements();

}
/* ========================================== */
/* DAY 21: ACTIVE INITIATIVES (Updated)       */
/* ========================================== */

function renderInitiatives(items) {
    if (!dynamicGrid) return;

    dynamicGrid.innerHTML = "";

    if (!items.length) {
        dynamicGrid.innerHTML = `
            <p style="text-align:center; color:var(--text-muted,#64748b); grid-column:1/-1; padding:2rem;">
                No matching initiatives found.
            </p>
        `;
        return;
    }

    items.forEach(item => {
        const active = item.status.startsWith("ACTIVE");

        const cardHTML = `
            <div class="card initiative-card ${active ? "active-card" : ""}">
                <h3>${item.title}</h3>
                <p>${item.description}</p>

                <div class="card-footer"
                    style="display:flex;justify-content:space-between;align-items:center;margin-top:1.4rem;">

                    <span class="status-tag"
                        style="
                            padding:0.35rem 0.75rem;
                            border-radius:18px;
                            font-size:0.75rem;
                            font-weight:700;
                            background:${active ? "#d1fae5" : "#e2e8f0"};
                            color:${active ? "#065f46" : "#475569"};
                        ">
                        ${item.status}
                    </span>

                    <button
                        class="btn-primary view-details-btn"
                        data-id="${item.id}"
                        style="padding:0.45rem 0.9rem;font-size:0.85rem;">
                        View Details
                    </button>
                </div>
            </div>
        `;

        dynamicGrid.insertAdjacentHTML("beforeend", cardHTML);

        if (active) {
            dynamicGrid.lastElementChild.classList.add("highlight-card");
        }
    });
}


/* ========================================== */
/* SEARCH FUNCTION                            */
/* ========================================== */

function executeHeavySearch(event) {

    const keyword = event.target.value.trim().toLowerCase();

    console.log(`Searching: ${keyword}`);

    const filteredItems = initiativesData.filter(item => {
        const searchableText =
            `${item.title} ${item.description}`.toLowerCase();

        return searchableText.includes(keyword);
    });

    renderInitiatives(filteredItems);
}


/* ========================================== */
/* CLEAR BUTTON                               */
/* ========================================== */

function toggleClearButton() {
    if (!searchInput || !clearSearchBtn) return;

    clearSearchBtn.hidden = searchInput.value.trim() === "";
}


/* ========================================== */
/* EVENT LISTENERS                            */
/* ========================================== */

if (searchInput) {

    const searchHandler = debounce(executeHeavySearch, 300);

    searchInput.addEventListener("input", e => {
        toggleClearButton();
        searchHandler(e);
    });
}

if (clearSearchBtn) {

    clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        clearSearchButton();
        renderInitiatives(initiativesData);
    });
}


/* ========================================== */
/* INITIAL LOAD                               */
/* ========================================== */

renderInitiatives(initiativesData);

/* ========================================== */
/* 3. MODAL POPUP SYSTEM (Updated Version)    */
/* ========================================== */

function openModal(project) {
    if (!modalOverlay || !modalContent) return;

    const {
        title,
        lead,
        fullDetails,
        stack
    } = project;

    const techList = stack
        .map(skill => `<span class="modal-tech-tag">${skill}</span>`)
        .join("");

    modalContent.innerHTML = `
        <header style="margin-bottom:1rem;">
            <h2 style="margin:0;font-size:1.5rem;color:#1e293b;">
                ${title}
            </h2>
        </header>

        <p style="font-size:0.9rem;color:#64748b;margin-bottom:1rem;">
            <strong>Project Lead:</strong> ${lead}
        </p>

        <p style="line-height:1.7;color:#334155;margin-bottom:1.25rem;">
            ${fullDetails}
        </p>

        <section>
            <strong style="display:block;margin-bottom:.4rem;color:#475569;">
                Technologies Used
            </strong>

            <div class="tech-container">
                ${techList}
            </div>
        </section>
    `;

    modalOverlay.classList.add("active");
    modalOverlay.setAttribute("aria-hidden", "false");
}

function closeModal() {
    if (!modalOverlay) return;

    modalOverlay.classList.remove("active");
    modalOverlay.setAttribute("aria-hidden", "true");
}


/* ========================================== */
/* EVENT DELEGATION                           */
/* ========================================== */

dynamicGrid?.addEventListener("click", event => {

    const button = event.target.closest(".view-details-btn");
    if (!button) return;

    const project = initiativesData.find(({ id }) =>
        id === button.dataset.id
    );

    if (project) {
        openModal(project);
    }
});


/* ========================================== */
/* CLOSE EVENTS                               */
/* ========================================== */

closeModalBtn?.addEventListener("click", closeModal);

modalOverlay?.addEventListener("click", event => {
    if (event.target === modalOverlay) {
        closeModal();
    }
});


/* ========================================== */
/* ESC KEY SUPPORT                            */
/* ========================================== */

document.addEventListener("keydown", event => {

    switch (event.key) {

        case "Escape":
            if (modalOverlay?.classList.contains("active")) {
                closeModal();
            }
            break;

        default:
            break;
    }
});

/* ========================================== */
/* 4. ROADMAP TASK TRACKER (Updated Version)  */
/* ========================================== */

let roadmapTasks = [];

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

/* ---------- Local Storage ---------- */

function saveTasks() {
    localStorage.setItem("synexus_taskState", JSON.stringify(roadmapTasks));
}

function loadTasks() {
    try {
        roadmapTasks = JSON.parse(localStorage.getItem("synexus_taskState")) || [];
    } catch {
        roadmapTasks = [];
    }
}

/* ---------- Render Tasks ---------- */

function displayTasks() {

    if (!taskList) return;

    taskList.innerHTML = "";

    if (!roadmapTasks.length) {
        taskList.innerHTML = `
            <li class="empty-state"
                style="text-align:center;padding:1rem;color:var(--text-muted,#64748b);list-style:none;">
                ✨ No milestones yet. Add your first task above!
            </li>
        `;
        return;
    }

    roadmapTasks.forEach(({ id, text, completed }) => {

        taskList.insertAdjacentHTML("beforeend", `
            <li class="task-item ${completed ? "done" : ""}">
                <input
                    type="checkbox"
                    class="toggle-check"
                    data-id="${id}"
                    ${completed ? "checked" : ""}
                >

                <span>${text}</span>

                <button
                    class="delete-btn"
                    data-id="${id}">
                    &times;
                </button>
            </li>
        `);

    });
}

/* ---------- Add Task ---------- */

function addTask() {

    const value = taskInput?.value.trim();

    if (!value) return;

    roadmapTasks.unshift({
        id: Date.now(),
        text: value,
        completed: false
    });

    saveTasks();
    taskInput.value = "";
    displayTasks();
}

/* ---------- Event Listeners ---------- */

addTaskBtn?.addEventListener("click", addTask);

taskInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

taskList?.addEventListener("click", event => {

    const id = Number(event.target.dataset.id);
    if (!id) return;

    switch (true) {

        case event.target.classList.contains("delete-btn"):

            roadmapTasks = roadmapTasks.filter(task => task.id !== id);
            break;

        case event.target.classList.contains("toggle-check"):

            roadmapTasks = roadmapTasks.map(task =>
                task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            );
            break;

        default:
            return;
    }

    saveTasks();
    displayTasks();
});

/* ---------- Initial Load ---------- */

loadTasks();
displayTasks();
});