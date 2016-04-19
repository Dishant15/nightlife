function goSearch() {
	// get location form the input text box and replace all the space in it with + sign
	var location = $("#search").val().split(' ').join("+");
	window.location.href = "/bars/loc/" + location;
}

function locSearch() {
	if (navigator.geolocation) {
		// got weather data
		navigator.geolocation.getCurrentPosition(function(position) {
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;
			window.location.href = "/bars/lat/" + latitude + ',' + longitude;
		});
	} else {
		// warther data access denied
		alert("Weather data could not be accessed !! Please fill your location manualy");
	}
}

$(document).ready(function(){
	$("#search").keyup(function(){
		if(event.keyCode == 13){
			goSearch();
		}
	});

	$("#locsearch").on("click", locSearch);

	$(".glyphicon-search").click(goSearch);
});