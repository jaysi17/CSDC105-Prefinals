const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const multer = require('multer');
const blogController = require('./controllers/blogControllers');

const app = express();

// MongoDB connection
const dbURI = 'mongodb+srv://jcm:adminjc@prefinals.slobvrt.mongodb.net/prefinals?retryWrites=true&w=majority&appName=prefinals';
mongoose.connect(dbURI)
  .then(() => app.listen(3000))
  .catch(err => console.log(err));

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

// Multer setup for file uploads (shared with controller)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb('Error: Images Only!');
  }
});

// Routes
app.get('/', (req, res) => res.redirect('/blogs'));
app.get('/about', (req, res) => res.render('about', { title: "About" }));
app.get('/create', blogController.blog_create_get);
app.get('/blogs', blogController.blog_index);
app.get('/blogs/:id', blogController.blog_details);
app.get('/blogs/:id/image', blogController.blog_image);
app.get('/blogs/:id/edit', blogController.blog_edit_get);
app.post('/blogs', upload.single('image'), blogController.blog_create_post);
app.put('/blogs/:id', blogController.blog_update);
app.delete('/blogs/:id', blogController.blog_delete);

// Debugging middleware
app.use((req, res, next) => {
  console.log('Middleware triggered: ', req.method, req.url);
  next();
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: "404" });
});
