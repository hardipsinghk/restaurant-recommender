const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

const YELP_API_KEY = "YOUR_YELP_API_KEY"; // Replace this with your real key
const DEFAULT_LOCATION = "New York, NY";  // Replace with geolocation if needed

app.use(express.static('.'));

app.get('/api/recommend', async (req, res) => {
  const { price, distance } = req.query;
  const radius = Math.min(parseInt(distance || 10) * 1000, 40000); // Yelp max radius: 40 km

  const priceRange = Array.from({ length: price }, (_, i) => i + 1).join(',');

  const url = `https://api.yelp.com/v3/businesses/search?term=restaurants&location=${encodeURIComponent(DEFAULT_LOCATION)}&radius=${radius}&price=${priceRange}&limit=10`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`,
      }
    });

    const data = await response.json();
    const first = data.businesses && data.businesses[0];

    if (!first) {
      return res.status(404).json({ error: "No businesses found" });
    }

    res.json({
      name: first.name,
      address: first.location.address1,
      rating: first.rating,
      price: first.price,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
