var express = require('express');
var router = express.Router();

// custom modules
var get_data = require("../get_data");

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render("index", {title:"Home | Nightlife"});
});

// bar details page that will show all bars around the location given by the user
router.get('/bars/:ltype/:location', function(req, res) {
	// get locaton data from the url
	var search_query;
	if(req.params.ltype == "loc"){
		search_query = {
			location: req.params.location,
		};
	} else {
		search_query = {
			ll : req.params.location
		};
	}
	// hit yelp search api with the location data given by user
	get_data(search_query, function(err,responce,body){
		if(err)throw err;
		var data = JSON.parse(body);
		if(data.error){
			// yelp can not search the location
			res.end(data.error.text);
		} else {
			// show user required data
			res.render("details", {
				title : "Bars | Nightlife",
				bar_list : data.businesses
			});
			// res.end(JSON.stringify(data.businesses[0]));
		}
	});
});

module.exports = router;
