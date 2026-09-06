class UserCard extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({
            mode: "open"
        });
    }

    connectedCallback() {

        const name = this.getAttribute("name") || "Unknown User";
        const role = this.getAttribute("role") || "Community Member";

        this.shadowRoot.innerHTML = `
            
            <style>

                .card {
                    width: 280px;
                    padding: 25px;
                    margin: 20px;
                    background: white;
                    border-radius: 15px;
                    text-align: center;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
                    font-family: Arial, sans-serif;
                }

                h2 {
                    color: #222;
                    margin-bottom: 10px;
                }

                p {
                    color: #666;
                    font-size: 16px;
                }

            </style>

            <div class="card">

                <h2>${name}</h2>

                <p>${role}</p>

            </div>
        `;
    }
}

customElements.define("user-card", UserCard);