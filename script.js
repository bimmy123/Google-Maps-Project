// Victoria

let myLat;
let myLong;
let myLocation = new google.maps.LatLng(myLat, myLong);
let text = "";
let radius = 500; // meters
let destination;
let map;
let mode;
let travel;
let service;
let infoWindowPark; // for park info
let infoWindowCurrentLocation; // for your Location 

let markers = []; // list of all markers on the map



// when the window loads, intialize the map

window.onload = initializeMap;





// initalize map 
function initializeMap () {

// center map in Vicotria by default 
    map = new google.maps.Map(document.getElementById("map"), {
        center: myLocation,
        zoom:13


    });



    
    searchForParks(myLocation); 


    infoWindowCurrentLocation = new google.maps.InfoWindow();
    infoWindowPark = new google.maps.InfoWindow();


    
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            myLat = position.coords.latitude
            myLong = position.coords.longitude


            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,

            };
  

            myLocation = new google.maps.LatLng(pos.lat, pos.lng)
            createCurrentLocation(position);
            infoWindowCurrentLocation.open(map);
            map.setCenter(pos);
            searchForParks(pos);
            
            myLocation = new google.maps.LatLng(pos.lat, pos.lng)
            
          },
          () => {
            handleLocationError(true, infoWindowCurrentLocation, map.getCenter());
          },
        );
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindowCurrentLocation, map.getCenter());
      }
    
  } // initializeMap
  

  // Error message of Geolocation fails
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation.",
    );
    infoWindow.open(map);
  }
  




function myFunctionn() { 
  text = document.getElementById("fname").value;
  radius = text;
  searchForParks(myLocation, radius);
}

// Search for parks within 5 km
// from 

function searchForParks(location, radius) {

    let request = {
        location: location,
        radius: 3000,

        query: "restaurant"


    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, processParks);

}

// Process Park
function processParks(results, status) {

  if (status == google.maps.places.PlacesServiceStatus.OK) {
    deleteMarkers();
    
    // Sort the results by rating in descending order
    results.sort((a, b) => b.rating - a.rating);

    // Get the top 3 results
    const topResults = results.slice(0, 3);

    for (let i = 0; i < topResults.length; i++) {
        let place = topResults[i];
        console.log(place);
        createMarker(place);
    }
}

}

//https://developers.google.com/maps/documentation/javascript/examples/place-search#maps_place_search-javascript
function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;
  
    const scaledIcon = {

        url: 'https://clker.com/cliparts/M/V/V/f/0/b/google-maps-marker-for-residencelamontagne.svg.med.png',
        scaledSize: new google.maps.Size(25,40),
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0)


    }




    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
      icon: scaledIcon,
      title: place.name
    });
  
    google.maps.event.addListener(marker, "click", () => {
        let contentString = "<h3>" + place.name + "</h3>" + "Rating: <b>" + place.rating + "</b> / 5 <p>" + place.formatted_address + "</p>" + '<button onclick="RouteDriving()" id="button">Driving Route</button>' + '<button onclick="RouteBusing()" id="button">Bus Route</button>' + '<button onclick="RouteBiking()" id="button">Bike Route</button>';

        destination = place.geometry.location;
      infoWindowPark.setContent(contentString || "");
      infoWindowPark.open(map, marker);

    });

  
    markers.push(marker);

} // createMaker
  

  // Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
  
  // Removes the markers from the map, but keeps them in the array.
  function hideMarkers() {
    setMapOnAll(null);
  }
  
  // Shows any markers currently in the array.
  function showMarkers() {
    setMapOnAll(map);
  }
  
  // Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
    hideMarkers();
    markers = [];
  }


  function createCurrentLocation (position) {
    myLat = position.coords.latitude;
    myLong = position.coords.longitude;
    const marker = new google.maps.Marker({
      position: {lat: myLat, lng: myLong},
      map: map,
      title: 'Hello World!',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // URL to a red marker icon
        scaledSize: new google.maps.Size(30, 30), // Adjust the size if needed
      }
      
    });


  }
  
  function RouteDriving() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const gpos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,

        };
        
     
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: { lat: gpos.lat, lng: gpos.lng },
      disableDefaultUI: true,
    });
  
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("sidebar"));
  
    const control = document.getElementById("floating-panel");
  
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
    
    calculateAndDisplayRoute(directionsService, directionsRenderer, gpos, travel);
  },
  () => {
    handleLocationError(true, infoWindowCurrentLocation, map.getCenter());
  },
);
    //document.getElementById("start").addEventListener("change", onChangeHandler);
    //document.getElementById("end").addEventListener("change", onChangeHandler);
  }
  
  function calculateAndDisplayRoute(directionsService, directionsRenderer, gpos, travel) {
    //const start = myLocation;
    //const end = document.getElementById("end").value;
    document.getElementById('drive').style.display = 'none';
    document.getElementById('bus').style.display = 'block';
    document.getElementById('bike').style.display = 'block';
    directionsService
      .route({
        origin: gpos,
        destination: destination,
        
        travelMode: google.maps.TravelMode.DRIVING
        
        
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((e) => window.alert("Directions request failed due to " + status));
  }
  


  function RouteBusing() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const gpos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,

        };
        
     
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: { lat: gpos.lat, lng: gpos.lng },
      disableDefaultUI: true,
    });
  
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("sidebar"));
  
    const control = document.getElementById("floating-panel");
  
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
    
    calculateAndDisplayRoute1(directionsService, directionsRenderer, gpos);
  },
  () => {
    handleLocationError(true, infoWindowCurrentLocation, map.getCenter());
  },
);
    //document.getElementById("start").addEventListener("change", onChangeHandler);
    //document.getElementById("end").addEventListener("change", onChangeHandler);
  }
  
  function calculateAndDisplayRoute1(directionsService, directionsRenderer, gpos) {
    //const start = myLocation;
    //const end = document.getElementById("end").value;
    document.getElementById('bus').style.display = 'none';
    document.getElementById('drive').style.display = 'block';
    document.getElementById('bike').style.display = 'block';
    directionsService
      .route({
        origin: gpos,
        destination: destination,
        
        travelMode: google.maps.TravelMode.TRANSIT
        
        
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((e) => window.alert("Directions request failed due to " + status));
  }
  

  function RouteBiking() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const gpos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,

        };
        
     
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: { lat: gpos.lat, lng: gpos.lng },
      disableDefaultUI: true,
    });
  
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("sidebar"));
  
    const control = document.getElementById("floating-panel");
  
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
    
    calculateAndDisplayRoute2(directionsService, directionsRenderer, gpos, travel);
  },
  () => {
    handleLocationError(true, infoWindowCurrentLocation, map.getCenter());
  },
);
    //document.getElementById("start").addEventListener("change", onChangeHandler);
    //document.getElementById("end").addEventListener("change", onChangeHandler);
  }
  
  function calculateAndDisplayRoute2(directionsService, directionsRenderer, gpos, travel) {
    //const start = myLocation;
    //const end = document.getElementById("end").value;
    document.getElementById('drive').style.display = 'block';
    document.getElementById('bus').style.display = 'block';
    document.getElementById('bike').style.display = 'none';
    directionsService
      .route({
        origin: gpos,
        destination: destination,
        
        travelMode: google.maps.TravelMode.BICYCLING
        
        
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((e) => window.alert("Directions request failed due to " + status));
  }
  




window.initMap = RouteDriving;
  