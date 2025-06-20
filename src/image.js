const axios = require('axios');
const cheerio = require('cheerio');

const pool = require('./db');

async function getImageUrl(hash) {
  const image = await getImageUrlFromDb(hash);
  if (image) {
    if (image.is_active) {
      return image.url;
    } else {
      return null;
    }
  }

  const imageUrl = await fetchImage(hash);
  await insertImageUrl(hash, imageUrl);
  return imageUrl;
}

async function getImageUrlFromDb(hash) {
  try {
    const response = await pool.query('SELECT * FROM images WHERE hash = $1', [hash]);
    return response.rows[0];
  } catch (error) {
    console.error('Error getting image URL from DB:', error.message);
    return null;
  }
}

async function insertImageUrl(hash, url) {
  try {
    await pool.query('INSERT INTO images (hash, url, is_active) VALUES ($1, $2, $3)', [hash, url, !!url]);
  } catch (error) {
    console.error('Error inserting image URL into DB:', error.message);
  }
}

async function checkImageUrl(url) {
  try {
      // "The screenshot was removed" url: //st.prntscr.com/2023/07/24/0635/img/0_173a7b_211be8ff.png
      if (url.includes('st.prntscr.com')) {
        return false;
      }

      const response = await axios.get(url);
      return response.status === 200;
  } catch (error) {
      console.error('Error checking image URL:', error.message);
      return false;
  }
}

async function fetchImage(hash) {
  console.debug('Fetching image for hash:', hash);

  const response = await axios.get(`https://prnt.sc/${hash}`);
  const $ = cheerio.load(response.data);
  const imageUrl = $('img.screenshot-image').attr('src');

  if (imageUrl) {
      const isImageValid = await checkImageUrl(imageUrl);
      if (isImageValid) {
          return imageUrl;
      } else {
          return null;
      }
  } else {
      return null;
  }
}

module.exports = {
  getImageUrl
}
