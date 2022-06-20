// Import utilities
import express, {json, urlencoded } from 'express';
import session from 'express-session';
import fs from 'fs';


/* Import student created functions */
import { signUpWithEmailPassword, signInWithEmailPassword, endSession} from './utils/auxiliaryFunctions.js';


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
app.listen(process.env.PORT || 3000);

// Functions
const notLoggedOn = (req, res, next) => {
    if (typeof req.session.userEmail == 'undefined') {
        res.redirect('/');
    }
    else {
        next();
    }
};

const loggedOn = (req, res, next) => {
    if (typeof req.session.userEmail !== 'undefined') {
        res.redirect('/homepage');
    }
    else {
        next();
    }
};


// GET requests
app.get('/', loggedOn, (req, res) => {
    res.render('index');
});

app.get('/signUp', loggedOn, (req, res) => {
    res.render('SignUp')
})

app.get('/cart', notLoggedOn, (req, res) => {
    res.render('Cart', {session: req.session})
})

app.get('/payment', notLoggedOn, (req, res) => {
    res.render('Payment', {session: req.session})
})

app.get('/homepage', notLoggedOn, (req, res) => {
    var month = new Date().toLocaleString('pt-PT', {month: 'long'})
    month = month.charAt(0).toUpperCase() + month.slice(1)
    res.render('Homepage', { currentMonth: month, session: req.session});
});

app.get('/fruitSection/', notLoggedOn, (req, res) => {
    var products = JSON.parse(fs.readFileSync('./data/products.json'))
    products = products.Fruits.sort()
    res.render('ProductSection', {'products': products, 'productType': "Fruits", session: req.session})
 
})

app.get('/vegetableSection/', notLoggedOn, (req, res) => {
    var products = JSON.parse(fs.readFileSync('./data/products.json'))
    products = products.Vegetables.sort()
    res.render('ProductSection', {'products': products, 'productType': "Vegetables", session: req.session})
 
})

app.get('/grainSection/', notLoggedOn, (req, res) => {
    var products = JSON.parse(fs.readFileSync('./data/products.json'))
    products = products.Grains.sort()
    res.render('ProductSection', {'products': products, 'productType': "Grains", session: req.session})
 
})


app.get('/fruitSearch', notLoggedOn, (req, res) => {
    var searchparam = req.query.searchBar.toLowerCase()
    var products = JSON.parse(fs.readFileSync('./data/products.json')).Fruits.sort()
    var filteredProducts = []
    products.forEach(product => {
        if (
            product.Name.toLowerCase().includes(searchparam) ||
            product.Maker.toLowerCase().includes(searchparam)
        ) {
            if(req.query.produtores == '' || product.Maker == req.query.produtores){
                if(req.query.produtos == '' || product.Name == req.query.produtos){
                    filteredProducts.push(product)    
                }
            }
        };
    });
    res.render('ProductSection', {'products': filteredProducts, 'productType': "Fruits", session: req.session})
})


app.get('/vegetableSearch', notLoggedOn, (req, res) => {
    var searchparam = req.query.searchBar.toLowerCase()
    var products = JSON.parse(fs.readFileSync('./data/products.json')).Vegetables.sort()
    var filteredProducts = []
    products.forEach(product => {
        if (
            product.Name.toLowerCase().includes(searchparam) ||
            product.Maker.toLowerCase().includes(searchparam)
        ) {
            if(req.query.produtores == '' || product.Maker == req.query.produtores){
                if(req.query.produtos == '' || product.Name == req.query.produtos){
                    filteredProducts.push(product)    
                }
            }
        };
    });
    res.render('ProductSection', {'products': filteredProducts, 'productType': "Vegetables", session: req.session})
})


app.get('/grainSearch', notLoggedOn, (req, res) => {
    var searchparam = req.query.searchBar.toLowerCase()
    var products = JSON.parse(fs.readFileSync('./data/products.json')).Grains.sort()
    var filteredProducts = []
    products.forEach(product => {
        if (
            product.Name.toLowerCase().includes(searchparam) ||
            product.Maker.toLowerCase().includes(searchparam)
        ) {
            if(req.query.produtores == '' || product.Maker == req.query.produtores){
                if(req.query.produtos == '' || product.Name == req.query.produtos){
                    filteredProducts.push(product)    
                }
            }
        };
    });
    res.render('ProductSection', {'products': filteredProducts, 'productType': "Grains", session: req.session})
})

app.get('/productInfo/:type/:product', notLoggedOn, (req, res) => {
    var products;
    if(req.params.type == "Fruits"){
        products = JSON.parse(fs.readFileSync('./data/products.json')).Fruits
    }
    else if(req.params.type == "Vegetables"){
        products = JSON.parse(fs.readFileSync('./data/products.json')).Vegetables
    }
    else{
        products = JSON.parse(fs.readFileSync('./data/products.json')).Grains
    }
    var productData = ""
    products.forEach((elem) => {
         if(elem.Id == req.params.product){
            productData = elem
         }
    })
    res.render('InfoProduct', {'data': productData, session: req.session, 'productType': req.params.type})
})

