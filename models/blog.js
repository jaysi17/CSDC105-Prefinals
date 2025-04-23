const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema structure
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
    },
    image: {
        data: Buffer, // Store image data as a Buffer
        contentType: String // Store the image MIME type
    }
}, { timestamps: true });

// Create model based on the schema
const Blog = mongoose.model('Blog', blogSchema);

// Export model
module.exports = Blog;
