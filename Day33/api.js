// ==========================================
// DAY 33: CLIENT-SIDE CACHING
// ==========================================

// Create an in-memory cache
const userCache = new Map();


// ==========================================
// FETCH USER DATA
// ==========================================

export async function fetchUserData(username) {

    // Remove unnecessary spaces
    username = username.trim();

    // Stop if username is empty
    if (!username) {
        throw new Error("Please enter a username.");
    }


    // ==========================================
    // STEP 1: CHECK CACHE
    // ==========================================

    if (userCache.has(username)) {

        console.log("Serving from cache!");

        // Return saved data immediately
        return userCache.get(username);
    }


    // ==========================================
    // STEP 2: FETCH FROM GITHUB API
    // ==========================================

    console.log("Fetching from GitHub API...");

    const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}`
    );


    // ==========================================
    // STEP 3: CHECK API RESPONSE
    // ==========================================

    if (!response.ok) {

        if (response.status === 404) {
            throw new Error("GitHub user not found.");
        }

        throw new Error(
            `GitHub API error: ${response.status}`
        );
    }


    // ==========================================
    // STEP 4: CONVERT RESPONSE TO JSON
    // ==========================================

    const data = await response.json();


    // ==========================================
    // STEP 5: SAVE SUCCESSFUL DATA TO CACHE
    // ==========================================

    userCache.set(username, data);


    console.log("Data saved to cache.");


    // ==========================================
    // STEP 6: RETURN DATA
    // ==========================================

    return data;
}