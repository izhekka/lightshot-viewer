const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('.'));

async function checkImageUrl(url) {
    try {
        const response = await axios.get(url);
        return response.status === 200;
    } catch (error) {
        console.error('Error checking image URL:', error.message);
        return false;
    }
}

app.get('/api/image/:hash', async (req, res) => {
    try {
        console.log('Fetching image for hash:', req.params.hash);

        const { hash } = req.params;
        const response = await axios.get(`https://prnt.sc/${hash}`);
        const $ = cheerio.load(response.data);
        const imageUrl = $('img.screenshot-image').attr('src');

        if (imageUrl) {
            const isImageValid = await checkImageUrl(imageUrl);
            if (isImageValid) {
                res.json({ imageUrl });
            } else {
                res.status(404).json({ error: 'Image URL is not accessible' });
            }
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
    console.log(`Server running on http://localhost:${PORT}`);
});