// ./controllers/blogControllers.js
const Blog = require('../models/blog');

// Get All Blogs
const blog_index = (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result });
        })
        .catch((err) => {
            console.log(err);
        });
};

// Create Page
const blog_create_get = (req, res) => {
    res.render('create', { title: "Create" });
};

// Create a New Blog with Image Upload
const blog_create_post = (req, res) => {
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
};

// Get Blog by ID
const blog_details = (req, res) => {
    const id = req.params.id;

    Blog.findById(id)
        .then(result => {
            res.render('details', { blog: result, title: 'Blog Details' });
        })
        .catch((err) => {
            console.log(err);
            res.status(404).render('404', { title: '404' });
        });
};

// Delete Blog by ID
const blog_delete = (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/blogs' });
        })
        .catch(err => {
            console.log(err);
        });
};

// Edit Page
const blog_edit_get = (req, res) => {
    Blog.findById(req.params.id)
        .then(blog => {
            res.render('edit', { blog, title: 'Edit Blog' });
        })
        .catch(err => {
            console.log(err);
            res.status(404).render('404', { title: '404' });
        });
};

// Update Blog by ID
const blog_update = (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndUpdate(id, req.body, { new: true })
        .then(result => {
            res.redirect(`/blogs/${id}`);
        })
        .catch(err => {
            console.log(err);
        });
};

// Image Route for Displaying
const blog_image = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog && blog.image && blog.image.data) {
            res.set('Content-Type', blog.image.contentType);
            res.send(blog.image.data);
        } else {
            res.status(404).send('Image not found');
        }

        console.log("Image data length: ", blog.image?.data?.length);
        console.log("Content Type: ", blog.image?.contentType);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

module.exports = {
    blog_index,
    blog_create_get,
    blog_create_post,
    blog_details,
    blog_delete,
    blog_edit_get,
    blog_update,
    blog_image
};
