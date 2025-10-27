// progressManager.js - Manages active SSE client connections

const clients = new Map(); // Stores { jobId: expressResponseObject }

/**
 * Sends a progress update to the client connected with the given jobId.
 * Data is automatically formatted for SSE (data: {JSON}\n\n).
 * * @param {string} jobId The unique ID of the upload job.
 * @param {object} data The data payload (e.g., { progress: 50 }, { status: 'complete' }).
 */
function sendProgress(jobId, data) {
    const clientRes = clients.get(jobId);
    if (clientRes && clientRes.writable) {
        // SSE format: data: {JSON string}\n\n
        clientRes.write(`data: ${JSON.stringify(data)}\n\n`);
    }
}

/**
 * Removes the client connection from the store.
 * * @param {string} jobId The unique ID of the upload job.
 */
function removeClient(jobId) {
    clients.delete(jobId);
}

export const sseActions =  { clients, sendProgress, removeClient };