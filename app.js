const express = require('express');
const postsRouter = require('./routers/posts');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/posts', postsRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
