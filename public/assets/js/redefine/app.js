(function($, document, window){



	
	$(document).ready(function(){
	
		// function loadMenu()
		// {
			
		// 	$(".menu-item").removeClass("current-menu-item");
		// 	let id=localStorage.getItem("dataId")=="undefined"?1:parseInt(localStorage.getItem("dataId"));
		// 	//alert(id);
		// 	$(`.menu-item:nth-child(${id})`).addClass("current-menu-item");
		// }
		// loadMenu();
		// Cloning main navigation for mobile menu
		$(".mobile-navigation").append($(".main-navigation .menu").clone());

		// Mobile menu toggle 
		$(".menu-toggle").click(function(){
			$(".mobile-navigation").slideToggle();
		});
		$(".search-form button").click(function(){
			$(this).toggleClass("active");
			var $parent = $(this).parent(".search-form");

			$parent.find("input").toggleClass("active").focus();
		});

		// $(".menu-item").on("click",function()
        // {
		// 	//sessionStorage.setItem()
		// 	//console.log($(this).attr("data-id"));
		// 	localStorage.setItem("dataId",$(this).attr("data-id"));
        // })
		

		

		if( $(".map").length ) {
			$('.map').gmap3({
				map: {
					options: {
						maxZoom: 14 
					}  
				},
				marker:{
					address: "40 Sibley St, Detroit",
				}
			},
			"autofit" );
	    	
	    }
	});

	$(window).load(function(){

	});

})(jQuery, document, window);
