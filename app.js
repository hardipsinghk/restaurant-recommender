async function getRecommendation() {
  const price = document.getElementById('price').value;
  const distance = document.getElementById('distance').value;
  const cuisine = document.getElementById('cuisine').value;
  const location = document.getElementById('location').value;
  const resultDiv = document.getElementById('result');
  const iconContainer = document.getElementById('question-circle');

  iconContainer.classList.remove('large');
  iconContainer.classList.add('small');
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = "Fetching a great spot for you...";

  const coords = await new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),  // fallback to city
      { timeout: 5000 }
    );
  });

  const queryParams = {
    price,
    distance,
    cuisine
  };

  if (coords) {
    queryParams.latitude = coords.lat;
    queryParams.longitude = coords.lon;
  } else {
    queryParams.location = location;
  }

  const query = new URLSearchParams(queryParams).toString();

  try {
    const response = await fetch(`/api/recommend?${query}`);
    if (!response.ok) throw new Error("Network error");

    const data = await response.json();
    if (!data || !data.name) throw new Error("No results");

    resultDiv.innerHTML = `
      <img src="${data.photo}" alt="Restaurant photo" style="width:100%; max-height:200px; object-fit:cover; border-radius:8px;" />
      <h2><a href="${data.map}" target="_blank" style="text-decoration:none; color:#007bff;">${data.name}</a></h2>
      <p>${data.address}</p>
      <p>Rating: ${data.rating} ⭐</p>
      <p>Price: ${data.price || 'N/A'}</p>
    `;
  } catch (err) {
    resultDiv.innerHTML = "No restaurants found or API issue.";
    console.error(err);
  }
}

function updateSliderValues() {
  document.getElementById('dist-value').innerText = document.getElementById('distance').value;
  document.getElementById('price-value').innerText = document.getElementById('price').value;
}

window.onload = () => {
  updateSliderValues();
};
