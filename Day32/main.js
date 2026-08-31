import { debounce } from "./utils.js";
import {
    fetchContributor,
    fetchRepositories
} from "./api.js";


document.addEventListener("DOMContentLoaded", () => {

    const usernameInput = document.getElementById("github-username");
    const profileCard = document.getElementById("dev-profile-card");
    const reposGrid = document.getElementById("repos-grid");


    const searchDeveloper = debounce(async (username) => {

        if (!username.trim()) {
            profileCard.innerHTML = "";
            reposGrid.innerHTML = "";
            return;
        }


        try {

            profileCard.innerHTML = "<p>Loading developer...</p>";


            const data = await fetchContributor(username);


            profileCard.innerHTML = `
                <div class="github-profile-card">

                    <img
                        src="${data.avatar_url}"
                        alt="${data.login}"
                        class="github-avatar"
                    >

                    <div class="github-profile-info">

                        <h3>${data.name || data.login}</h3>

                        <p>@${data.login}</p>

                        <p>
                            ${data.bio || "No bio available."}
                        </p>

                        <a
                            href="${data.html_url}"
                            target="_blank"
                        >
                            View GitHub Profile
                        </a>

                    </div>

                </div>
            `;


            const repositories = await fetchRepositories(username);


            reposGrid.innerHTML = repositories.map(repo => `
                <div class="initiative-card">

                    <h3>${repo.name}</h3>

                    <p>
                        ${repo.description || "No description available."}
                    </p>

                    <a
                        href="${repo.html_url}"
                        target="_blank"
                    >
                        View Repository
                    </a>

                </div>
            `).join("");


        } catch (error) {

            profileCard.innerHTML = `
                <p class="error-text">
                    ${error.message}
                </p>
            `;

            reposGrid.innerHTML = "";

        }

    }, 500);


    usernameInput.addEventListener("input", () => {

        searchDeveloper(usernameInput.value);

    });

});