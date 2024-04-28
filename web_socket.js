// const WebSocket = require('ws');

// // Create a WebSocket server
// const wss = new WebSocket.Server({ port: 8080 });

// // Function to generate random numbers from 1 to 10
// const getRandomNumber = () => Math.floor(Math.random() * 10) + 1;

// // Function to send random numbers to all connected clients every second
// const sendRandomNumber = () => {
//   const randomNumber = getRandomNumber();
//   wss.clients.forEach(client => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(randomNumber.toString());
//     }
//   });
// };

// // Send random numbers every second
// setInterval(sendRandomNumber, 1000);

// const http = require('http');
// const { Server } = require('socket.io');

// // Create an HTTP server
// const server = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('WebSocket server is running!\n');
// });

// // Create a WebSocket server instance attached to the HTTP server
// const io = new Server(server, {
//   cors: {
//     origin: "*"
//   }
// });

// // Event listener for new WebSocket connections
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // Send random numbers to the connected client every second
//   const interval = setInterval(() => {
//     const randomNumber = Math.floor(Math.random() * 10) + 1;
//     socket.emit('randomNumber', randomNumber);
//   }, 1000);

//   // Event listener for client disconnection
//   socket.on('disconnect', () => {
//     clearInterval(interval);
//     console.log('A user disconnected');
//   });
// });

// // Start the HTTP server and listen on a port
// const PORT = 8080;
// server.listen(PORT, () => {
//   console.log(`WebSocket server running on port ${PORT}`);
// });
//--------------------------------------------------
// const WebSocket = require('ws');

// const wss = new WebSocket.Server({ port: 8080 });

// wss.on('connection', (ws) => {
// 	console.log('Client connected');

//   const interval = setInterval(() => {
//     const symbols = ['NIFTYBANK', 'NIFTY50'];
//     symbols.forEach(symbol => {
//       const randomPrice = Math.floor(Math.random() * 500 + 8000) / 10;
//       ws.send(JSON.stringify({ symbol, price: randomPrice }));
//     });
// 	}, 1000);


//   ws.on('close', () => {
//     clearInterval(interval);
//     console.log('Client disconnected');
//   });
// });

const WebSocket = require('ws');
const port = 8080;

const wss = new WebSocket.Server({port});

wss.on('connection', (ws) => {
    console.log('Client connected');

    const interval = setInterval(() => {
        const symbols = ['NIFTYBANK', 'NIFTY50'];
        const stockData = symbols.map(symbol => ({ symbol, price: Math.floor(Math.random() * 500 + 8000) / 10 }));
        const jsonData = JSON.stringify(stockData);
        console.log('Sending data:', jsonData);
        ws.send(jsonData);
    }, 1000);

    ws.on('close', () => {
        clearInterval(interval);
        console.log('Client disconnected');
    });
});
