async function getRecommendation() {
  const price = document.getElementById('price').value;
  const distance = document.getElementById('distance').value;
  const cuisine = document.getElementById('cuisine').value;
  const location = document.getElementById('location').value;
  const resultDiv = document.getElementById('result');

  resultDiv.style.display = 'block';
  resultDiv.innerHTML = "Fetching a great spot for you...";

  const query = new URLSearchParams({
    price,
    distance,
    cuisine,
    location
  }).toString();

  try {
    const response = await fetch(`/api/recommend?${query}`);
    if (!response.ok) throw new Error("Network error");

    const data = await response.json();
    if (!data || !data.name) throw new Error("No results");

    resultDiv.innerHTML = `<strong>${data.name}</strong><br>
      ${data.address}<br>
      Rating: ${data.rating} ⭐<br>
      Price: ${data.price || 'N/A'}`;
  } catch (err) {
    resultDiv.innerHTML = "No restaurants found or API issue.";
    console.error(err);
  }
}

function updateSliderValues() {
  document.getElementById('dist-value').innerText = document.getElementById('distance').value;
  document.getElementById('price-value').innerText = document.getElementById('price').value;
}

window.onload = updateSliderValues;
