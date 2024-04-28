const fastify = require('fastify')();
const fs = require('fs');
const path = require('path');
const cors = require('fastify-cors');
const fastifySwagger = require('fastify-swagger');
const WebSocket = require('ws');

fastify.register(require('fastify-formbody'));
fastify.register(cors);
fastify.register(fastifySwagger, {
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'ZeroBruh!',
      description: 'API docs for ZeroBruh!',
      version: '1.0.0'
    },
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'apiKey',
        in: 'header'
      }
    },
    security: [
      { apiKey: [] }
    ]
  },
  exposeRoute: true
});

// Define the request body schema for user registration
const registerSchema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    name: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['username', 'name', 'password']
};

const loginSchema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['username', 'password']
};

// Define the place order
const placeOrderSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
		orderID: { type: 'string' },
		price: { type: 'number' },
		quantity: { type: 'number' },
		symbol: { type: 'string' },
  },
  required: ['message', 'orderID', 'price', 'quantity', 'symbol']
};

// WebSocket server for delivering dummy stock price data
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  // Send dummy stock price data to the client every second
  const interval = setInterval(() => {
	// 	const stockPrice = Math.random() * 1000;
  //   ws.send(JSON.stringify({ symbol: 'AAPL', price: stockPrice }));
  // }, 1000);
		const data = [
      { symbol: 'NIFTYBANK', price: (Math.random() * 1000).toFixed(2) },
      { symbol: 'NIFTY50', price: (Math.random() * 1000).toFixed(2) }
    ];  // Example data with multiple symbols and values
    ws.send(JSON.stringify(data));
	}, 1000);

  ws.on('close', () => {
    clearInterval(interval);
  });
});

// Upgrade HTTP server to WebSocket server
fastify.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});


// Dummy user data storage
let users = [];

let orders = [];


// GET for historical data
fastify.get('/data/historical', async (request, reply) => {
	try {
		const filePath = path.join(__dirname, 'output.json');
		const data = await fs.promises.readFile(filePath, 'utf-8');
		reply.type('application/json').send(data);
	} catch (error) {
		console.error('Error fetching data:', error);
		reply.code(500).send({ message: 'Internal Server Error' });
	}
});

// GET endpoint to retrieve user data
fastify.get('/data/profile', async (request, reply) => {
  try {
    const filePath = path.join(__dirname, 'profile.json');
    const data = await fs.promises.readFile(filePath, 'utf-8');
    reply.type('application/json').send(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    reply.code(500).send({ message: 'Internal Server Error' });
  }
});

// GET endpoint to retrieve holdings response
fastify.get('/data/holdings', async (request, reply) => {
  try {
    const filePath = path.join(__dirname, 'holdings_response.json');
    const data = await fs.promises.readFile(filePath, 'utf-8');
    reply.type('application/json').send(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    reply.code(500).send({ message: 'Internal Server Error' });
  }
});

// POST endpoint to register a new user
fastify.post('/register', {
  schema: {
    body: registerSchema
  }
}, async (request, reply) => {
  try {
    // Extract user data from request body
    const { username, name, password } = request.body;

    // Validate user data (add your validation logic here)

    // Add user to the list
    const newUser = { username, name, password };
    users.push(newUser);

    reply.code(201).send({ message: 'User registered successfully', user: newUser });
    console.log('User registered successfully:', users);
  } catch (error) {
    console.error('Error registering user:', error);
    reply.code(500).send({ message: 'Internal Server Error' });
  }
});

// POST endpoint to login
// fastify.post('/login', {
//   schema: {
//     body: loginSchema
//   }
// }, async (request, reply) => {
//   try {
//     // Extract user data from request body
//     const { username, password } = request.body;

//     // Validate user data (add your validation logic here)

//     // Add user to the list
//     const newUser = { username, password };
//     users.push(newUser);

//     reply.code(201).send({ message: 'User logged in successfully', user: newUser });
//     console.log('User logged in successfully:', users);
//   } catch (error) {
//     console.error('Error registering user:', error);
//     reply.code(500).send({ message: 'Internal Server Error' });
//   }
// });


fastify.post('/login', {
  schema: {
    body: loginSchema
  }
}, async (request, reply) => {
  try {
    // Extract user data from request body
    const { username, password } = request.body;

    // Validate user data
    const user = users.find(u => u.username === username);
    if (!user) {
      return reply.code(401).send({ message: 'User not registered' });
    }

    // Check if the password matches
    if (user.password !== password) {
      return reply.code(401).send({ message: 'Invalid password' });
    }

    // User is valid and password matches
    reply.code(200).send({ message: 'User logged in successfully', user: user });
    console.log('User logged in successfully:', user);
  } catch (error) {
    console.error('Error logging in user:', error);
    reply.code(500).send({ message: 'Internal Server Error' });
  }
});

// POST endpoint to place an order
fastify.post('/placeorder', {
  schema: {
    body: placeOrderSchema
  }
}, async (request, reply) => {
  try {
    // Extract user data from request body
    const { message, orderID, price, quantity, symbol } = request.body;

    // Validate user data (add your validation logic here)

    // Add user to the list
    const ordersData = { message, orderID, price, quantity, symbol };
    orders.push(ordersData);

    reply.code(201).send({ message: 'Orders placed successfully', user: ordersData });
    console.log('Orders placed successfully:', orders);
  } catch (error) {
    console.error('Error ordering:', error);
    reply.code(500).send({ message: 'Internal Server Error' });
  }
});

const start = async () => {
  try {
    await fastify.listen(3003);
    console.log('Server running on http://localhost:3003');
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

start();
