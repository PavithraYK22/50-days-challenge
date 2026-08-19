document.addEventListener("DOMContentLoaded", () => {

    /* ========================================== */
    /* DAY 26: ASYNCHRONOUS JAVASCRIPT & FETCH API */
    /* DAY 27: ARRAY ITERATION & DYNAMIC FEEDS    */
    /* ========================================== */

    const searchBtn = document.getElementById("search-dev-btn");
    const usernameInput = document.getElementById("github-username");
    const profileCard = document.getElementById("dev-profile-card");
    const reposGrid = document.getElementById("repos-grid");


    /* ========================================== */
    /* CHECK REQUIRED HTML ELEMENTS                */
    /* ========================================== */

    if (!searchBtn || !usernameInput || !profileCard || !reposGrid) {
        console.error("Required GitHub search elements are missing from HTML.");
        return;
    }


    /* ========================================== */
    /* DAY 27: FETCH GITHUB REPOSITORIES           */
    /* ========================================== */

    async function fetchRepositories(username) {

        try {

            // Fetch latest 6 repositories
            const response = await fetch(
                `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`
            );

            // Check if request was successful
            if (!response.ok) {
                throw new Error("Unable to fetch repositories.");
            }

            // Convert response into JavaScript array
            const data = await response.json();

            console.log("Repositories:", data);

            // Clear previous repositories
            reposGrid.innerHTML = "";

            // Check if user has no public repositories
            if (data.length === 0) {

                reposGrid.innerHTML = `
                    <div class="repo-empty-state">
                        <p>No public repositories found.</p>
                    </div>
                `;

                return;
            }


            /* ========================================== */
            /* ARRAY ITERATION                             */
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
    /* DAY 26: FETCH GITHUB DEVELOPER PROFILE      */
    /* ========================================== */

    async function getDeveloperProfile(username) {

        // Remove unnecessary spaces
        username = username.trim();


        /* ========================================== */
        /* CHECK EMPTY INPUT                          */
        /* ========================================== */

        if (!username) {

            profileCard.innerHTML = `
                <div class="github-message error">
                    <p>⚠️ Please enter a GitHub username.</p>
                </div>
            `;

            reposGrid.innerHTML = "";

            return;
        }


        /* ========================================== */
        /* SHOW LOADING STATE                         */
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
            /* REQUEST GITHUB API                         */
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

                if (response.status === 403) {
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
    /* BUTTON EVENT                               */
    /* ========================================== */

    searchBtn.addEventListener("click", () => {

        const username = usernameInput.value;

        getDeveloperProfile(username);

    });


    /* ========================================== */
    /* ENTER KEY SUPPORT                          */
    /* ========================================== */

    usernameInput.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            const username = usernameInput.value;

            getDeveloperProfile(username);
        }

    });

});