/* Filename: main.js
 * Author: Adam Novotny
 * Last update: 2/13/2016
 * Purpose: Loads jQuery main function once all other resources are loaded
*/


// updateWiki updates #wiki-accordion with wiki search articles
var updateWiki = function(city) {

    // update screen using resource
    var updateWikiScreen = function(response) {
	if (response[1].length != 0) {	 
	    $('#wiki-accordion').empty();
	    for (i = 0; i < response[1].length; i++) {
		// parse response and update wiki-accordion
		var title = response[1][i];
		var contents = response[2][i] + '<a href="' + 
		    response[3][i] + '" target="_blank"> [details]</a>';
		var collapse = (i < 2) ? " in" : ""; // open first two tabs
		$('#wiki-accordion').append('<div class="panel panel-primary">' +
					    '<div class="panel-heading">' +
					    '<h4 class="panel-title">' +
					    '<a data-toggle="collapse" data-parent="#accordion"' + 
					    'href="#collapse-wiki' + i + '">' +
					    title + '</a></h4></div>' +
					    '<div id="collapse-wiki' + i + 
					    '" class="panel-collapse collapse' + collapse  + '">' +
					    '<div class="panel-body"><p>' +
					    contents + '</p></div></div></div>');
		// update city description in jumbotron
		if (i == 0) {
		    $('#city-description').html(contents);
		}
	    }
	}
	else {
	    $('#wiki-accordion').empty();
	    $('#wiki-accordion').append('<div class="panel panel-warning">' +
					'<div class="panel-heading">' +
					'<h4 class="panel-title">' +
					'No Wiki articles - invalid input</h4></div></div>');
	}
    };

    // request resource
    $.ajax({
	url: "wiki-json/" + city,
	dataType: "json",
	success: function(response) {
	    updateWikiScreen(response['wiki-json']);
	}
    }).fail(function(e) {
	$('#wiki-accordion').empty();
	$('#wiki-accordion').append('<div class="panel panel-warning">' +
					'<div class="panel-heading">' +
					'<h4 class="panel-title">' +
					'No connection to Wiki</h4></div></div>');
    });
}; // END updateWiki
// -------------------------------------------------------------------------------------------------



// updateNYT updates #nyt-accordion with wiki search articles
var updateNYT = function(city) {

    // update screen using resource
    var updateNYTScreen = function(response) {
	//console.log(response['response']['docs']);
	
	if (response['response']['docs'].length != 0) {	 
	    $('#nyt-accordion').empty();
	    for (i = 0; i < response['response']['docs'].length; i++) {
		var article = response['response']['docs'][i]
		var title = article['headline']['main'];
		var contents = article['snippet'] + '<a href="' + 
		    article['web_url'] + '" target="_blank"> [details]</a>';
		var collapse = (i < 2) ? " in" : ""; // open first two tabs
		$('#nyt-accordion').append('<div class="panel panel-primary">' +
					    '<div class="panel-heading">' +
					    '<h4 class="panel-title">' +
					    '<a data-toggle="collapse" data-parent="#accordion"' + 
					    'href="#collapse-nyt' + i + '">' +
					    title + '</a></h4></div>' +
					    '<div id="collapse-nyt' + i + 
					    '" class="panel-collapse collapse' + collapse  + '">' +
					    '<div class="panel-body"><p>' +
					    contents + '</p></div></div></div>');
	    }
	}
	else {
	    $('#nyt-accordion').empty();
	    $('#nyt-accordion').append('<div class="panel panel-warning">' +
					'<div class="panel-heading">' +
					'<h4 class="panel-title">' +
					'No NYT articles - invalid input</h4></div></div>');
	}
	
    };

    // request resource
    $.ajax({
	url: "nyt-json/" + city,
	dataType: "json",
	success: function(response) {
	    updateNYTScreen(response['nyt-json']);
	}
    }).fail(function(e) {
	$('#nyt-accordion').empty();
	$('#nyt-accordion').append('<div class="panel panel-warning">' +
					'<div class="panel-heading">' +
					'<h4 class="panel-title">' +
					'No connection to NYT</h4></div></div>');
    });
}; // END updateNYT


// -------------------------------------------------------------------------------------------------


