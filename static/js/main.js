// updateWiki updates #wiki-accordion with wiki search articles
var updateWiki = function(city) {
    // update screen using resource
    var updateWikiScreen = function(response) {
	if (response[1].length != 0) {	 
	    $('#wiki-accordion').empty();
	    for (i = 0; i < response[1].length; i++) {
		// parse response
		var title = response[1][i];
		var contents = response[2][i] + '<a href="' + 
		    response[3][i] + '" target="_blank"> [link]</a>';
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
	url: "wiki/" + city,
	dataType: "json",
	success: function(response) {
	    updateWikiScreen(response['wiki-json']);
	}
    }).fail(function(e) {
	alert("No connection")
    });
}; // END updateWiki



// run on load of site
$(function() {    
    // ADD random functionality

    $('#search-button').on('click', function() {
	var city = $('#city-input').val().toUpperCase();
	updateWiki(city);
    });
});
