const mongoose = require('mongoose');
const Schema = mongoose.Schema; // thing that a model wraps around

//schema structure
const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, {timestamps: true});

//create model based on the schema
const Blog = mongoose.model('Blog', blogSchema);

//export model
module.exports = Blog;