var express = require('express');
var router = express.Router();

// custom modules
var get_data = require("../get_data");

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render("index", {title:"Nightlife"});
});

router.get('/bars/:location', function(req, res) {
	var search_query = {
		term : "bar",
	}
	get_data(search_query, function(err,responce,body){
		if(err)throw err;
		var temp = JSON.parse(body);
		res.end(JSON.stringify(temp.businesses[0]));
	});
});

module.exports = router;
