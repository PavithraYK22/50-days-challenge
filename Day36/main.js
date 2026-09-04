
// ==========================================
// SYNEXUS COMMUNITY
// Day 35: Main JavaScript
// ==========================================


// ------------------------------------------
// Import API Functions
// ------------------------------------------

import {
    getDeveloperProfile,
    getDeveloperRepositories,
    fetchUserData,
    secureDeleteResource
} from "./api.js";


import {
    displayUserProfile,
    showLoading,
    showError
} from "./utils.js";


// ------------------------------------------
// DOM Elements
// ------------------------------------------

const usernameInput =
    document.getElementById("github-username");

const profileCard =
    document.getElementById("dev-profile-card");

const reposGrid =
    document.getElementById("repos-grid");


// ==========================================
// DISPLAY DEVELOPER PROFILE
// ==========================================

function displayDeveloperProfile(data) {

    profileCard.innerHTML = `

        <div class="github-profile-card">

            <img
                src="${data.avatar_url}"
                alt="${data.login}"
                class="github-avatar"
            >

            <div class="github-profile-info">

                <h3>
                    ${data.name || data.login}
                </h3>

                <p>
                    @${data.login}
                </p>

                <p>
                    ${data.bio || "No bio available."}
                </p>

                <a
                    href="${data.html_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View GitHub Profile
                </a>

            </div>

        </div>

    `;
}


// ==========================================
// DISPLAY REPOSITORIES
// ==========================================

function displayRepositories(repositories) {

    reposGrid.innerHTML = "";


    if (repositories.length === 0) {

        reposGrid.innerHTML =
            "<p>No repositories found.</p>";

        return;
    }


    repositories.forEach(repo => {

        const repoCard =
            document.createElement("div");


        repoCard.className =
            "initiative-card";


        repoCard.innerHTML = `

            <h3>
                ${repo.name}
            </h3>

            <p>
                ${repo.description || "No description available."}
            </p>

            <p>
                ⭐ ${repo.stargazers_count}
            </p>

            <a
                href="${repo.html_url}"
                target="_blank"
                rel="noopener noreferrer"
            >
                View Repository
            </a>

        `;


        reposGrid.appendChild(repoCard);

    });
}


// ==========================================
// SEARCH DEVELOPER
// ==========================================

async function searchDeveloper(username) {

    if (!username.trim()) {

    profileCard.innerHTML = "";

    reposGrid.innerHTML = "";

    // Day 36: Remove user from URL
    const url = new URL(window.location);

    url.searchParams.delete("user");

    window.history.pushState({}, "", url);

    return;
}

    // --------------------------------------
    // Loading Message
    // --------------------------------------

    profileCard.innerHTML =
        "<p>Loading developer...</p>";

    reposGrid.innerHTML =
        "<p>Loading repositories...</p>";


    try {

        console.log(
            "Starting developer search..."
        );


        // ----------------------------------
        // Get Profile
        // ----------------------------------

        const profile =
    await getDeveloperProfile(username);


// ==========================================
// DAY 36: UPDATE URL
// ==========================================

const url = new URL(window.location);

url.searchParams.set("user", username);

window.history.pushState({}, "", url);


displayDeveloperProfile(profile);

        // ----------------------------------
        // Get Repositories
        // ----------------------------------

        const repositories =
            await getDeveloperRepositories(username);


        displayRepositories(repositories);


        console.log(
            "Developer data loaded successfully."
        );

    }


    catch (error) {

        console.error(error);


        profileCard.innerHTML = `

            <div class="error-message">

                <p>
                    Unable to load developer data.
                </p>

                <p>
                    ${error.message}
                </p>

            </div>

        `;


        reposGrid.innerHTML = "";

    }
}


// ==========================================
// DAY 34: REAL-TIME SEARCH
// ==========================================

let searchTimeout;


if (usernameInput) {

    usernameInput.addEventListener(
        "input",
        function () {

            clearTimeout(searchTimeout);


            const username =
                usernameInput.value;


            searchTimeout =
                setTimeout(() => {

                    searchDeveloper(username);

                }, 500);

        }
    );

}


// ==========================================
// DAY 33: CLIENT-SIDE CACHING
// ==========================================

if (!usernameInput) {

    console.error(
        "GitHub username input was not found."
    );

} else {


    // ==========================================
    // SEARCH USER
    // ==========================================

    async function searchUser(username) {

        username = username.trim();


        // Don't search empty input
        if (!username) {
            return;
        }


        // Show loading message
        showLoading();


        try {

            // Fetch user data
            // api.js handles the cache
            const user =
                await fetchUserData(username);


            // Display user
            displayUserProfile(user);

        }


        catch (error) {

            console.error(error);

            showError(error.message);

        }
    }


    // ==========================================
    // DEBOUNCE FUNCTION
    // ==========================================

    function debounce(func, delay) {

        let timeoutId;


        return function (...args) {

            clearTimeout(timeoutId);


            timeoutId =
                setTimeout(() => {

                    func.apply(this, args);

                }, delay);

        };
    }


    // ==========================================
    // REAL-TIME SEARCH
    // ==========================================

    const debouncedSearch =
        debounce(
            searchUser,
            600
        );


    usernameInput.addEventListener(
        "input",
        () => {

            const username =
                usernameInput.value.trim();


            if (!username) {

                const profileCard =
                    document.getElementById(
                        "dev-profile-card"
                    );


                if (profileCard) {

                    profileCard.innerHTML = "";

                }

                return;
            }


            debouncedSearch(username);

        }
    );

}


// ==========================================
// DAY 35: SECURE DELETE TEST
// ==========================================

async function testSecureDelete() {

    try {

        const response =
            await secureDeleteResource(1);


        console.log(
            "Day 35: Resource deleted successfully."
        );


        console.log(
            "Response status:",
            response.status
        );

    }


    catch (error) {

        console.error(
            "Day 35:",
            error.message
        );

    }
}


// ==========================================
// RUN DAY 35 TEST
// ==========================================

testSecureDelete();

// Day 36: Read username from URL
function initializeFromURL() {
    const params = new URLSearchParams(window.location.search);

    const user = params.get("user");

    if (user) {
        usernameInput.value = user;
        searchDeveloper(user);
    }
}

initializeFromURL();