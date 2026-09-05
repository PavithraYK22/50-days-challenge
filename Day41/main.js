// ==========================================
// SYNEXUS COMMUNITY
// Day 37: Main JavaScript
// ==========================================


// ------------------------------------------
// Import API Functions
// ------------------------------------------

import {
    fetchUserData,
    secureDeleteResource,
    fetchDashboardData
} from "./api.js";


import {
    sendLiveMessage
} from "./websocket.js";


import {
    getOfflineData
} from "./db.js";


// ------------------------------------------
// Import Utility Functions
// ------------------------------------------

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

    if (!profileCard) {
        return;
    }

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

    if (!reposGrid) {
        return;
    }

    reposGrid.innerHTML = "";


    if (!repositories || repositories.length === 0) {

        reposGrid.innerHTML =
            "<p>No repositories found.</p>";

        return;
    }


    repositories.forEach(function (repo) {

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
                ⭐ ${repo.stargazers_count || 0}
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
// DAY 37: PARALLEL DASHBOARD SEARCH
// ==========================================

async function searchDeveloper(username) {

    username = username.trim();


    // --------------------------------------
    // Empty Username
    // --------------------------------------

    if (!username) {

        if (profileCard) {
            profileCard.innerHTML = "";
        }

        if (reposGrid) {
            reposGrid.innerHTML = "";
        }


        // Day 36: Remove user from URL

        const url =
            new URL(window.location.href);

        url.searchParams.delete("user");

        window.history.pushState(
            {},
            "",
            url
        );

        return;
    }


    // --------------------------------------
    // Loading Messages
    // --------------------------------------

    if (profileCard) {

        profileCard.innerHTML =
            "<p>Loading developer...</p>";

    }


    if (reposGrid) {

        reposGrid.innerHTML =
            "<p>Loading repositories...</p>";

    }


    try {

        console.log(
            "Day 37: Starting parallel requests..."
        );


        // ======================================
        // DAY 37
        // All three requests are started
        // without await
        // ======================================

        const dashboardData =
            await fetchDashboardData(username);


        // ======================================
        // Extract the three results
        // ======================================

        const profile =
            dashboardData.profile;

        const repos =
            dashboardData.repos;

        const followers =
            dashboardData.followers;


        // ======================================
        // DAY 36: UPDATE URL
        // ======================================

        const url =
            new URL(window.location.href);

        url.searchParams.set(
            "user",
            username
        );

        window.history.pushState(
            {},
            "",
            url
        );


        // ======================================
        // DISPLAY PROFILE
        // ======================================

        displayDeveloperProfile(
            profile
        );


        // ======================================
        // DISPLAY REPOSITORIES
        // ======================================

        displayRepositories(
            repos
        );


        // ======================================
        // DISPLAY FOLLOWERS INFORMATION
        // ======================================

        console.log(
            "Followers:",
            followers
        );

        console.log(
            "Followers count:",
            followers.length
        );


        console.log(
            "Day 37: All dashboard data loaded successfully."
        );

    }


    catch (error) {

        console.error(
            "Day 37 Dashboard Error:",
            error
        );


        if (profileCard) {

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

        }


        if (reposGrid) {
            reposGrid.innerHTML = "";
        }

    }
}


// ==========================================
// DAY 33 + DAY 34
// CLIENT-SIDE CACHE + DEBOUNCE
// ==========================================

function debounce(func, delay) {

    let timeoutId;


    return function () {

        const args = arguments;


        clearTimeout(
            timeoutId
        );


        timeoutId =
            setTimeout(
                function () {

                    func.apply(
                        null,
                        args
                    );

                },
                delay
            );

    };
}


// ==========================================
// SEARCH USER WITH CACHE
// ==========================================

async function searchUserWithCache(username) {

    username = username.trim();


    if (!username) {
        return;
    }


    try {

        console.log(
            "Checking cached user data..."
        );


        const user =
            await fetchUserData(
                username
            );


        console.log(
            "Cached user data loaded."
        );


        // We don't replace the Day 37 dashboard
        // with the cached profile here.
        // Day 37 handles the complete dashboard.

    }


    catch (error) {

        console.error(
            "Cached user request failed:",
            error
        );

    }
}


// ==========================================
// DAY 37 REAL-TIME SEARCH
// ==========================================

if (usernameInput) {

    const debouncedDashboardSearch =
        debounce(
            searchDeveloper,
            600
        );


    usernameInput.addEventListener(
        "input",
        function () {

            const username =
                usernameInput.value.trim();


            if (!username) {

                if (profileCard) {
                    profileCard.innerHTML = "";
                }

                if (reposGrid) {
                    reposGrid.innerHTML = "";
                }


                const url =
                    new URL(
                        window.location.href
                    );

                url.searchParams.delete(
                    "user"
                );

                window.history.pushState(
                    {},
                    "",
                    url
                );

                return;
            }


            debouncedDashboardSearch(
                username
            );

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


// ==========================================
// DAY 36: READ USERNAME FROM URL
// ==========================================

function initializeFromURL() {

    if (!usernameInput) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const user =
        params.get("user");


    if (user) {

        usernameInput.value =
            user;


        searchDeveloper(
            user
        );

    }
}


// ==========================================
// INITIALIZE APPLICATION
// ==========================================

initializeFromURL();


// ==========================================
// DAY 38: WEBSOCKET UI
// ==========================================

const wsInput =
    document.getElementById("ws-input");

const wsSendButton =
    document.getElementById("ws-send");


// ------------------------------------------
// Send Button
// ------------------------------------------

if (wsSendButton && wsInput) {

    wsSendButton.addEventListener(
        "click",
        () => {

            const message =
                wsInput.value.trim();


            if (!message) {
                return;
            }


            sendLiveMessage(
                message
            );


            wsInput.value = "";

            wsInput.focus();

        }
    );

}


// ------------------------------------------
// Enter Key Support
// ------------------------------------------

if (wsInput) {

    wsInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();


                if (wsSendButton) {
                    wsSendButton.click();
                }

            }

        }
    );

}


// ==========================================
// DAY 39: SERVICE WORKER REGISTRATION
// ==========================================

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("/sw.js")
                .then(
                    (registration) => {

                        console.log(
                            "Service Worker registered successfully:",
                            registration.scope
                        );

                    }
                )
                .catch(
                    (error) => {

                        console.error(
                            "Service Worker registration failed:",
                            error
                        );

                    }
                );

        }
    );

}


