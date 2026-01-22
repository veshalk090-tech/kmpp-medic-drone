const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('.'));
app.use(express.json());

let orders = [];
let orderIdCounter = 1000;

// API endpoint to place order
app.post('/api/orders', (req, res) => {
    const { customer, items, total } = req.body;

    if (!customer || !items || !total) {
        return res.json({ success: false, message: 'Missing required fields' });
    }

    const orderId = `ORD-${orderIdCounter++}`;
    const order = {
        orderId,
        ...req.body,
        status: 'pending',
        createdAt: new Date()
    };

    orders.push(order);
    console.log('New order:', order);

    res.json({ 
        success: true, 
        orderId,
        message: 'Order confirmed! Drone dispatching soon.'
    });
});

// API endpoint to check order status
app.get('/api/orders/:orderId', (req, res) => {
    const order = orders.find(o => o.orderId === req.params.orderId);
    
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
});

app.listen(PORT, () => {
    console.log(`🚁 DroneRx server running on http://localhost:${PORT}`);
    console.log(`📱 Open your browser and visit: http://localhost:${PORT}`);
});
