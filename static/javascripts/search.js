function goSearch() {
	window.location.href = "/bars/sanandreas";
};

$(document).ready(function(){
	$("#search").keyup(function(){
		if(event.keyCode == 13){
			goSearch();
		}
	});

	$(".glyphicon-search").click(goSearch);
});