// updateWeather updates #weather-group with weather data
var updateWeather = function(lat, lon) {

    // update screen using resource
    var updateWeatherScreen = function(response) {
	var days = response['list']
	$('#weather-group').empty();
	for (i = 0; i < days.length; i++) {
	    var temp = String(days[i]['temp']['day']);
	    var temp0dp = Math.round(temp);
	    var date = unixDate(days[i]['dt']);
	    $('#weather-group').append('<button type="button" class="btn btn-primary">' + 
				       date.getMonth() + ' / '  + date.getDate() + '</br>' +
				       temp0dp  + '&degF</button>');
	}
    };

    // request resource
    $.ajax({
	url: 'weather-json?lat=' + lat + '&lon=' + lon,
	dataType: "json",
	success: function(response) {
	    updateWeatherScreen(response['weather-json']);
	}
    }).fail(function(e) {
	$('#weather-group').empty();
	$('#weather-group').append('<span class="label label-warning">No weather data</span>');
    });
}; // END updateWeather


// convert unix date to date object
var unixDate = function(seconds) {
    var date = new Date(seconds * 1000);
    return date;
}

// -------------------------------------------------------------------------------------------------

// given the latitude and longitude, update the "local time" display
var updateTime = function(lat, lng) {
    // clear the time display
    $('#local-time').empty();

    var updateTimeScreen = function(response) {
        // show the local time as well as the time zone
        var local_time = response['time'] + ' ' + response['zone_abbr'];
        var time_html = '<p>' + local_time + '</p>';

	    $('#local-time').append(time_html);
	}

    // Make a request for the time information.
    // If this succeeds, the time display will be updated.
    // If this fails, the time display has already been cleared.
    $.ajax({
        url: "time-json?" + 'lat=' + lat + '&lng=' + lng,
        dataType: "json",
        success: function(response) {
            updateTimeScreen(response);
        }
    });

}; // END updateTime
// -------------------------------------------------------------------------------------------------


// runs if user input is valid to update screen components
var updateScreen = function(address) {
    // fields
    var city = address[0];
    var lat = address[1];
    var lon = address[2];
    
    // methods
    $('#city-input').val("Enter city name ...");
    $('#city-title').html(city);
    updateWiki(city);
    updateNYT(city);
    updateWeather(lat, lon);
    updateTime(lat, lon);
    // Replace with Google maps
    $('#google-img').attr('src', 'http://maps.googleapis.com/maps/api/streetview?' + 
	'size=600x400&location=' + city);
    
};

// run if user input is invalid
var pageFail = function() {
    $('#city-input').val("INVALID INPUT");
};

// validate userInput using Google Maps
var validateCity = function(userInput) {
    $.ajax({
	url: "gmaps-json/" + userInput,
	dataType: "json",
	async: "false",
	success: function(response) {
	    if (response['gmaps-json']['status'] != 'ZERO_RESULTS') {
		var addressComp = response['gmaps-json']['results'][0]['address_components'];
		if (addressComp[0]['types'][0] == 'locality' && 
		    addressComp[0]['types'][1] == 'political') {
		    var geo = response['gmaps-json']['results'][0]['geometry'];
		    var longName = addressComp[0]['long_name'];
		    var lat = geo['location']['lat'];
		    var lon = geo['location']['lng'];
		    updateScreen([longName, lat, lon]);
		}
		else {
		    pageFail();
		}}
	    else {
		pageFail();
	    }
	}
    })
}; // END validateCity


var randomCity = function() {
    var cityList = ['Seoul', 'Delhi', 'Shanghai',
		    'Manila', 'New York', 'Sao Paulo', 'Mexico City', 'Cairo',
		    'Beijing', 'Osaka', 'Mumbai', 'Guangzhou', 'Moscow',
		    'Los Angeles', 'Calcutta', 'Dhaka', 'Buenos Aires', 'Istanbul',
		    'Rio de Janeiro', 'Shenzhen', 'Paris', 'Nagoya',
		    'Lima', 'Chicago', 'Kinshasa', 'Tianjin', 'Chennai'];

    cityList.sort(function() { return 0.5 - Math.random() }); // random shuffle
    validateCity(cityList[0]);
    /*testing
    var i = 0;
    setInterval(function(){
	validateCity(cityList[i]);
	i++;
    }, 3000);
    */
}


// run on load of site
$(function() {
    // user search
    $('#search-button').on('click', function() {
	var userInput = $('#city-input').val().toUpperCase();
	validateCity(userInput);
    });

    // random city selection
    $('#random-button').on('click', function() {
	randomCity();
    });

    // start with random city
    randomCity();
});
