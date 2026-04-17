const express = require('express');
const router = express.Router();
let blogPosts = require('../assets/blogPosts');



//INDEX /posts - GET posts JSON
router.get('/', (req, res) => {
    res.json(blogPosts);
});

// POST /posts - Create a new post
router.post('/', (req, res) => {
    res.send('Create a new post');
});

// PUT /posts/:id - Update a post
router.put('/:id', (req, res) => {
    res.send(`Update post ${req.params.id}`);
});

//SHOW /posts/:id GET single post JSON
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const post = blogPosts.find(post => post.id === id)
    res.json(post);
})

//DESTROY /posts/:id DELETE single post
router.delete('/:id', (req,res) => {
    const id = parseInt(req.params.id);
    blogPosts = blogPosts.filter(post => post.id !== id)
    res.json({message:`post ${id} has been deleted`, currentArrayLength: blogPosts.length});
    
})

module.exports = router;
