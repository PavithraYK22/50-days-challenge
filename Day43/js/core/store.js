// ==========================================
// SYNEXUS COMMUNITY
// Day 43: Global State Management
// Pub/Sub Pattern
// ==========================================

class StateStore {

    constructor(initialState) {
        this.state = initialState;
        this.listeners = [];
    }

    // ------------------------------------------
    // Subscribe to state changes
    // ------------------------------------------

    subscribe(listenerFunction) {
        this.listeners.push(listenerFunction);

        // Bonus: unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(
                listener => listener !== listenerFunction
            );
        };
    }

    // ------------------------------------------
    // Update state and notify subscribers
    // ------------------------------------------

    setState(newState) {

        // Merge old state with new state
        this.state = {
            ...this.state,
            ...newState
        };

        // Notify all subscribers
        this.listeners.forEach(listener => {
            listener(this.state);
        });
    }
}

// ------------------------------------------
// Singleton Global Store
// ------------------------------------------

export const globalStore = new StateStore({
    cartCount: 0,
    userTheme: "light"
});