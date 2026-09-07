// ==========================================
// DAY 33: USER INTERFACE
// ==========================================


// ==========================================
// DISPLAY USER PROFILE
// ==========================================

export function displayUserProfile(user) {

    const profileCard = document.getElementById("dev-profile-card");

    if (!profileCard) {
        console.error("Profile card element not found.");
        return;
    }


    profileCard.innerHTML = `
        <div class="github-profile-card">

            <img 
                src="${user.avatar_url}" 
                alt="${user.login}"
                class="github-avatar"
            >

            <div class="github-profile-info">

                <h2>${user.name || user.login}</h2>

                <p class="github-username">
                    @${user.login}
                </p>

                <p class="github-bio">
                    ${user.bio || "No bio available."}
                </p>

                <div class="github-stats">

                    <div>
                        <strong>${user.followers}</strong>
                        <span>Followers</span>
                    </div>

                    <div>
                        <strong>${user.following}</strong>
                        <span>Following</span>
                    </div>

                    <div>
                        <strong>${user.public_repos}</strong>
                        <span>Repositories</span>
                    </div>

                </div>

                <a 
                    href="${user.html_url}" 
                    target="_blank"
                    rel="noopener noreferrer"
                    class="github-profile-link"
                >
                    View GitHub Profile
                </a>

            </div>

        </div>
    `;
}


// ==========================================
// SHOW LOADING MESSAGE
// ==========================================

export function showLoading() {

    const profileCard = document.getElementById(
        "dev-profile-card"
    );

    if (!profileCard) return;

    profileCard.innerHTML = `
        <div class="loading-message">
            <p>🔄 Loading developer...</p>
        </div>
    `;
}


// ==========================================
// SHOW ERROR MESSAGE
// ==========================================

export function showError(message) {

    const profileCard = document.getElementById(
        "dev-profile-card"
    );

    if (!profileCard) return;

    profileCard.innerHTML = `
        <div class="error-message">
            <p>❌ ${message}</p>
        </div>
    `;
}

// ==========================================
// SYNEXUS COMMUNITY
// Day 34: Network Resilience
// Retries & Exponential Backoff
// ==========================================


// ------------------------------------------
// Day 34: Fetch With Retry
// ------------------------------------------

export async function fetchWithRetry(
    url,
    options = {},
    retries = 3,
    backoff = 500
) {

    // --------------------------------------
    // Bonus: Check Internet Connection
    // --------------------------------------

    if (!navigator.onLine) {
        throw new Error("No internet connection detected");
    }


    // --------------------------------------
    // Retry Loop
    // --------------------------------------

    for (let i = 0; i < retries; i++) {

        try {

            console.log(
                `Fetch attempt ${i + 1} of ${retries}`
            );


            // ----------------------------------
            // Make Network Request
            // ----------------------------------

            const response = await fetch(url, options);


            // ----------------------------------
            // Do NOT Retry 400-Level Errors
            // ----------------------------------

            if (
                response.status >= 400 &&
                response.status < 500
            ) {

                throw new Error(
                    `Request failed with status ${response.status}`
                );

            }


            // ----------------------------------
            // Successful Response
            // ----------------------------------

            if (response.ok) {

                console.log("Request successful!");

                return response;

            }


            // ----------------------------------
            // Server Error
            // ----------------------------------

            throw new Error(
                `Server error: ${response.status}`
            );

        }


        // --------------------------------------
        // Catch Failed Request
        // --------------------------------------

        catch (error) {

            console.log(
                `Attempt ${i + 1} failed:`,
                error.message
            );


            // ----------------------------------
            // Last Attempt
            // ----------------------------------

            if (i === retries - 1) {

                console.log(
                    "All retry attempts failed."
                );

                throw error;

            }


            // ----------------------------------
            // Wait Before Retrying
            // ----------------------------------

            console.log(
                `Retrying in ${backoff}ms...`
            );


            await new Promise(
                resolve => setTimeout(resolve, backoff)
            );


            // ----------------------------------
            // Exponential Backoff
            // ----------------------------------

            backoff *= 2;

        }
    }
}