const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

const YELP_API_KEY = process.env.YELP_API_KEY;

app.use(express.static('.'));

app.get('/api/recommend', async (req, res) => {
  const { price, distance, cuisine, postal, latitude, longitude } = req.query;
  const radius = Math.min(parseInt(distance || 10) * 1000, 40000);
  const priceRange = Array.from({ length: price }, (_, i) => i + 1).join(',');
  const term = cuisine || 'restaurants';

  let url = '';
  if (postal) {
    url = 'https://api.yelp.com/v3/businesses/search?term=' + encodeURIComponent(term) +
          '&location=' + encodeURIComponent(postal) +
          '&radius=' + radius + '&price=' + priceRange + '&limit=10';
  } else if (latitude && longitude) {
    url = 'https://api.yelp.com/v3/businesses/search?term=' + encodeURIComponent(term) +
          '&latitude=' + latitude + '&longitude=' + longitude +
          '&radius=' + radius + '&price=' + priceRange + '&limit=10';
  } else {
    return res.status(400).json({ error: "No valid location info provided" });
  }

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
    const mapsLink = 'https://www.google.com/maps/search/?api=1&query=' +
                     encodeURIComponent(random.name + ' ' + random.location.address1);

    // Check if "halal" appears in categories
    const isHalal = random.categories?.some(cat => cat.title.toLowerCase().includes("halal")) || false;

    res.json({
      name: random.name,
      address: random.location.address1,
      rating: random.rating,
      price: random.price,
      photo: random.image_url,
      map: mapsLink,
      halal: isHalal
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log('Proxy server running at http://localhost:' + PORT);
});
