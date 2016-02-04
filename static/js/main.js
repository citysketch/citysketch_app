
// updateWiki updates #wiki-accordion with wiki search articles
var updateWiki = function(city) {
    var $city = $('#city-input').val().toUpperCase();
    // TO DO AJAX -------------------------

    // TO DO ---------------- udpate AJAX contents
    $('#wiki-accordion').empty();
    for (i = 0; i < 3; i++) {
	$title = $city + " title article " + i;
	$contents = $city + " article contents " + i;
	$collapse = (i < 2) ? " in" : "";
	$('#wiki-accordion').append('<div class="panel panel-primary">' +
				    '<div class="panel-heading">' +
				    '<h4 class="panel-title">' +
				    '<a data-toggle="collapse" data-parent="#accordion"' + 
				    'href="#collapse' + i + '">' +
				    $title + '</a></h4></div>' +
				    '<div id="collapse' + i + 
				    '" class="panel-collapse collapse' + $collapse  + '">' +
				    '<div class="panel-body"><p>' +
				    $contents + '</p></div></div></div>');

    }
    alert("City searched: " + $city);
    //END wiki
};

// run on load of site
$(function() {    
    
    $('#search-button').on('click', function() {
	updateWiki();
    });
});
