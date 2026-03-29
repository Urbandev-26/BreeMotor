const { getStore } = require("@netlify/blobs");

/**
 * Netlify Function: Portfolio API
 * Handles CRUD for motor portfolio items using Netlify Blobs.
 */
exports.handler = async (event, context) => {
    // Shared store name for this project
    const store = getStore("breemotor_portfolio");
    const BLOB_KEY = "items";

    try {
        // 1. FETCH ALL ITEMS (GET)
        if (event.httpMethod === "GET") {
            const data = await store.getJSON(BLOB_KEY) || [];
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            };
        }

        // 2. ADD NEW ITEM (POST)
        if (event.httpMethod === "POST") {
            const newItem = JSON.parse(event.body);
            const currentData = await store.getJSON(BLOB_KEY) || [];
            
            // Add a unique ID and timestamp
            const entry = {
                ...newItem,
                id: `car_${Date.now()}`,
                createdAt: new Date().toISOString()
            };

            const updatedData = [entry, ...currentData];
            await store.setJSON(BLOB_KEY, updatedData);

            return {
                statusCode: 201,
                body: JSON.stringify(entry)
            };
        }

        // 3. DELETE ITEM (DELETE)
        if (event.httpMethod === "DELETE") {
            const { id } = JSON.parse(event.body);
            if (!id) throw new Error("ID is required for deletion");

            const currentData = await store.getJSON(BLOB_KEY) || [];
            const updatedData = currentData.filter(item => item.id !== id);
            
            await store.setJSON(BLOB_KEY, updatedData);

            return {
                statusCode: 200,
                body: JSON.stringify({ message: `Item ${id} removed successfully.` })
            };
        }

        return { statusCode: 405, body: "Method Not Allowed" };
    } catch (error) {
        console.error("Netlify Function Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
