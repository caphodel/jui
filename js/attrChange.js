jui2.attrChange = {
	disabled: function(el, oldVal, newVal){
		if(newVal != null){
			jui2.method.disable(el);
			$el = $(el)
			if($el.prop("tagName") != 'J-TABLE'){
				$el.data( "_events", $.extend(true, {}, $el.data( "events" )))
				$el.data( "events", [] )
				$el.unbind();
			}
		}
		else if(newVal == null){
			jui2.method.enable(el);
			$el = $(el)
			if($el.prop("tagName") != 'J-TABLE'){
				$.each($el.data("_events"), function(i, val){
				  $.each(val, function(i2, val2){
					//if(val2.delegateCount == 1){
						//$el.delegate(val2.selector, val2.type, val2.handler );
					//}else
						$el.on(val2.type, val2.handler, val2.data, val2.selector );
				  })
				})

				$el.data( "events", $.extend(true, {},$el.data( "_events" )))
			}
		}
	},
	icon: function(el, oldVal, newVal){
		if(el.iconPosition){
			$(el).children('.j-ui-icon').remove()
			if(newVal != null){
				el.insertAdjacentHTML( el.iconPosition, '<i class="j-ui-icon fa '+newVal+'"></i>' );
			}
		}
	},
	width: function(el, oldVal, newVal){
		el.style.width = newVal;
	},
	height: function(el, oldVal, newVal){
		el.style.height = newVal;
		if($(el).prop('tagName')=='J-TABLE')
			$(el).triggerHandler('afterdraw.height')
	},
	title: function(el, oldVal, newVal){
		var $el = $(el)
		$el.find('.j-title').remove();
		var table = $(el).children('table');
		if(newVal != null)
			el.insertAdjacentHTML( 'afterbegin', '<div class="j-title">'+newVal+'</div>' );
		if(el.tagName == 'J-TABLE'){
			marginTop = 0
			table.prevAll().each(function(i, val){
				if($(val).prop('tagName') == 'J-TOOLBAR')
					marginTop += 37
				else
					marginTop += $(val).outerHeight(true)
			})
			table.css('margin-top', marginTop);
			/*$el.resize(function(){
				$el.children('.j-title').outerWidth($el.width())
			});
			$el.children('.j-title').outerWidth($el.width())*/
		}
	},
	resize: function(el, oldVal, newVal){
		if(newVal.toLowerCase() == 'true'){
			var $el = $(el);
			if($el.next().prop('tagName') == 'J-LAYOUT-NO-RESIZER'){
				$el.next().remove()
			}
			if($el.next().prop('tagName') != 'J-LAYOUT-RESIZER'){
				$('<j-layout-resizer class="j-drag"></j-layout-resizer>').insertAfter($el)
			}
		}
		else{
			var $el = $(el);
			if($el.next().prop('tagName') == 'J-LAYOUT-RESIZER'){
				$el.next().remove()
			}
			if($el.next().prop('tagName') != 'J-LAYOUT-NO-RESIZER'){
				$('<j-layout-no-resizer></j-layout-no-resizer>').insertAfter($el)
			}
		}
	}
}