const mongoose = require('mongoose');

const express = require('express');

const path = require('path');

require('dotenv').config();

mongoose.set('strictQuery', true);

mongoose.connect(process.env.DB_CONNECT)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('Mongo connection err', err.message));


const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());


app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public'), { index: 'index.html' }));

const userRouter = require('./routes/userRouter');

app.use('', userRouter);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Click here to access http://localhost:${PORT}`);
})