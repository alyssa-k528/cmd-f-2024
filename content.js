const script = document.createElement('script');
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAbauG84e4IlL78ZiAmnx0DpcFiowviJKs";

document.head.appendChild(script);

function initMap(){
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: { lat: -34.397, lng: 150.644 }
    });
    
    const marker = new google.maps.Marker({
        position: { lat: -34.397, lng: 150.644 },
        map: map
    });
}

console.log("Content script is running!");

function addCustomMarker() {
    // Select the map container element
    const mapContainer = document.querySelector('div.widget-scene-canvas');
  
    if (mapContainer) {
      // Create a marker element
      const marker = document.createElement('div');
      marker.style.width = '20px';
      marker.style.height = '20px';
      marker.style.background = 'url("resources/penguin_walking.png")';
      marker.style.backgroundSize = 'cover';
      marker.style.position = 'absolute';
      marker.style.top = '50%';
      marker.style.left = '50%';
      marker.style.transform = 'translate(-50%, -50%)';
      marker.style.cursor = 'pointer'; // Optional: Set a cursor for interaction
  
      // Append the marker to the map container
      mapContainer.appendChild(marker);
    }
  }
  
  // Wait for the page to load before adding the custom marker
  window.addEventListener('load', addCustomMarker);