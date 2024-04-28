const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3003;

// Middleware
app.use(express.json());
app.use(cors());

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the database.');
    createTables(); // Create tables if they don't exist
  }
});

// Function to create tables if they don't exist
function createTables() {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    name TEXT,
    password TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    message TEXT,
    orderID TEXT,
    price REAL,
    quantity INTEGER,
    symbol TEXT
  )`);
}

// Define the request body schema for user registration
const registerSchema = {
  username: 'string',
  name: 'string',
  password: 'string'
};

const loginSchema = {
  username: 'string',
  password: 'string'
};

// Define the place order schema
const placeOrderSchema = {
  message: 'string',
  orderID: 'string',
  price: 'number',
  quantity: 'number',
  symbol: 'string'
};

//const baseURL = ""
// GET endpoint to retrieve user data
app.get('/data/profile', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'profile.json');
    const data = await fs.readFile(filePath, 'utf-8');
    res.type('application/json').send(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET endpoint to retrieve holdings response
app.get('/data/holdings', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'holdings_response.json');
    const data = await fs.readFile(filePath, 'utf-8');
    res.type('application/json').send(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST endpoint to register a new user
app.post('/register', async (req, res) => {
  try {
    const { username, name, password } = req.body;
    // Example: Insert user data into the SQLite database
    db.run('INSERT INTO users (username, name, password) VALUES (?, ?, ?)', [username, name, password], function (err) {
      if (err) {
        console.error('Error registering user:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }
      res.status(201).json({ message: 'User registered successfully', user: { username, name } });
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST endpoint to login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Query the database to find the user
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
      if (err) {
        console.error('Error logging in user:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }
      if (!user) {
        res.status(401).json({ message: 'User not registered' });
        return;
      }
      if (user.password !== password) {
        res.status(401).json({ message: 'Invalid password' });
        return;
      }
      res.status(200).json({ message: 'User logged in successfully', user: { username, name: user.name } });
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST endpoint to place an order
app.post('/placeorder', async (req, res) => {
  try {
    const { message, orderID, price, quantity, symbol } = req.body;
    // Example: Insert order data into the SQLite database
    db.run('INSERT INTO orders (message, orderID, price, quantity, symbol) VALUES (?, ?, ?, ?, ?)', [message, orderID, price, quantity, symbol], function (err) {
      if (err) {
        console.error('Error placing order:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }
      res.status(201).json({ message: 'Order placed successfully', order: { message, orderID, price, quantity, symbol } });
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at :${port}`);
});
