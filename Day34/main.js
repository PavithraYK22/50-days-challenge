// ==========================================
// DAY 33: MAIN JAVASCRIPT
// CLIENT-SIDE CACHING
// ==========================================

import { fetchUserData } from "./api.js";

import {
    displayUserProfile,
    showLoading,
    showError
} from "./ui.js";


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const usernameInput = document.getElementById(
    "github-username"
);


// ==========================================
// CHECK INPUT ELEMENT
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
            const user = await fetchUserData(username);


            // Display user
            displayUserProfile(user);

        } catch (error) {

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

            timeoutId = setTimeout(() => {

                func.apply(this, args);

            }, delay);
        };
    }


    // ==========================================
    // REAL-TIME SEARCH
    // ==========================================

    const debouncedSearch = debounce(
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