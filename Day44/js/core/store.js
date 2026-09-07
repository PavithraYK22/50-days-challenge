// ==========================================
// SYNEXUS COMMUNITY
// Day 43: Global Store
// ==========================================

let state = {
    cartCount: 0
};

const subscribers = new Set();

export const globalStore = {

    getState() {
        return state;
    },

    setState(newState) {

        state = {
            ...state,
            ...newState
        };

        subscribers.forEach(callback => {
            callback(state);
        });
    },

    subscribe(callback) {

        subscribers.add(callback);

        return () => {
            subscribers.delete(callback);
        };
    }
};