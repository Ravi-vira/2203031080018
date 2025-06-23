const { v4: uuidv4 } = require('uuid');
const store = require('../db/inMemoryStore');
const log = require('../middleware/logger');

function generateShortcode() {
  return uuidv4().slice(0, 6);
}

function createShortUrl({ url, validity, shortcode }) {
  if (!url || !/^https?:\/\//.test(url)) throw "Invalid URL";

  const code = shortcode || generateShortcode();
  if (store.urls[code]) throw "Shortcode already exists";

  const now = new Date();
  const expiry = new Date(now.getTime() + (validity || 30) * 60000);

  store.urls[code] = { url, expiry: expiry.toISOString(), createdAt: now.toISOString() };
  store.clicks[code] = [];

  log("info", `Short URL created for ${url}`, "service");
  return { shortLink: `https://hostname:port/${code}`, expiry: expiry.toISOString() };
}

function getStats(shortcode) {
  const data = store.urls[shortcode];
  if (!data) throw "Shortcode not found";

  return {
    originalUrl: data.url,
    createdAt: data.createdAt,
    expiry: data.expiry,
    totalClicks: store.clicks[shortcode]?.length || 0,
    clicks: store.clicks[shortcode]
  };
}

function recordClick(shortcode, referrer = "unknown", location = "IN") {
  const data = store.urls[shortcode];
  if (!data) throw "shortcode not found";

  const now = new Date().toISOString();
  store.clicks[shortcode].push({ timestamp: now, referrer, location });
}

module.exports = { createShortUrl, getStats, recordClick };
