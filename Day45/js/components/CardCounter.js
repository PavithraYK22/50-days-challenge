// ==========================================
// SYNEXUS COMMUNITY
// Day 44: Reactive Cart Counter
// ==========================================

import { globalStore } from "../js/store.js";

class CartCounter extends HTMLElement {

    constructor() {
        super();

        // Create Shadow DOM
        this.attachShadow({ mode: "open" });

        // Store unsubscribe function
        this.unsubscribe = null;

        // Create component UI
        this.shadowRoot.innerHTML = `
            <style>
                .cart-counter {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 16px;
                    border-radius: 8px;
                    background: #f3f4f6;
                    font-family: Arial, sans-serif;
                    font-weight: bold;
                }

                .cart-icon {
                    font-size: 20px;
                }

                #counter {
                    min-width: 24px;
                    text-align: center;
                    padding: 4px 8px;
                    border-radius: 20px;
                    background: #2563eb;
                    color: white;
                }
            </style>

            <div class="cart-counter">
                <span class="cart-icon">🛒</span>
                <span>Cart</span>
                <span id="counter">0</span>
            </div>
        `;
    }

    connectedCallback() {

        // Get initial state immediately
        const initialState = globalStore.getState();

        this.renderCounter(initialState.cartCount);

        // Subscribe to future state changes
        this.unsubscribe = globalStore.subscribe((state) => {
            this.renderCounter(state.cartCount);
        });
    }

    disconnectedCallback() {

        // Remove subscription
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    renderCounter(cartCount) {

        const counter = this.shadowRoot.getElementById("counter");

        if (counter) {
            counter.textContent = cartCount;
        }
    }
}

// Register custom element
customElements.define("cart-counter", CartCounter);