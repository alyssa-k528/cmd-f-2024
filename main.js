let map;

// Initialize the map
function initMap() {
    // Set the initial map properties (centered at a specific location, zoom level)
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    });
}

// Use addEventListener to ensure that the script is loaded asynchronously
document.addEventListener("DOMContentLoaded", initMap);
