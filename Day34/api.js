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