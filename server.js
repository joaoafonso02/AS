// Import utilities
import express, {urlencoded } from 'express';
import session from 'express-session';


/* Import student created functions */
import { signUpWithEmailPassword } from './utils/auxiliaryFunctions.js';


// Create app
var app = express();


// Middleware
app.set('view engine', 'ejs');
app .use(express.static('views'))
    .use(urlencoded({ extended: true }))
    .use(session({
        secret: 'SHyumPxoSxqP3NEFclV5oF3nh5Kw9dJh',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 24 * 60 * 60 * 1000, // 1 day session
         }, 
    }))
    .use((req, res, next) => { // Prevent user from going back after a logout
        if (!req.userId) {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
        }
        next();
    });


// Listen to requests
const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

// Functions
const notLoggedOn = (req, res, next) => {
    if (typeof req.session.userId == 'undefined' || req.session.userId <= 0) {
        res.redirect('/');
    }
    else {
        next();
    }
};

// Get Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/homepage', notLoggedOn, (req, res) => {
    res.render('Homepage');
});

// Post Routes
app.post('/login', (req, res) => {
    signUpWithEmailPassword(req.body.email, req.body.password).then((result) =>{
        console.log(result);
    })
    res.redirect('/homepage');
});
