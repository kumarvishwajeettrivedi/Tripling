const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./model/host');
const Review = require('./model/review');
const wraperror = require('./utility/errorlo');
const errorlo = require('./utility/errorhdl');

const session = require('express-session');
const flash = require('connect-flash'); 
const campgrounds = require('./routes/campground');
const reviews = require('./routes/review');

mongoose.connect('mongodb://127.0.0.1:27017/Camping', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionConfig));
app.use(flash()); 

app.use((req, res, next) => {
    res.locals.success = req.flash('success'); 
    res.locals.error = req.flash('error'); 
    next();
});

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new errorlo('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('errortemp', { err });
});

app.listen(5000, () => {
    console.log('Serving on port 5000');
});
