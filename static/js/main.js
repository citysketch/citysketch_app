/* Filename: main.js
 * Author: Adam Novotny
 * Last update: 2/13/2016
 * Purpose: Loads jQuery main function once all other resources are loaded
*/

// ------------------------------------------------------------------------
// Variables

// Generic city class
var City = function(ci, co, loc) {
    this.name = ci;
    this.country = co;
    this.loc = loc;
}

// contains currenly city details initialized as City class
var currentCity;

// ------------------------------------------------------------------------
// update title and country
var updateCityTitle = function() {
    $('#city-input').val("");
    $('#city-input').attr('placeholder', currentCity.name);
    $('#city-title').html(currentCity.name + " (" + currentCity.country + ")");
    // check if tested
    $.ajax({
	url: "tested-city?" + 'city=' + currentCity.name,
	dataType: "json",
	success: function(response) {
	    if (response['response'] == 'false') {
		$('#city-title').html(currentCity.name + " (" + currentCity.country + ")" + 
				     '<span id="beta-city"> beta results</span>');
	    }
	}
    })
}


// given the city name, update description in jumbotron
var updateCityDescription = function() {
    // Make a request for the description.
    var setText = function() {
       var city = currentCity.name;
       var country = currentCity.country;

       $.ajax({
	   url: 'city-description?city=' + city + '&country=' + country,
	   dataType: "json",
	   success: function(response) {
	       $('#city-description').empty();
	       var contents = response['text'] + '<a href="' + 
		   response['url'] + '" target="_blank"> [details]</a>';
	       $('#city-description').append('<p>' + contents + '</p>');
	   },
	   error: function () {
               setTimeout(function () {
                   setText();
               }, 2000)
           }
       });
    };
 
    $('#city-description').empty();
    $('#city-description').append('<p>Updating city description</p>');
    setText();
}; // END cityDescription
// -------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------
// updateWiki updates #wiki-accordion with wiki search articles
var updateWiki = function() {
    // update screen using resource
    var updateWikiScreen = function(response) {
        $('#wiki-accordion').empty();
        if (response[1].length != 0) {	 	    
            for (i = 0; i < response[1].length; i++) {
            // parse response and update wiki-accordion
            var title = response[1][i];
            var details_link = response[2][i] + '<a href="' + 
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
                            details_link + '</p></div></div></div>');
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

    var city = currentCity.name;
    var country = currentCity.country;

    // request resource
    $.ajax({
	url: 'wiki-json?city=' + city + '&country=' + country,
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


// Update twitter feed
var updateTwitter = function() {
    var city = currentCity.name;
    var lat = currentCity.loc['lat'];
    var lng = currentCity.loc['lng'];
    // empty targets
    $('#twitter-content').empty();
    $('#twitter-link').empty();
    // Make a request for the description.
   $.ajax({
       url: "twitter-json?" + 'city=' + city + '&lat=' + lat + '&lng=' + lng,
       dataType: "json",
       success: function(response) {
	   $('#twitter-link').append('<a href="https://twitter.com/search?q=' + city + '" target="_blank">' +
				     'Twitter ' + city + '</a>');
	   
	   if (response['twitter-json'] == 'twitter_not_allowed') {
	       $('#twitter-content').append('<p>No twitter feed available</p>');
	   }
	   else {
	       var tweets = response['twitter-json']
	       for (i = 0; i < tweets.length; i++) {
		   var date = tweets[i][0]['date'].split('\+')[0] + " (GMT)"; // get date
		   // output item to be appended
		   var item = '<p><span class="twitter-date">' + date + "</span></br>" +
		       tweets[i][1]['text'];
		   
		   // append image, if exists
		   $('#twitter-content').append(item);
		   try {
		       var imageUrl = tweets[i][3]['image_url'];
		       $('#twitter-content').append('<img class="twitter-image" src="' + imageUrl + '">');
		   }
		   catch(e) {}
		   $('#twitter-content').append('<hr>');
	       }
	   }
       },
       error: function () {
           $('#twitter-content').append('<p>No twitter feed available</p>');
       }
   });
	
}; // END updateTwitter
// -------------------------------------------------------------------------------------------------


// updateNYT updates #nyt-accordion with wiki search articles
var updateNYT = function() {
    // update screen using resource
    var updateNYTScreen = function(response) {
        $('#nyt-accordion').empty();
        if (response['response']['docs'].length != 0) {	 
            for (i = 0; i < response['response']['docs'].length; i++) {
            var article = response['response']['docs'][i]
            var title = article['headline']['main'];
            var contents = article['snippet'] + '<a href="' + 
                article['web_url'] + '" target="_blank"> [details]</a>';
            var collapse = (i < 5) ? " in" : ""; // open 5 tabs
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
        } else {
            $('#nyt-accordion').append('<div class="panel panel-warning">' +
                        '<div class="panel-heading">' +
                        '<h4 class="panel-title">' +
                        'No NYT articles - invalid input</h4></div></div>');
        }
    };

    var city = currentCity.name;
    var country = currentCity.country;

    // request resource
    $.ajax({
	url: 'nyt-json?city=' + city + '&country=' + country,
	dataType: 'json',
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
var updateWeather = function(unit) {
    // update screen using resource
    var updateWeatherScreen = function(response) {
	$('#weather-group').empty();
	var days = response['list']
	var unitSign = '&degF' // default unit is degF
	for (i = 0; i < days.length; i++) {
	    var temp = String(days[i]['temp']['day']);
	    if (unit == 'C') { // select temperature units
		temp = (temp - 32) * 5 / 9;
		unitSign = '&degC'
	    }
	    var temp0dp = Math.round(temp);
	    var date = unixDate(days[i]['dt']);
	    var description = days[i]['weather'][0]['main'];
	    var buttonID = "weather-button-" + i;
	    var background = "static/img/weather_conditions/" + description + ".png";
	    $('#weather-group').append('<a href="http://openweathermap.org/find?q=' + currentCity.name 
				       + '" target="_blank">' + 
				       '<button type="button" class="btn btn-default weather-button" ' +
				       'id=' + buttonID + '">' + 
				       date.getMonth() + ' / '  + date.getDate() + '</br>' +
				       temp0dp  + unitSign + '</br>' +
				       '<img src="' + background  + '"></br>' + 
				       description + '</button></a>');
	}
    };

    // request resource
    $.ajax({
	url: 'weather-json?lat=' + currentCity.loc['lat'] + '&lon=' + currentCity.loc['lng'],
	dataType: "json",
	success: function(response) {
	    updateWeatherScreen(response['weather-json']);
	}
    }).fail(function(e) {
	$('#weather-group').empty();
	$('#weather-group').append('<span class="label label-warning">No weather data</span>');
    });
}; // END updateWeather
// -------------------------------------------------------------------------------------------------


// given the latitude and longitude, update the "local time" display
var updateTime = function() {
    // refreshed screen
    var updateTimeScreen = function(response) {
	$('#local-time').empty();
        // show the local time as well as the time zone
        var local_time = response['time'] + " (" + response['zone_name'] 
	    + " "  + response['zone_abbr'] + ")";
        var time_html = '<p>' + local_time + '</p>';
	$('#local-time').append(time_html);
    }

    // Make a request for the time information.
    // If this succeeds, the time display will be updated.
    // If this fails, the time display has already been cleared.
    var getTime = function() {
	$.ajax({
            url: "time-json?" + 'lat=' + currentCity.loc['lat'] + '&lng=' + currentCity.loc['lng'],
            dataType: "json",
            success: function(response) {
		updateTimeScreen(response);
            },
	    error: function () {
                setTimeout(function () {
                    getTime();
                }, 2000) // repeat request if no response after 2 seconds
            }
	});
    }

    $('#local-time').empty();
    $('#local-time').append('<p>Updating local time</p>');
    getTime();

}; // END updateTime



// helper functions --------------------------------------------------------------------------------------


// runs if user input is valid to update screen components
var updateScreen = function() {
    
    // methods
    updateCityTitle();
    updateWiki();
    updateCityDescription();
    updateTime();
    updateTwitter();
    updateNYT();
    updateWeather('F');
 
    // Set link to google maps
    $('#gmaps-link').attr('href', 'https://www.google.com/maps/place/' + currentCity.name);
    $('#gmaps-link').html("Google Maps " + currentCity.name)
};


// convert unix date to date object
var unixDate = function(seconds) {
    var date = new Date(seconds * 1000);
    return date;
}


// run if user input is invalid
var pageFail = function() {
    $('#city-input').val("");
    $('#city-input').attr('placeholder', "INVALID INPUT");
};

// Create a City object from a city JSON object received from the backend
var city_from_json = function(city_json) {
    var geo = city_json['location'];
    currentCity = new City(city_json['name'],
			   city_json['country'],
			   city_json['location']);
    return currentCity;
}


// validate userInput using Google Maps
var validateCity = function(userInput) {
    $.ajax({
	url: "gmaps-json?" + 'city=' + userInput,
	dataType: "json",
	async: "false",
	success: function(response) {
        var city_json = response['gmaps-json'];
	    if (city_json == 'none') {
            pageFail();
        } else {
            currentCity = city_from_json(city_json);
            updateScreen();
        }
    },
	error: function(jqXHR, textStatus, errorThrown) {
	    pageFail();
        }
    })
}; // END validateCity

// generate random city
var randomCity = function() {
    var getRandom = function() {
	$.ajax({
	    url: "random-city",
	    dataType: "json",
	    async: "false",
	    success: function(response) {
		validateCity(response['random-city']);
	    }
	});
    }
    getRandom();
}


// START populateAutocomplete: autocomplete options
var populateAutocomplete = function() {
    $.ajax({
	url: "autocomplete",
	dataType: "json",
	success: function(response) {
	    $('#city-input').autocomplete({
		lookup: response,
		onSelect: function (suggestion) {
		    validateCity(suggestion.value);
		}
	    });
	}
    });
}; // END populateAutocomplete


// Use the browser's built-in functionality to quickly and safely escape the
// string
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str)); //.createTextNode escapes strings
    return div.innerHTML;
};


// run on load of site
$(function() {
    // autocomplete
    populateAutocomplete();

    // user search
    $('#search-button').on('click', function() {
	var userInput = escapeHtml($('#city-input').val());
	validateCity(userInput);
    });

    // random city selection
    $('#random-button').on('click', function() {
	randomCity();
    });

    // refresh city
    $('#refresh-button').on('click', function() {
	validateCity(currentCity.name);
    });

    // weather to deg C
    $('#degC-button').on('click', function() {
	updateWeather('C');
    });

     // weather to deg C
    $('#degF-button').on('click', function() {
	updateWeather('F');
    });

    // start with random city
    randomCity();
});
