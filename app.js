const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const usersRoutes = require('./api/routes/users');

mongoose.connect('mongodb+srv://mrkezay:'+ process.env.MONGO_ATLAS_PW + '@superber-qmrcd.mongodb.net/test?retryWrites=true&w=majority',
{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
});


mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Yetkilendirme işlemleri yaptık. Eğer OPTIONS girerse
// PUT,POST VS. yetkileri açık oluyor.
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With , Content-Type , Accept , Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({});
    }
    next();
});

// İstekleri yerine getirmesi gereken rotalar
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users',usersRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;