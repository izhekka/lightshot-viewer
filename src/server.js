const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { getImageUrl } = require('./image');
const pool = require('./db');

const app = express();

app.use(cors());
app.use('/', express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/api/image/:hash', async (req, res) => {
    try {
        const { hash } = req.params;
        const imageUrl = await getImageUrl(hash);

        if (imageUrl) {
            res.json({ imageUrl });
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(500).json({ error: 'Failed to fetch image' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
