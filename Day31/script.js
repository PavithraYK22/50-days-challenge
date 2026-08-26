document.addEventListener("DOMContentLoaded", () => {

    /* ========================================== */
    /* DAY 28: DEBOUNCE FUNCTION                  */
    /* ========================================== */

    function debounce(func, delay) {
        let timeoutId;

        return function (...args) {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }


    /* ========================================== */
    /* GET HTML ELEMENTS                          */
    /* ========================================== */

    const usernameInput = document.getElementById("github-username");
    const profileCard = document.getElementById("dev-profile-card");
    const reposGrid = document.getElementById("repos-grid");


    /* ========================================== */
    /* CHECK REQUIRED HTML ELEMENTS               */
    /* ========================================== */

    if (!usernameInput || !profileCard || !reposGrid) {
        console.error("GitHub search elements are missing from HTML.");
        return;
    }


    /* ========================================== */
    /* DAY 27: FETCH GITHUB REPOSITORIES          */
    /* ========================================== */

    async function fetchRepositories(username) {

        username = username.trim();

        if (!username) {
            reposGrid.innerHTML = "";
            return;
        }

        try {

            const response = await fetch(
                `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`
            );


            /* ========================================== */
            /* HANDLE API ERRORS                          */
            /* ========================================== */

            if (response.status === 403 || response.status === 429) {
                throw new Error(
                    "GitHub API rate limit exceeded. Please wait a moment."
                );
            }

            if (!response.ok) {
                throw new Error("Unable to load repositories.");
            }


            /* ========================================== */
            /* CONVERT RESPONSE TO JSON                   */
            /* ========================================== */

            const data = await response.json();

            console.log("Repositories:", data);


            /* ========================================== */
            /* CLEAR OLD REPOSITORIES                    */
            /* ========================================== */

            reposGrid.innerHTML = "";


            /* ========================================== */
            /* CHECK FOR NO REPOSITORIES                 */
            /* ========================================== */

            if (data.length === 0) {

                reposGrid.innerHTML = `
                    <div class="repo-empty-state">
                        <p>No public repositories found.</p>
                    </div>
                `;

                return;
            }


            /* ========================================== */
            /* ARRAY ITERATION                            */
            /* ========================================== */

            data.forEach((repo) => {

                const repoCard = document.createElement("div");

                repoCard.className = "repo-card";


                repoCard.innerHTML = `
                    <h3>${repo.name}</h3>

                    <p>
                        ${repo.description || "No description provided."}
                    </p>

                    <a
                        href="${repo.html_url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="repo-link"
                    >
                        View Repository →
                    </a>
                `;


                reposGrid.appendChild(repoCard);
            });


        } catch (error) {

            console.error("Repository API Error:", error);

            reposGrid.innerHTML = `
                <div class="repo-empty-state">
                    <p>Unable to load repositories.</p>
                </div>
            `;
        }
    }


    /* ========================================== */
    /* DAY 26: FETCH GITHUB DEVELOPER PROFILE     */
    /* ========================================== */

    async function getDeveloperProfile(username) {

        username = username.trim();


        /* ========================================== */
        /* EMPTY INPUT                                */
        /* ========================================== */

        if (!username) {

            profileCard.innerHTML = `
                <div class="github-message">
                    <p>🔍 Start typing a GitHub username...</p>
                </div>
            `;

            reposGrid.innerHTML = "";

            return;
        }


        /* ========================================== */
        /* LOADING STATE                              */
        /* ========================================== */

        profileCard.innerHTML = `
            <div class="github-message loading">
                <div class="loader"></div>
                <p>Fetching GitHub profile...</p>
            </div>
        `;

        reposGrid.innerHTML = "";


        try {

            /* ========================================== */
            /* FETCH GITHUB PROFILE                      */
            /* ========================================== */

            const response = await fetch(
                `https://api.github.com/users/${encodeURIComponent(username)}`
            );


            /* ========================================== */
            /* HANDLE API ERRORS                          */
            /* ========================================== */

            if (!response.ok) {

                if (response.status === 404) {
                    throw new Error("GitHub user not found.");
                }

                if (
                    response.status === 403 ||
                    response.status === 429
                ) {
                    throw new Error(
                        "GitHub API rate limit exceeded. Please try again later."
                    );
                }

                throw new Error(
                    `GitHub API error: ${response.status}`
                );
            }


            /* ========================================== */
            /* CONVERT RESPONSE TO JSON                   */
            /* ========================================== */

            const data = await response.json();


            /* ========================================== */
            /* GET PROFILE INFORMATION                    */
            /* ========================================== */

            const avatar = data.avatar_url;
            const name = data.name || data.login;
            const bio = data.bio || "No bio available.";
            const login = data.login;


            /* ========================================== */
            /* DISPLAY PROFILE                            */
            /* ========================================== */

            profileCard.innerHTML = `
                <div class="github-profile-card">

                    <img
                        src="${avatar}"
                        alt="${name}'s GitHub profile picture"
                        class="github-avatar"
                    >

                    <div class="github-profile-info">

                        <h3>${name}</h3>

                        <p class="github-username">
                            @${login}
                        </p>

                        <p class="github-bio">
                            ${bio}
                        </p>

                        <a
                            href="${data.html_url}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="github-profile-link"
                        >
                            View GitHub Profile →
                        </a>

                    </div>

                </div>
            `;


            /* ========================================== */
            /* FETCH REPOSITORIES                         */
            /* ========================================== */

            await fetchRepositories(username);


        } catch (error) {

            console.error("GitHub API Error:", error);

            profileCard.innerHTML = `
                <div class="github-message error">

                    <h3>Unable to find profile</h3>

                    <p>${error.message}</p>

                    <small>
                        Please check the username and try again.
                    </small>

                </div>
            `;

            reposGrid.innerHTML = "";
        }
    }


    /* ========================================== */
    /* DAY 28: REAL-TIME SEARCH                    */
    /* ========================================== */

    const handleSearch = debounce(() => {

        const username = usernameInput.value.trim();

        getDeveloperProfile(username);

    }, 500);


    /* ========================================== */
    /* INPUT EVENT                                */
    /* ========================================== */

    usernameInput.addEventListener(
        "input",
        handleSearch
    );


});

/* ========================================== */
/* DAY 29: TWO-WAY DATA STREAMS - POST       */
/* ========================================== */

const proposalForm = document.getElementById("proposal-form");

const titleInput = document.getElementById("initiative-title");

const descriptionInput =
    document.getElementById("initiative-description");

const submitBtn =
    document.getElementById("proposal-submit-btn");

const proposalMessage =
    document.getElementById("proposal-message");

    async function submitProposal(newInitiative) {

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {

        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts",
            {
                method: "POST",

                headers: {
                    "Content-type":
                        "application/json; charset=UTF-8"
                },

                body: JSON.stringify(newInitiative)
            }
        );

        const data = await response.json();

        console.log("Server Response:", data);

        if (response.status === 201) {

            proposalMessage.textContent =
                "✅ Initiative submitted successfully!";

            proposalMessage.className =
                "success-message";

            proposalForm.reset();

        } else {

            throw new Error(
                "Failed to submit initiative."
            );

        }

    } catch (error) {

        console.error("Error:", error);

        proposalMessage.textContent =
            "❌ Something went wrong. Please try again.";

        proposalMessage.className =
            "error-message";

    } finally {

        submitBtn.disabled = false;

        submitBtn.textContent =
            "Submit Initiative";
    }
}

proposalForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const newInitiative = {

        title: titleInput.value.trim(),

        body: descriptionInput.value.trim(),

        userId: 1
    };

    console.log("Sending:", newInitiative);

    submitProposal(newInitiative);
});

/* ========================================== */
/* DAY 30: PUT & DELETE REQUESTS              */
/* ========================================== */

async function updateInitiative(id) {
    try {
        const response = await fetch(
            'https://jsonplaceholder.typicode.com/posts/' + id,
            {
                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    id: id,
                    title: 'Updated Initiative [UPDATED]',
                    body: 'This initiative has been updated successfully.',
                    userId: 1
                })
            }
        );

        const data = await response.json();

        console.log('PUT Response:', data);

    } catch (error) {
        console.error('PUT Error:', error);
    }
}


async function deleteInitiative(id) {
    try {
        const response = await fetch(
            'https://jsonplaceholder.typicode.com/posts/' + id,
            {
                method: 'DELETE'
            }
        );

        const data = await response.json();

        console.log('DELETE Response:', data);
        console.log('Initiative deleted successfully!');

    } catch (error) {
        console.error('DELETE Error:', error);
    }
}


/* Button selection */

const updateBtn = document.getElementById('update-btn');
const deleteBtn = document.getElementById('delete-btn');


/* Update button */

updateBtn.addEventListener('click', () => {
    updateInitiative(1);
});


/* Delete button */

deleteBtn.addEventListener('click', () => {

    const confirmed = window.confirm(
        'Are you sure you want to delete this initiative? This action cannot be undone.'
    );

    if (confirmed) {
        deleteInitiative(1);
    }

});

/* ==========================================
   DAY 31: SYNEXUS COMMUNITY
   PAGINATION & INFINITE SCROLL
   ========================================== */

let currentPage = 1;
const limit = 6;
let isLoading = false;
let hasMoreData = true;

const dataFeed = document.getElementById("data-feed");
const scrollSentinel = document.getElementById("scroll-sentinel");


/* ==========================================
   SYNEXUS COMMUNITY DATA
   ========================================== */

