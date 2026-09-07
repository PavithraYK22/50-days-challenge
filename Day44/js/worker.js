// ==========================================
// SYNEXUS COMMUNITY
// Day 41: Web Worker
// ==========================================

// Listen for messages from the main thread
self.onmessage = function (e) {

    // Check whether the main thread sent START
    if (e.data === "START") {

        console.log("Worker: Heavy process started");

        let result = 0;

        // Heavy CPU-intensive task
        for (let i = 0; i < 100000000; i++) {
            result += i;
        }

        console.log("Worker: Heavy process completed");

        // Send result back to main.js
        self.postMessage(result);
    }
};