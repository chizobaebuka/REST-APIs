require('dotenv').config({ path: `${process.cwd()}/.env` })
const express = require('express');
const authRouter = require('./routes/authRoute.js');


const app = express();

app.use(express.json());


// Middleware to parse JSON request bodies
app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'REST APIs are working' });
});

// all routes will be here
app.use('/api/v1/auth', authRouter);

app.use('*', (req, res, next) => {
    res.status(404).json({ status: 'fail', message: 'Route not found' });
})

const port = process.env.APP_PORT || 4000;

app.listen(port, () => {
    console.log(`Server is up and running on ${port}`);
});
