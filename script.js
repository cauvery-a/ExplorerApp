var current_location_div = document.getElementById("current_location_div");
var distance_radius = document.getElementById('distance_radius');
var distance_radius_output = document.getElementById('distance_radius_output');
var generate_location_button = document.getElementById("generate_location_button");
var generate_location_loader = document.getElementById("generate_location_loader");
var generate_location_div = document.getElementById("generate_location");
var generate_location_output = document.getElementById("generate_location_output");
var current_latitude;
var current_longitude;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
} 

function showPosition(position) {
    current_latitude = position.coords.latitude
    current_longitude = position.coords.longitude

    var current_location_p = document.createElement("p");
    current_location_p.innerHTML = "Latitude: " + current_latitude + 
        "<br>Longitude: " + current_longitude;
    
    var current_location_h4 = document.createElement("h4");
    current_location_h4.innerHTML = "Current Location Coordinates";

    current_location_div.appendChild(current_location_h4);
    current_location_div.appendChild(current_location_p);
}

async function fetch_random_number() {
    var random_number;
    try {
      var response = await fetch('https://www.random.org/integers/?num=1&min=1&max=1000000&col=1&base=10&format=plain&rnd=new');
      random_number = await response.text();
      console.log('Fetched random number:', random_number);
      // You can now use or save the randomNumber variable here
    } catch (error) {
      console.error('Error fetching random number:', error);
      random_number = 10000;
    }
    return random_number;
}

async function generate_random_location(centerLat, centerLng, radiusInKm) {
    var rand_angle_number;
    var rand_dist_number;
    // Convert radius from kilometers to degrees
    var radiusInDegrees = parseInt(radiusInKm) / 111.32;  // 1 degree of latitude ~ 111.32 km
    console.log(radiusInDegrees);

    random_number_1 = await fetch_random_number();
    random_number_2 = await fetch_random_number();

    if(random_number_1 < random_number_2) {
        rand_angle_number = parseFloat(random_number_1) / parseFloat(random_number_2);
    }
    else {
        rand_angle_number = parseFloat(random_number_2) / parseFloat(random_number_1);
    }

    // Generate random angles in radians (0 - 2*PI)
    var randomAngle = rand_angle_number * 2 * Math.PI;
    console.log(randomAngle);

    random_number_1 = await fetch_random_number();
    random_number_2 = await fetch_random_number();
  
    if(random_number_1 < random_number_2) {
        rand_dist_number = parseFloat(random_number_1) / parseFloat(random_number_2);
    }
    else {
        rand_dist_number = parseFloat(random_number_2) / parseFloat(random_number_1);
    }
    console.log(rand_dist_number);

    // Generate random distance within the radius
    var randomDistance = parseFloat(rand_dist_number) * parseFloat(radiusInDegrees);
    console.log(randomDistance);
  
    // Calculate new latitude based on angle and distance
    var newLat = centerLat + (randomDistance * Math.sin(randomAngle));
  
    // Calculate new longitude based on angle and distance, considering Earth's sphericity
    var newLng = centerLng + (randomDistance * Math.cos(randomAngle) / Math.cos(centerLat * Math.PI / 180));
  
    // Ensure new latitude stays within -90 to 90 degrees
    var clampedLat = Math.max(-90, Math.min(90, newLat));

    return {
      latitude: clampedLat,
      longitude: newLng
    };
  }

async function generate_location_coordinates() {
    generate_location_loader.remove();

    // Generate the random location
    var generated_coordinates = await generate_random_location(current_latitude, current_longitude, distance_radius.value);
    var generated_latitude = generated_coordinates.latitude;
    var generated_longitude = generated_coordinates.longitude;
    // Display the generated random location
    var hr_element = document.createElement("hr");
    generate_location_div.appendChild(hr_element);

    var generated_location_p = document.createElement("p");
    generated_location_p.innerHTML = "Latitude: " + generated_latitude + 
        "<br>Longitude: " + generated_longitude;
    
    generate_location_div.appendChild(generated_location_p);
    
    // Add the go to google maps button
    var google_maps_button = document.createElement("a");
    google_maps_button.href = "https://maps.google.com/maps?q="+generated_latitude+","+generated_longitude+"&hl=es;z=14&amp;"
    google_maps_button.classList.add("btn", "btn-primary");
    google_maps_button.textContent = "Go to Google Maps";
    google_maps_button.target = "_blank";
    generate_location_div.appendChild(google_maps_button);

    // generate_location_output.appendChild();
}

