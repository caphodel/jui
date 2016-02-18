
(function($){

/*********************** scroll ******************************/
	var proto = Object.create(HTMLElement.prototype)
	
	proto.createdCallback = function() {
		
		this.innerHTML = jui2.tmpl['scroll']();
		
		var $parent = $(this).parent()
		
		if($parent.prop("tagName").toLowerCase() == 'j-table'){
			$(this).children().children().outerWidth($(this).prev().outerWidth(true))
			$(this).outerWidth($(this).prev().outerWidth(true))
			$(this).children().outerWidth($parent.width())
			
			$parent.children('j-scroll').children().scroll(function(e){
				$parent.scrollLeft($parent.children('j-scroll').children().scrollLeft());
				$parent.children().not('table, j-scroll').css('left', $parent.children('j-scroll').children().scrollLeft());
				$parent.children('j-scroll').children().css('left', $parent.children('j-scroll').children().scrollLeft());
			})
			
			$(this).height($parent.children('j-scroll').children().height());
				$parent.scrollLeft('0px');
		}
		
	};
	
	jui2.ui.scroll = {
		widget: document.registerElement('j-scroll',  { 
			prototype: proto
		}),
		proto: proto
	}

}(jQuery));