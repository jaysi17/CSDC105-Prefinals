const express = require('express');//install express
const app = express();// EXPRESS APP

app.use(express.static('public')) // Serve static files from 'public' folder
app.set('view engine', 'ejs')// install ejs and create views folder

app.listen(3000);// listen for request

//Home Page
app.get('/', (req,res) => {
    const blogs = [     
        {title: 'Mia can lift ', snippet: 'Lorem ipsum dolor sit amet consectetur'},
        {title: 'Wala nang roads', snippet: 'Lorem ipsum dolor sit amet consectetur'},
        {title: 'Jonnie Confession', snippet: 'Lorem ipsum dolor sit amet consectetur'},
    ];

    res.render('index', {title: "Home", blogs})
})

//About Page
app.get('/about', (req,res) => {
    res.render('about', {title: "About"})
})

//Routing for create
app.get('/create', (req,res) => {
    res.render('create', {title: "Create"})
})

//Page not FOUND
app.use('/',(req,res) => {
    res.status(404).render('404', {title: "404"})
})
