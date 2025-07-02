async function getRecommendation() {
  const price = parseInt(document.getElementById('price').value);
  const distance = parseInt(document.getElementById('distance').value);
  const resultDiv = document.getElementById('result');

  resultDiv.style.display = 'block';
  resultDiv.innerHTML = "Fetching a great spot for you...";

  try {
    const response = await fetch(`/api/recommend?price=${price}&distance=${distance}`);
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
