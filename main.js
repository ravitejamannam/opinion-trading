const express = require('express');
const app = express();

app.use(express.json());

// Data structures to store state
let INR_BALANCES = {};
let STOCK_BALANCES = {};
let ORDER_BOOK = {};

// Helper functions
function createUser(userId) {
    INR_BALANCES[userId] = { balance: 0, locked: 0 };
    STOCK_BALANCES[userId] = {};
}

function createSymbol(symbol) {
    if (!ORDER_BOOK[symbol]) {
        ORDER_BOOK[symbol] = { yes: {}, no: {} };
    }
}

function onrampInr(userId, amount) {
    INR_BALANCES[userId].balance += amount;
}

function mintTokens(userId, symbol, quantity, price) {
    if (!STOCK_BALANCES[userId][symbol]) {
        STOCK_BALANCES[userId][symbol] = { yes: { quantity: 0, locked: 0 }, no: { quantity: 0, locked: 0 } };
    }
    STOCK_BALANCES[userId][symbol].yes.quantity += quantity;
    STOCK_BALANCES[userId][symbol].no.quantity += quantity;
    INR_BALANCES[userId].balance -= quantity * price * 2;
}

function placeOrder(userId, symbol, quantity, price, orderType, stockType) {
    // Implement order placement logic
    // This should handle both buy and sell orders
    // For buy orders below market price, create corresponding 'no' sell orders
}

function matchOrders(symbol, stockType) {
    // Implement order matching logic
}

function cancelOrder(userId, symbol, quantity, price, stockType) {
    // Implement order cancellation logic
}

// API endpoints
app.post('/reset', (req, res) => {
    INR_BALANCES = {};
    STOCK_BALANCES = {};
    ORDER_BOOK = {};
    res.sendStatus(200);
});

app.post('/user/create/:userId', (req, res) => {
    const { userId } = req.params;
    createUser(userId);
    res.status(201).json({ message: `User ${userId} created` });
});

app.post('/symbol/create/:symbol', (req, res) => {
    const { symbol } = req.params;
    createSymbol(symbol);
    res.status(201).json({ message: `Symbol ${symbol} created` });
});

app.post('/onramp/inr', (req, res) => {
    const { userId, amount } = req.body;
    onrampInr(userId, amount);
    res.json({ message: `Onramped ${userId} with amount ${amount}` });
});

app.post('/trade/mint', (req, res) => {
    const { userId, stockSymbol, quantity, price } = req.body;
    mintTokens(userId, stockSymbol, quantity, price);
    const remainingBalance = INR_BALANCES[userId].balance;
    res.json({ message: `Minted ${quantity} 'yes' and 'no' tokens for user ${userId}, remaining balance is ${remainingBalance}` });
});

app.post('/order/sell', (req, res) => {
    const { userId, stockSymbol, quantity, price, stockType } = req.body;
    const result = placeOrder(userId, stockSymbol, quantity, price, 'sell', stockType);
    res.json({ message: result });
});

app.post('/order/buy', (req, res) => {
    const { userId, stockSymbol, quantity, price, stockType } = req.body;
    const result = placeOrder(userId, stockSymbol, quantity, price, 'buy', stockType);
    res.json({ message: result });
});

app.post('/order/cancel', (req, res) => {
    const { userId, stockSymbol, quantity, price, stockType } = req.body;
    const result = cancelOrder(userId, stockSymbol, quantity, price, stockType);
    res.json({ message: result });
});

app.get('/balances/inr', (req, res) => {
    res.json(INR_BALANCES);
});

app.get('/balances/stock', (req, res) => {
    res.json(STOCK_BALANCES);
});

app.get('/orderbook', (req, res) => {
    res.json(ORDER_BOOK);
});

// Export the app for testing
module.exports = app;
