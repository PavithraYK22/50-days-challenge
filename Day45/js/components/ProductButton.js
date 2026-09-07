// ==========================================
// SYNEXUS COMMUNITY
// Day 44: Product Button
// ==========================================

import { globalStore } from "../js/store.js";

class ProductButton extends HTMLElement {

    constructor() {
        super();

        // Create Shadow DOM
        this.attachShadow({ mode: "open" });

        // Create button UI
        this.shadowRoot.innerHTML = `
            <style>
                button {
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    background: #2563eb;
                    color: white;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                }

                button:hover {
                    opacity: 0.9;
                }
            </style>

            <button id="add-product">
                Add Product to Cart
            </button>
        `;
    }

    connectedCallback() {

        const button = this.shadowRoot.getElementById("add-product");

        button.addEventListener("click", () => {

            // Get current state
            const currentState = globalStore.getState();

            // Increase cart count
            globalStore.setState({
                cartCount: currentState.cartCount + 1
            });
        });
    }
}

// Register custom element
customElements.define("product-button", ProductButton);