app.get('/addToCart/:type/:id', notLoggedOn, (req, res) => {
    var products;
    if(req.params.type == "Fruits"){
        products = JSON.parse(fs.readFileSync('./data/products.json')).Fruits
    }
    else if(req.params.type == "Vegetables"){
        products = JSON.parse(fs.readFileSync('./data/products.json')).Vegetables
    }
    else{
        products = JSON.parse(fs.readFileSync('./data/products.json')).Grains
    }
    var productData = ""
    products.forEach((elem) => {
         if(elem.Id == req.params.id){
            productData = elem
         }
    })
    res.render('AddToCart', {data: productData, session: req.session, 'productType': req.params.type})
})

app.get('/addCart/:type', notLoggedOn, (req, res) => {
    var products;
    if(req.params.type == "Fruits"){
        products = JSON.parse(fs.readFileSync('./data/products.json')).Fruits
    }
    else if(req.params.type == "Vegetables"){
        products = JSON.parse(fs.readFileSync('./data/products.json')).Vegetables
    }
    else{
        products = JSON.parse(fs.readFileSync('./data/products.json')).Grains
    }
    var productData = {}
    products.forEach((elem) => {
         if(elem.Id == req.query.productId){
            productData.name = elem.Name,
            productData.maker = elem.Maker,
            productData.weight = req.query.kg
            productData.price = elem.Price,
            productData.totalPrice = parseFloat(req.query.kg)*parseFloat(elem.Price),
            productData.id = elem.Id,
            productData.image = elem.Image
         }
    })
    var presentInCart = false
    req.session.cart.forEach((elem) => {
        if(elem.id == productData.id) {
            elem.weight = parseInt(elem.weight) + parseInt(productData.weight),
            elem.totalPrice = elem.totalPrice + productData.totalPrice
            presentInCart = true 
        } 
    })
    if(!presentInCart){
        req.session.cart.push(productData)
    }
    res.render('addToCart', {data: productData, session: req.session, 'productType': req.params.type})
})

app.get('/removeCart', notLoggedOn, (req, res) => {
    var tempCart = []
    req.session.cart.forEach((elem) => {
        if(elem.id != req.query.productId){
            tempCart.push(elem)   
        }
    })
    req.session.cart = tempCart
    res.render('Cart', {session: req.session})
})

app.get('/registerOrder', notLoggedOn, (req, res) => {
    var finalPrice = 0

    req.session.cart.forEach((elem) => {
        finalPrice = finalPrice + parseFloat(elem.totalPrice)
    })

    var currentDate = new Date()
    var newOrder = {
        id: 0,
        email: req.query.email,
        date: currentDate.getDay()+'/'+ currentDate.getMonth() +'/'+ currentDate.getFullYear(),
        total: finalPrice.toFixed(2),
        status: "Em preparação"
    }
    fs.readFile('./data/orders.json', 'utf-8', function writeToFile(err, data) {
        if(err){
            res.render('Payment', {session: req.session})
        }else{
            var jsonObj = JSON.parse(data)
            newOrder.id = "#PT"+ jsonObj.length
            jsonObj.push(newOrder),
            fs.writeFile('./data/orders.json', JSON.stringify(jsonObj), (err) => {
                if(err){ 
                    res.render('Payment', {session: req.session})
                }else{
                    req.session.cart=[];
                    res.redirect('OrderHistory')
                }
            })
        }
    })    
})

app.get('/orderHistory', notLoggedOn, (req, res) => {
    var allOrders = JSON.parse(fs.readFileSync('./data/orders.json'))
    var userOrders = []
    allOrders.forEach((elem) => {
        if(elem.email == req.session.userEmail){
            userOrders.push(elem)
        }
    })
    res.render('OrderHistory', {session: req.session, orders: userOrders})
})


// POST REQUESTS
app.post('/register', (req, res) => {
    signUpWithEmailPassword(req.body.email, req.body.password).then((result) =>{
        if(result != "ERROR"){
            if(typeof req.session.userId == 'undefined') {
                req.session.cart = []
                req.session.userEmail = req.body.email
            }
            res.redirect('/homepage');
        }
        else{
            res.redirect('/signUp');
        }
    })
});

app.post('/login', (req, res) => {
    signInWithEmailPassword(req.body.email, req.body.password).then((result) =>{
        if(result!="ERROR"){
            if(typeof req.session.userId == 'undefined') {
                req.session.cart = []
                req.session.userEmail = req.body.email
            }
            res.redirect('/homepage');
        }
        else{
            res.redirect('/');
        }
    })
});

app.post('/logout', (req, res) => {
    endSession().then((result) =>{
        if(result!="ERROR"){
            req.session.destroy();
            res.redirect('/');
        }
        else{
            res.redirect('/homepage');
        }
    });
});

// 404 REQUESTS
app.get('*', function(req, res){
    res.status(404).send('A página a que tentou aceder não existe');
  });