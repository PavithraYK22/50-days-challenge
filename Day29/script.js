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