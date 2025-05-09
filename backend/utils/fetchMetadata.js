const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async function fetchMetadata(url) {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || 'No title';
    let favicon = $('link[rel="icon"]').attr('href') || '/favicon.ico';
    if (!favicon.startsWith('http')) favicon = new URL(favicon, url).href;
    return { title, favicon };
  } catch (e) {
    return { title: 'Unavailable', favicon: '' };
  }
};
