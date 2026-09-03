// ==========================================
// DAY 33: CLIENT-SIDE CACHING
// ==========================================

export async function fetchUserData(username) {

    const cacheKey = `github_user_${username}`;

    // Check cache
    const cachedData =
        localStorage.getItem(cacheKey);

    if (cachedData) {

        console.log(
            "Using cached user data."
        );

        return JSON.parse(cachedData);
    }


    // Fetch from GitHub API
    const response =
        await fetch(
            `https://api.github.com/users/${encodeURIComponent(username)}`
        );


    if (!response.ok) {

        throw new Error(
            `Failed to fetch user: ${response.status}`
        );
    }


    const data =
        await response.json();


    // Save to cache
    localStorage.setItem(
        cacheKey,
        JSON.stringify(data)
    );


    console.log(
        "User data fetched from API and cached."
    );


    return data;
}
// ==========================================
// SYNEXUS COMMUNITY
// Day 34: API Layer
// ==========================================


// ------------------------------------------
// Import Retry Utility
// ------------------------------------------

import { fetchWithRetry } from "./utils.js";


// ------------------------------------------
// GitHub API Base URL
// ------------------------------------------

const GITHUB_API = "https://api.github.com";


// ==========================================
// GET DEVELOPER PROFILE
// ==========================================

export async function getDeveloperProfile(username) {

    try {

        const url =
            `${GITHUB_API}/users/${encodeURIComponent(username)}`;


        console.log("Fetching developer profile...");


        // ----------------------------------
        // Fetch With Retry
        // ----------------------------------

        const response = await fetchWithRetry(url);


        // ----------------------------------
        // Convert Response To JSON
        // ----------------------------------

        const data = await response.json();


        return data;

    }

    catch (error) {

        console.error(
            "Unable to fetch developer profile:",
            error
        );

        throw error;

    }
}


// ==========================================
// GET DEVELOPER REPOSITORIES
// ==========================================

export async function getDeveloperRepositories(username) {

    try {

        const url =
            `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`;


        console.log("Fetching repositories...");


        // ----------------------------------
        // Fetch With Retry
        // ----------------------------------

        const response = await fetchWithRetry(url);


        // ----------------------------------
        // Convert Response To JSON
        // ----------------------------------

        const data = await response.json();


        return data;

    }

    catch (error) {

        console.error(
            "Unable to fetch repositories:",
            error
        );

        throw error;

    }
}


// ==========================================
// GENERIC GET REQUEST
// ==========================================

export async function getData(url) {

    try {

        const response =
            await fetchWithRetry(url);


        const data =
            await response.json();


        return data;

    }

    catch (error) {

        console.error(
            "GET request failed:",
            error
        );

        throw error;

    }
}


// ==========================================
// POST REQUEST
// ==========================================

export async function postData(url, data) {

    try {

        const response = await fetchWithRetry(
            url,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );


        const result =
            await response.json();


        return result;

    }

    catch (error) {

        console.error(
            "POST request failed:",
            error
        );

        throw error;

    }
}


// ==========================================
// PUT REQUEST
// ==========================================

export async function updateData(url, data) {

    try {

        const response = await fetchWithRetry(
            url,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );


        const result =
            await response.json();


        return result;

    }

    catch (error) {

        console.error(
            "PUT request failed:",
            error
        );

        throw error;

    }
}


// ==========================================
// DELETE REQUEST
// ==========================================

export async function deleteData(url) {

    try {

        const response =
            await fetchWithRetry(
                url,
                {
                    method: "DELETE"
                }
            );


        return response;

    }

    catch (error) {

        console.error(
            "DELETE request failed:",
            error
        );

        throw error;

    }
}

// ============================================
// DAY 35: API SECURITY & AUTHENTICATION
// ============================================

// Get authentication headers
export function getAuthHeaders() {
    const token = localStorage.getItem("auth_token");

    // Stop the request if token doesn't exist
    if (!token) {
        throw new Error(
            "Access Denied: No authentication token found."
        );
    }

    return {
        "Authorization": "Bearer " + token
    };
}


// Secure DELETE request
export async function secureDeleteResource(targetId) {
    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts/${targetId}`,
            {
                method: "DELETE",

                headers: {
                    ...getAuthHeaders()
                }
            }
        );

        // Handle unauthorized request
        if (response.status === 401) {
            throw new Error("Unauthorized: Session expired");
        }

        // Handle other HTTP errors
        if (!response.ok) {
            throw new Error(
                `Request failed with status ${response.status}`
            );
        }

        console.log("Secure DELETE request successful.");

        return response;

    } catch (error) {
        console.error("Secure API Error:", error.message);

        throw error;
    }
}