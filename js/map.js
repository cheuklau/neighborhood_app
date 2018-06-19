// Initialize map
var map;

// Initialize array to hold markers
var markers = [];

// Create new infowindow instance
var infowindow;

function initMap() {
    /* Function to initialize the map.

       This is automatically called after Google Maps API connets.
    */

    // Creating a new map instance
    map = new google.maps.Map(document.getElementById('map'), {

        // Default view of the United States
        center: {lat: 37.09024, lng: -99.712891},
    
        // Zoom to center on the United States
        zoom: 4.0

    });

    // Initialize infowindow instance
    infowindow = new google.maps.InfoWindow();

    // Loop through each lab to create one marker per lab
    for (var i = 0; i < initialLabs.length; i++) {

        // Get the name and location of current lab
        var location = initialLabs[i].location;
        var title = initialLabs[i].title;

        // Create marker for current lab and push into markers array
        var marker = new google.maps.Marker({
            map: map,
            position: location,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });

        // Create event to open infowindow when marker is clicked
        marker.addListener('click', function() {
            populateInfoWindow(this);
        });

        // Store marker
        markers.push(marker);

    }

};

function populateInfoWindow(marker) {
    /* Populate infowindow with the name of the lab for clicked marker.

       Args:
        marker: lab observable chosen by user
    */

    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
        });
    }

};

function displaySpecificMarker(clickedLab) {
    /* Display marker of the clicked lab, hide the rest.

       Args:
        clickedLab: lab observable chosen by user
    */

    // Loop through the markers array
    for (var i = 0; i < markers.length; i++) {

        // Display marker if it matches the title of the clicked lab,
        // otherwise hide it.
        if (markers[i].title == clickedLab.title()){
            markers[i].setMap(map);
            populateInfoWindow(markers[i]);
        } else {
            markers[i].setMap(null);
        }

    }

};

function displayAllMarkers() {
    /* Re-displays all markers.

    */

    // Close all infowindows before displaying all markers.
    infowindow.close();

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }

};