const synexusUpdates = [
    {
        title: "Welcome to Synexus Community",
        category: "Community",
        content:
            "Synexus is a collaborative engineering community where developers can share ideas, build technical projects, and learn from one another."
    },
    {
        title: "Building Better Software Together",
        category: "Development",
        content:
            "Great software is created through collaboration. Synexus encourages developers to exchange knowledge, review ideas, and solve technical problems together."
    },
    {
        title: "Modern Web Development",
        category: "Technology",
        content:
            "Modern web applications combine HTML, CSS, JavaScript, APIs, asynchronous programming, and responsive user interfaces to create powerful digital experiences."
    },
    {
        title: "Developer Knowledge Sharing",
        category: "Learning",
        content:
            "Sharing technical knowledge helps developers improve faster. Community members can discuss programming concepts, development practices, and useful resources."
    },
    {
        title: "Open Source Collaboration",
        category: "Open Source",
        content:
            "Open source projects provide developers with opportunities to collaborate, contribute code, review changes, and learn how real-world software projects are maintained."
    },
    {
        title: "Innovation Through Technology",
        category: "Innovation",
        content:
            "Synexus encourages innovative thinking by bringing developers together to explore new technologies and transform ideas into practical technical solutions."
    },
    {
        title: "API Development and Integration",
        category: "Backend",
        content:
            "APIs allow different applications and services to communicate with each other. Understanding REST APIs and asynchronous requests is an important skill for modern developers."
    },
    {
        title: "Frontend Engineering",
        category: "Frontend",
        content:
            "Frontend engineering focuses on creating interactive and accessible user experiences using technologies such as HTML, CSS, and JavaScript."
    },
    {
        title: "Learning Through Projects",
        category: "Projects",
        content:
            "Building practical projects is one of the best ways to strengthen programming skills. Synexus encourages developers to learn concepts by applying them to real applications."
    },
    {
        title: "The Future of Software Development",
        category: "Technology",
        content:
            "Software development continues to evolve rapidly. Developers who continuously learn, experiment, and collaborate can adapt to new tools and technologies."
    },
    {
        title: "Community Driven Engineering",
        category: "Community",
        content:
            "A strong engineering community helps developers learn from different perspectives, exchange experiences, and work together toward better technical solutions."
    },
    {
        title: "Building Technical Confidence",
        category: "Learning",
        content:
            "Consistent practice, debugging real problems, and completing projects can help developers build confidence and become stronger problem solvers."
    }
];


/* ==========================================
   FETCH NEXT PAGE
   ========================================== */

async function fetchNextPage() {

    if (isLoading || !hasMoreData) {
        return;
    }

    isLoading = true;

    scrollSentinel.textContent = "Loading more updates...";

    try {

        /*
         * Simulating a paginated API request.
         * Each page contains 6 Synexus updates.
         */

        await new Promise(resolve => setTimeout(resolve, 500));

        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;

        const data = synexusUpdates.slice(startIndex, endIndex);


        /* ==========================================
           CHECK IF DATA IS FINISHED
           ========================================== */

        if (data.length === 0) {

            hasMoreData = false;

            scrollSentinel.textContent =
                "You've reached the end of Synexus updates.";

            observer.disconnect();

            return;
        }


        /* ==========================================
           RENDER SYNEXUS UPDATES
           ========================================== */

        data.forEach(update => {

            dataFeed.innerHTML += `

                <article class="synexus-update-card">

                    <div class="update-category">
                        ${update.category}
                    </div>

                    <h3>
                        ${update.title}
                    </h3>

                    <p>
                        ${update.content}
                    </p>

                    <div class="update-footer">
                        Synexus Community
                    </div>

                </article>

            `;

        });


        /*
         * If fewer than 6 items were returned,
         * there is no more data.
         */

        if (data.length < limit) {

            hasMoreData = false;

            scrollSentinel.textContent =
                "You've reached the end of Synexus updates.";

            observer.disconnect();

            return;
        }


        scrollSentinel.textContent =
            "Scroll for more updates...";


    } catch (error) {

        console.error(
            "Error loading Synexus updates:",
            error
        );

        scrollSentinel.textContent =
            "Unable to load updates. Please try again.";

    } finally {

        isLoading = false;

    }
}


/* ==========================================
   INTERSECTION OBSERVER
   ========================================== */

const observer = new IntersectionObserver(
    (entries) => {

        const entry = entries[0];

        if (entry.isIntersecting) {

            currentPage++;

            fetchNextPage();

        }

    },
    {
        root: null,
        rootMargin: "200px",
        threshold: 0
    }
);


/* ==========================================
   START OBSERVING
   ========================================== */

observer.observe(scrollSentinel);


/* ==========================================
   LOAD FIRST PAGE
   ========================================== */

fetchNextPage();