const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

const YELP_API_KEY = process.env.YELP_API_KEY;

app.use(express.static('.'));

app.get('/api/recommend', async (req, res) => {
  const { price, distance, cuisine, location } = req.query;
  const radius = Math.min(parseInt(distance || 10) * 1000, 40000);
  const priceRange = Array.from({ length: price }, (_, i) => i + 1).join(',');

  const term = cuisine || 'restaurants';
  const loc = location || 'Toronto, Canada';

  const url = `https://api.yelp.com/v3/businesses/search?term=${encodeURIComponent(term)}&location=${encodeURIComponent(loc)}&radius=${radius}&price=${priceRange}&limit=10`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + YELP_API_KEY,
      }
    });

    const data = await response.json();
    const businesses = data.businesses;

    if (!businesses || businesses.length === 0) {
      return res.status(404).json({ error: "No businesses found" });
    }

    const random = businesses[Math.floor(Math.random() * businesses.length)];

    res.json({
      name: random.name,
      address: random.location.address1,
      rating: random.rating,
      price: random.price,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log('Proxy server running at http://localhost:' + PORT);
});
