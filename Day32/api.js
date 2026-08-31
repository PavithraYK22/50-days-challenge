export async function fetchContributor(username) {
    const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}`
    );

    if (!response.ok) {
        throw new Error("Developer not found");
    }

    return await response.json();
}


export async function fetchRepositories(username) {
    const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`
    );

    if (!response.ok) {
        throw new Error("Unable to fetch repositories");
    }

    return await response.json();
}