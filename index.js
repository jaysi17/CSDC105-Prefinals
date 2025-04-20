const express = require('express');//install express
const mongoose = require('mongoose'); //add mongoose library (a Object Data Modelling library for MongoDb in NodeJs)
const Blog = require('./models/blog') 

const app = express();// EXPRESS APP
//connect to mongodb
const dbURI = 'mongodb+srv://jcm:adminjc@prefinals.slobvrt.mongodb.net/prefinals?retryWrites=true&w=majority&appName=prefinals';


mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err))


//MIDDLEWARE
app.use(express.static('public')) // Serve static files from 'public' folder
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs')// install ejs and create views folder


//route sandbox for MONGOOSE AND MONGODB
// app.get('/add-blog', (req, res) => {
//     const blog = new Blog({
//         title : 'new blog 2',
//         snippet: 'about my new blog',
//         body: 'more about my new blog'
//     });
//     blog.save() //used to save to the database
//         .then((result) => {
//             res.send(result);
//         })
//         .catch((err) => {
//             console.log(err);
//         })
// })

// app.get('/all-blogs', (req, res) => {
//     Blog.find()
//         .then((result) => {
//             res.send(result);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// })

// app.get('/single-blog', (req,res) => {
//     Blog.findById('67ffc6491df8926a473a2ad4')
//         .then((result) => {
//             res.send(result);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// })

//ROUTES

//Home Page
app.get('/', (req,res) => {
   res.redirect('/blogs')
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


//CONTROLLERS

//GET ALL
app.get('/blogs', (req, res) => {
    Blog.find().sort({createdAt: -1 })
        .then((result) => {
            res.render('index', {title: 'All Blogs', blogs: result});
        })
        .catch((err) => {
            console.log(err);
        });
});

//CREATE
app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
        .then((result) => {
            res.redirect('/blogs')
        })
        .catch((err) => {
            console.log(err)
        }); 
});

//GET BY ID
app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findById(id)
        .then(result => {
            res.render('details', {blog: result, title: 'Blog Details'});
        })
        .catch((err) => {
            console.log(err);
        });
}) 

//DELETE BY ID
app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/blogs' })
        })
        .catch(err => {
            console.log(err)
        });
});


