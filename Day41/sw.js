// ==========================================
// SYNEXUS COMMUNITY
// Day 38: WebSocket Connection
// ==========================================


// ------------------------------------------
// WebSocket Configuration
// ------------------------------------------

const WEBSOCKET_URL = "wss://ws.postman-echo.com/raw";

let socket = null;


// ------------------------------------------
// DOM Elements
// ------------------------------------------

const liveFeed = document.getElementById("live-feed");
const wsStatus = document.getElementById("ws-status");


// ------------------------------------------
// Add Message To Live Feed
// ------------------------------------------

function addLiveMessage(message, type = "message") {

    if (!liveFeed) {
        return;
    }

    const messageElement = document.createElement("div");

    if (type === "system") {
        messageElement.className = "system-message";
    } else {
        messageElement.className = "live-message";
    }

    messageElement.textContent = message;

    liveFeed.appendChild(messageElement);

    liveFeed.scrollTop = liveFeed.scrollHeight;
}


// ------------------------------------------
// Update Connection Status
// ------------------------------------------

function updateStatus(status) {

    if (!wsStatus) {
        return;
    }

    wsStatus.textContent = status;
}


// ------------------------------------------
// Create WebSocket Connection
// ------------------------------------------

function connectWebSocket() {

    try {

        socket = new WebSocket(WEBSOCKET_URL);

        // ----------------------------------
        // Connection Established
        // ----------------------------------

        socket.onopen = () => {

            console.log("WebSocket connection established.");

            updateStatus("Connected");

            addLiveMessage(
                "WebSocket connection established.",
                "system"
            );
        };


        // ----------------------------------
        // Message Received
        // ----------------------------------

        socket.onmessage = (event) => {

            console.log("Message received:", event.data);

            addLiveMessage(`Server: ${event.data}`);
        };


        // ----------------------------------
        // Error
        // ----------------------------------

        socket.onerror = (error) => {

            console.error("WebSocket error:", error);

            updateStatus("Error");

            addLiveMessage(
                "WebSocket connection error.",
                "system"
            );
        };


        // ----------------------------------
        // Connection Closed
        // ----------------------------------

        socket.onclose = () => {

            console.log("WebSocket connection closed.");

            updateStatus("Disconnected");

            addLiveMessage(
                "WebSocket connection closed.",
                "system"
            );
        };

    } catch (error) {

        console.error(
            "Failed to create WebSocket connection:",
            error
        );

        updateStatus("Connection Failed");

        addLiveMessage(
            "Unable to connect to WebSocket server.",
            "system"
        );
    }
}


// ------------------------------------------
// Send Live Message
// ------------------------------------------

export function sendLiveMessage(text) {

    if (!socket) {

        console.error(
            "WebSocket has not been initialized."
        );

        addLiveMessage(
            "WebSocket is not initialized.",
            "system"
        );

        return;
    }


    if (socket.readyState !== WebSocket.OPEN) {

        console.warn(
            "WebSocket is not connected yet."
        );

        addLiveMessage(
            "Please wait. WebSocket is not connected yet.",
            "system"
        );

        return;
    }


    if (!text || !text.trim()) {
        return;
    }


    socket.send(text.trim());

    console.log("Message sent:", text.trim());
}


// ------------------------------------------
// Start WebSocket Connection
// ------------------------------------------

connectWebSocket();