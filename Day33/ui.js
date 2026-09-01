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