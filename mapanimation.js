

var map;
var markers = [];

// load map
function init(){
	var myOptions = {
		zoom      : 12,
		center    : {lat:38.92796287536621,lng:-77.026433563232416},
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	var element = document.getElementById('map');
  	map = new google.maps.Map(element, myOptions);
  	addMarkers();
}


async function addMarkers(){
	var locations = await getBusLocations();
	locations.forEach(function(bus){
		var marker = getMarker(bus.VehicleID);		
		if (marker){
			moveMarker(marker,bus);
		}
		else{
			addMarker(bus);			
		}
	});

	console.log(new Date());
	setTimeout(addMarkers,15000);
}

async function getBusLocations(){
    var params = {
        "api_key": "bdfb8b29f9af470f99148f94dfec5e7b",
        "RouteID": "70",
        };
      
    var url = "https://api.wmata.com/Bus.svc/json/jBusPositions?" + $.param(params);
	var response = await fetch(url);
	var json     = await response.json();
    console.log(json);
	return json.BusPositions;
}

function addMarker(bus){
	var icon = getIcon(bus);
	var marker = new google.maps.Marker({
	    position: {
	    	lat: bus.Lat, 
	    	lng: bus.Lon
	    },
	    map: map,
	    icon: icon,
	    id: bus.VehicleID
	});
	markers.push(marker);
}

function getIcon(bus){
	if (bus.DirectionText === "NORTH") {
		return 'red.gif';
	}
	return 'blue.gif';	
}

function moveMarker(marker,bus) {
	var icon = getIcon(bus);
	marker.setIcon(icon);

    marker.setPosition( {
    	lat: bus.Lat, 
    	lng: bus.Lon
	});
}

function getMarker(id){
	var marker = markers.find(function(item){
		return item.id === id;
	});
	return marker;
}

window.onload = init;