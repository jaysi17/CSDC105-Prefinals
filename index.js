const express = require('express'); // Install express
const mongoose = require('mongoose'); // MongoDB ODM
const Blog = require('./models/blog');
const methodOverride = require('method-override'); // For the update
const multer = require('multer'); // IMAGE
const path = require('path');
const fs = require('fs');

const app = express();

// Connect to MongoDB
const dbURI = 'mongodb+srv://jcm:adminjc@prefinals.slobvrt.mongodb.net/prefinals?retryWrites=true&w=majority&appName=prefinals';

mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// MIDDLEWARE
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

// Configure Multer to handle file upload
const storage = multer.memoryStorage(); // Storing the image in memory instead of a folder
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb('Error: Images Only!'); // Error Handling
    }
});

// ROUTES

// Home Page
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

// About Page
app.get('/about', (req, res) => {
    res.render('about', { title: "About" });
});

// Create Page
app.get('/create', (req, res) => {
    res.render('create', { title: "Create" });
});

// Edit Page
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id)
        .then(blog => {
            res.render('edit', { blog, title: 'Edit Blog' });
        })
        .catch(err => {
            console.log(err);
            res.status(404).render('404', { title: '404' });
        });
});

// Image Route for Displaying
app.get('/blogs/:id/image', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog && blog.image && blog.image.data) {
            res.set('Content-Type', blog.image.contentType);
            res.send(blog.image.data);
        } else {
            res.status(404).send('Image not found');
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }

    console.log("Image data length: ", blog.image?.data?.length);
    console.log("Content Type: ", blog.image?.contentType);

});

// Get All Blogs
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result });
        })
        .catch((err) => {
            console.log(err);
        });
});

//FOR DEBUGGING PURPOSES ONLY
app.use((req, res, next) => {
    console.log('Middleware triggered: ', req.method, req.url);
    next();
  });
  
// Create a New Blog with Image Upload
app.post('/blogs', upload.single('image'), (req, res) => {
    const blog = new Blog({
        title: req.body.title,
        snippet: req.body.snippet,
        body: req.body.body,
        image: req.file ? {
            data: req.file.buffer,  // Image buffer
            contentType: req.file.mimetype
        } : null,  // If no image is provided, don't add an image
    });

    blog.save()
        .then(() => res.redirect('/blogs'))
        .catch(err => console.log(err));

    console.log("File: ", req.file);
    console.log("MULTER file:", req.file); // this should not be undefined
    console.log("BODY:", req.body);        // confirm body still works
});

// Get Blog by ID
app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findById(id)
        .then(result => {
            res.render('details', { blog: result, title: 'Blog Details' });
        })
        .catch((err) => {
            console.log(err);
            res.status(404).render('404', { title: '404' });
        });
});

// Delete Blog by ID
app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/blogs' });
        })
        .catch(err => {
            console.log(err);
        });
});

// Update Blog by ID
app.put('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndUpdate(id, req.body, { new: true })
        .then(result => {
            res.redirect(`/blogs/${id}`);
        })
        .catch(err => {
            console.log(err);
        });
});

// 404 Page
app.use((req, res) => {
    res.status(404).render('404', { title: "404" });
});
