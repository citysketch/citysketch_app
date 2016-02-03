
// loadData updates all city-specific page areas
var loadData = function() {
    var $city = $('#city-input').val();
    
    // TO DO streetview

    // TO DO wiki
    alert("City searched: " + $city);
    // END wiki

    return false;
};


// run on load of site
$(function() {
    alert("Expected launch:  March 1, 2016");
    $('#search-form').submit(loadData);
});