function generate_location() {
    generate_location_button.remove();
    generate_location_loader.removeAttribute("hidden"); 
    var wait_time = 15;
    const promises = [];
    for (let i = 1; i <= wait_time; i++) {
        promises.push(new Promise(resolve => setTimeout(() => {
            console.log(i);
            resolve();
        }, i * 1000)));
    }
    Promise.all(promises).then(() => {
        generate_location_coordinates();
    });
}

window.onload = function() {
    getLocation();

    distance_radius.addEventListener('input', function()  {
        distance_radius_output.innerHTML = distance_radius.value + " km";
    });
}

// //     // currentLocation = "https://maps.google.com/maps?q="+currentLatitude+","+currentLongitude+"&hl=es;z=14&amp;output=embed"
// //     // var newIframe = document.createElement("iframe");
// //     // newIframe.src = currentLocation
// //     // newIframe.id = "map"
// //     // map_container_div.appendChild(newIframe)
// //     // console.log(currentLocation)
// //     // document.getElementById("map").src = "https://maps.google.com/maps?q="+currentLatitude+","+currentLongitude+"&hl=es;z=14&amp;output=embed"

// //   fetch('https://www.random.org/integers/?num=1&min=0&max=1&col=1&base=10&format=plain&rnd=new')
// //   .then(response => response.text())
// //   .then(randomNumber => {
// //     console.log('Random number:', randomNumber);
// //   })
// //   .catch(error => {
// //     console.error('Error fetching random number:', error);
// //   });
// // }
// // getLocation()

// // // const radiusElement = document.getElementById('radius');
// // // const radiusInput = document.getElementById('radiusInput');

// // // // Approximate conversion factor (highly inaccurate, adjust based on map projection and zoom level)
// // // const pixelsPerKilometer = 100; // Replace with accurate value

// // // radiusInput.addEventListener('input', () => {
// // //     const radiusKm = parseFloat(radiusInput.value);
// // //     const radiusPx = radiusKm * pixelsPerKilometer;
// // //     radiusElement.style.width = radiusPx + 'px';
// // //     radiusElement.style.height = radiusPx + 'px';
// // // });

function generateRandomLocation(centerLat, centerLng, radiusInKm) {
    // Convert radius from kilometers to degrees
    const radiusInDegrees = radiusInKm / 111.32;  // 1 degree of latitude ~ 111.32 km

    // Generate random angles in radians (0 - 2*PI)
    const randomAngle = Math.random() * 2 * Math.PI;
  
    // Generate random distance within the radius
    const randomDistance = Math.random() * radiusInDegrees;
  
    // Calculate new latitude based on angle and distance
    const newLat = centerLat + (randomDistance * Math.sin(randomAngle));
  
    // Calculate new longitude based on angle and distance, considering Earth's sphericity
    const newLng = centerLng + (randomDistance * Math.cos(randomAngle) / Math.cos(centerLat * Math.PI / 180));
  
    // Ensure new latitude stays within -90 to 90 degrees
    const clampedLat = Math.max(-90, Math.min(90, newLat));

    
    fetch('https://www.random.org/integers/?num=1&min=1&max=1000000&col=1&base=10&format=plain&rnd=new')
    .then(response => response.text())
    .then(randomNumber => {
        console.log('Random number 1 :', randomNumber);
    })
    .catch(error => {
        console.error('Error fetching random number:', error);
    });
    
    fetch('https://www.random.org/integers/?num=1&min=1&max=1000000&col=1&base=10&format=plain&rnd=new')
    .then(response => response.text())
    .then(randomNumber => {
        console.log('Random number 2 :', randomNumber);
    })
    .catch(error => {
        console.error('Error fetching random number:', error);
    });

    return {
      latitude: clampedLat,
      longitude: newLng
    };
  }
  
  // Example usage
//   const centerLat = 37.7793;
//   const centerLng = -122.4181;
//   const radiusInKm = 1;
  
//   const randomLocation = generateRandomLocation(centerLat, centerLng, radiusInKm);
//   console.log(randomLocation);




