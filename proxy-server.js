const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

const YELP_API_KEY = process.env.YELP_API_KEY;
const DEFAULT_LOCATION = "Toronto, Canada";  // Replace with your real city if desired

app.use(express.static('.'));

app.get('/api/recommend', async (req, res) => {
  const { price, distance } = req.query;
  const radius = Math.min(parseInt(distance || 10) * 1000, 40000); // Yelp max: 40km

  // Use the selected price level and include all lower tiers (e.g., 3 = 1,2,3)
  const priceRange = Array.from({ length: price }, (_, i) => i + 1).join(',');

  const url = `https://api.yelp.com/v3/businesses/search?term=restaurants&location=${encodeURIComponent(DEFAULT_LOCATION)}&radius=${radius}&price=${priceRange}&limit=10`;

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
  console.log(\`Proxy server running at http://localhost:\${PORT}\`);
});
  # adds a harmless empty line
