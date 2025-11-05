// // 📁 controllers/sse.controller.js
// let sseClients = [];

// export const sseConnection = (req, res) => {
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");

//   // to send res to the client immediaitely, to tell Keep connection open
//   res.flushHeaders();

//   // Add client to list
//   sseClients.push(res);
//   console.log("🟢 New SSE client connected. Total:", sseClients.length);

//   // Remove client when closed
//   req.on("close", () => {
//     console.log("🔴 SSE client disconnected");
//     sseClients = sseClients.filter((client) => client !== res);
//   });
// };

// // Helper to broadcast messages to all clients
// export const sendSseUpdate = (data) => {
//   sseClients.forEach((client) => {
//     client.write(`data: ${JSON.stringify(data)}\n\n`);
//   });
// };
