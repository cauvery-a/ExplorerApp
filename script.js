const x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;

  fetch('https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new')
  .then(response => response.text())
  .then(randomNumber => {
    console.log('Random number:', randomNumber);
  })
  .catch(error => {
    console.error('Error fetching random number:', error);
  });
}

const radiusElement = document.getElementById('radius');
const radiusInput = document.getElementById('radiusInput');

// Approximate conversion factor (highly inaccurate, adjust based on map projection and zoom level)
const pixelsPerKilometer = 100; // Replace with accurate value

radiusInput.addEventListener('input', () => {
    const radiusKm = parseFloat(radiusInput.value);
    const radiusPx = radiusKm * pixelsPerKilometer;
    radiusElement.style.width = radiusPx + 'px';
    radiusElement.style.height = radiusPx + 'px';
});