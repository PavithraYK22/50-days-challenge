// ==========================================
// SYNEXUS COMMUNITY
// Day 40: IndexedDB Offline Storage
// ==========================================


// ------------------------------------------
// Database Configuration
// ------------------------------------------

const DB_NAME = "PlatformDB";
const DB_VERSION = 1;
const STORE_NAME = "offline_proposals";


// ==========================================
// OPEN DATABASE
// ==========================================

export function openDatabase() {

    return new Promise((resolve, reject) => {

        // Check browser support
        if (!("indexedDB" in window)) {

            reject(
                new Error(
                    "IndexedDB is not supported by this browser."
                )
            );

            return;
        }


        // Open database
        const request =
            indexedDB.open(
                DB_NAME,
                DB_VERSION
            );


        // --------------------------------------
        // DATABASE UPGRADE
        // --------------------------------------

        request.onupgradeneeded = (event) => {

            const db =
                event.target.result;


            console.log(
                "Day 40: Creating/upgrading IndexedDB..."
            );


            // Create object store if it doesn't exist
            if (
                !db.objectStoreNames.contains(
                    STORE_NAME
                )
            ) {

                db.createObjectStore(
                    STORE_NAME,
                    {
                        keyPath: "id",
                        autoIncrement: true
                    }
                );


                console.log(
                    "Day 40: offline_proposals store created."
                );
            }
        };


        // --------------------------------------
        // DATABASE OPENED SUCCESSFULLY
        // --------------------------------------

        request.onsuccess = (event) => {

            const db =
                event.target.result;


            console.log(
                "Day 40: IndexedDB connected successfully."
            );


            // Handle future database version changes
            db.onversionchange = () => {

                db.close();

                console.log(
                    "Day 40: Database connection closed because a new version is available."
                );
            };


            resolve(db);
        };


        // --------------------------------------
        // DATABASE ERROR
        // --------------------------------------

        request.onerror = (event) => {

            console.error(
                "Day 40: IndexedDB error:",
                event.target.error
            );


            reject(
                event.target.error
            );
        };


        // --------------------------------------
        // DATABASE BLOCKED
        // --------------------------------------

        request.onblocked = () => {

            console.warn(
                "Day 40: IndexedDB upgrade is blocked. Close other tabs using this application."
            );
        };

    });
}


// ==========================================
// SAVE OFFLINE DATA
// ==========================================

export async function saveOfflineData(payload) {

    try {

        // Open database
        const db =
            await openDatabase();


        return new Promise((resolve, reject) => {

            // Start read/write transaction
            const transaction =
                db.transaction(
                    STORE_NAME,
                    "readwrite"
                );


            // Get object store
            const store =
                transaction.objectStore(
                    STORE_NAME
                );


            // Add data
            const request =
                store.add(payload);


            // ----------------------------------
            // DATA ADDED SUCCESSFULLY
            // ----------------------------------

            request.onsuccess = () => {

                console.log(
                    "Day 40: Offline data saved successfully."
                );

                console.log(
                    "Generated ID:",
                    request.result
                );

                resolve(
                    request.result
                );
            };


            // ----------------------------------
            // REQUEST ERROR
            // ----------------------------------

            request.onerror = (event) => {

                console.error(
                    "Day 40: Failed to save offline data:",
                    event.target.error
                );


                reject(
                    event.target.error
                );
            };


            // ----------------------------------
            // TRANSACTION ERROR
            // ----------------------------------

            transaction.onerror = (event) => {

                console.error(
                    "Day 40: Transaction failed:",
                    event.target.error
                );


                reject(
                    event.target.error
                );
            };

        });

    }

    catch (error) {

        console.error(
            "Day 40: IndexedDB save error:",
            error
        );


        throw error;
    }
}


// ==========================================
// GET ALL OFFLINE DATA
// BONUS CHALLENGE
// ==========================================

export async function getOfflineData() {

    try {

        // Open database
        const db =
            await openDatabase();


        return new Promise((resolve, reject) => {

            // Start readonly transaction
            const transaction =
                db.transaction(
                    STORE_NAME,
                    "readonly"
                );


            // Get object store
            const store =
                transaction.objectStore(
                    STORE_NAME
                );


            // Get all saved records
            const request =
                store.getAll();


            // ----------------------------------
            // DATA RETRIEVED SUCCESSFULLY
            // ----------------------------------

            request.onsuccess = () => {

                console.log(
                    "Day 40: Offline data retrieved:",
                    request.result
                );


                resolve(
                    request.result
                );
            };


            // ----------------------------------
            // READ ERROR
            // ----------------------------------

            request.onerror = (event) => {

                console.error(
                    "Day 40: Failed to retrieve offline data:",
                    event.target.error
                );


                reject(
                    event.target.error
                );
            };


            // ----------------------------------
            // TRANSACTION ERROR
            // ----------------------------------

            transaction.onerror = (event) => {

                console.error(
                    "Day 40: Read transaction failed:",
                    event.target.error
                );


                reject(
                    event.target.error
                );
            };

        });

    }

    catch (error) {

        console.error(
            "Day 40: IndexedDB read error:",
            error
        );


        throw error;
    }
}