// ==========================================
// DAY 40: INDEXEDDB OFFLINE DATA
// ==========================================


// ------------------------------------------
// Get Offline Data When Back Online
// ------------------------------------------

window.addEventListener(
    "online",
    async () => {

        console.log(
            "Day 40: Internet connection restored."
        );


        try {

            const offlineData =
                await getOfflineData();


            console.log(
                "Day 40: Offline data waiting for synchronization:",
                offlineData
            );


        }

        catch (error) {

            console.error(
                "Day 40: Unable to retrieve offline data:",
                error
            );

        }

    }
);

// ==========================================
// DAY 40: INITIALIZE INDEXEDDB
// ==========================================

getOfflineData()
    .then((data) => {

        console.log(
            "Day 40: IndexedDB initialized."
        );

        console.log(
            "Currently stored offline data:",
            data
        );

    })
    .catch((error) => {

        console.error(
            "Day 40: IndexedDB initialization failed:",
            error
        );

    });

    // ==========================================
// SYNEXUS COMMUNITY
// Day 41: Web Workers
// ==========================================

// ------------------------------------------
// Create Web Worker
// ------------------------------------------

let myWorker = new Worker("./worker.js");


// ------------------------------------------
// Get DOM Elements
// ------------------------------------------

const processBtn = document.getElementById("process-btn");
const cancelBtn = document.getElementById("cancel-btn");
const workerStatus = document.getElementById("worker-status");


// ------------------------------------------
// Run Heavy Process
// ------------------------------------------

if (processBtn) {

    processBtn.addEventListener("click", function () {

        workerStatus.textContent = "Processing in background...";

        console.log("Main thread: Sending START to worker");

        // Send message to worker
        myWorker.postMessage("START");
    });
}


// ------------------------------------------
// Receive Result From Worker
// ------------------------------------------

myWorker.onmessage = function (e) {

    console.log("Result:", e.data);

    workerStatus.textContent =
        "Process completed! Result: " + e.data;
};


// ------------------------------------------
// Handle Worker Errors
// ------------------------------------------

myWorker.onerror = function (error) {

    console.error("Worker Error:", error);

    workerStatus.textContent =
        "An error occurred while processing.";
};


// ------------------------------------------
// Cancel Worker
// ------------------------------------------

if (cancelBtn) {

    cancelBtn.addEventListener("click", function () {

        myWorker.terminate();

        workerStatus.textContent =
            "Process cancelled.";

        console.log("Worker terminated");
    });
}