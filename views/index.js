var express = require('express');
var router = express.Router();
var async = require("async");

// custom modules
var get_data = require("../get_data");

var Bars = require("../models/bars");

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render("index", {
		title : "Home | Nightlife",
		loggeduser : req.user
	});
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
			res.render("error", {message : data.error.text, loggeduser: req.user});
		} else {
			// show user required data
			var bar_list = [];
			// bellow async task must be done in sync
			async.each(data.businesses,
				// 2nd param is the function saves or gets bars from db
				function(bar, callback){
					Bars.findOne({bar_id : bar.id}, function(err, dbbar){
						if(err) throw err;
						if(!dbbar){
							// bar not found create new
							new Bars({
								bar_id : bar.id,
							}).save(function(err){
								bar_list.push({
									name:bar.name,
									image_url : bar.image_url,
									snippet_text : bar.snippet_text,
									id : bar.id,
									count : 0
								});
							});
						} else {
							// bar found use its dbbar
							bar_list.push({
								name:bar.name,
								image_url : bar.image_url,
								snippet_text : bar.snippet_text,
								id : bar.id,
								count : dbbar.count
							});
						}
						callback();
					});
						
				},
				// 3rd param is the function to call when everything's done
				function(){
					res.render("details", {
						title : "Bars | Nightlife",
						bar_list : bar_list,
						prev_path : '^bars^' + req.params.ltype + '^' + req.params.location,
						loggeduser : req.user
					});
				}
			);
		}
	});
});

module.exports = router;
