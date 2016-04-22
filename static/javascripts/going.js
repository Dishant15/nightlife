$('.togglegoing').on('click', function(){
	var $this = $(this);
	$this.removeClass("togglegoing");
	var bar_id = $this.attr("bar");
	var user_id = $this.attr("user");
	$.ajax({
		url: "/users/going/" + bar_id + "/" + user_id,
		success: function(result){
        			$this.children("span").text(result.count);
        			$this.addClass("togglegoing");
        		}
    });
});