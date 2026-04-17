const express = require('express');
const router = express.Router();
const db = require('../data/db'); // importa il pool MySQL

// INDEX /posts - GET tutti i post
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM posts');
        res.json(rows);
    } catch (err) {
        console.error('❌ Errore GET /posts:', err);
        res.status(500).json({ error: 'Errore nel recupero dei post' });
    }
});

// SHOW /posts/:id - GET singolo post
router.get('/:id', async (req, res) => {
    try {
        // 1) Recupero il post
        const [postRows] = await db.query(
            'SELECT * FROM posts WHERE id = ?',
            [req.params.id]
        );

        if (postRows.length === 0) {
            return res.status(404).json({ error: 'Post non trovato' });
        }

        const post = postRows[0];

        // 2) Recupero i tag associati
        const [tagRows] = await db.query(
            `SELECT tags.id, tags.label
             FROM tags
             JOIN post_tag ON tags.id = post_tag.tag_id
             WHERE post_tag.post_id = ?`,
            [req.params.id]
        );

        // 3) Restituisco il post con i tag
        res.json({
            ...post,
            tags: tagRows
        });

    } catch (err) {
        console.error('❌ Errore GET /posts/:id:', err);
        res.status(500).json({ error: 'Errore nel recupero del post' });
    }
});

// POST /posts - Crea un nuovo post
router.post('/', async (req, res) => {
    
    const { title, content, image } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO posts (title, content, image) VALUES (?, ?, ?)',
            [title, content, image]
        );

        res.status(201).json({
            message: 'Post creato',
            id: result.insertId
        });
    } catch (err) {
        console.error('❌ Errore POST /posts:', err);
        res.status(500).json({ error: 'Errore nella creazione del post' });
    }
});

// PUT /posts/:id - Aggiorna un post
router.put('/:id', async (req, res) => {

    console.log("📩 Body ricevuto:", req.body);
    const { title, content, image } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE posts SET title = ?, content = ?, image = ? WHERE id = ?',
            [title, content, image, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Post non trovato' });
        }

        res.json({ message: `Post ${req.params.id} aggiornato` });
    } catch (err) {
        console.error('❌ Errore PUT /posts/:id:', err);
        res.status(500).json({ error: 'Errore nell\'aggiornamento del post' });
    }
});

// DELETE /posts/:id - Elimina un post
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM posts WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Post non trovato' });
        }

        res.json({ message: `Post ${req.params.id} eliminato` });
    } catch (err) {
        console.error('❌ Errore DELETE /posts/:id:', err);
        res.status(500).json({ error: 'Errore nell\'eliminazione del post' });
    }
});

module.exports = router;
