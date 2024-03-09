// Initialize the map
function initMap() {
    // Set the initial map properties (centered at a specific location, zoom level)
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    });

    // Example: Add an advanced marker to the map
    const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: -34.397, lng: 150.644 },
        map: map,
        title: 'Advanced Marker Example'
    });

    // Example: Add an info window to the marker
    const infowindow = new google.maps.InfoWindow({
        content: 'This is a custom marker!'
    });

    // Open the info window when the marker is clicked
    advancedMarker.addListener('click', function() {
        infowindow.open(map, advancedMarker);
    });

    // Additional customization, such as changing map styles, drawing shapes, etc.
    // map.setOptions({ styles: yourCustomMapStyles });
}
