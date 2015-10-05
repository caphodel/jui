(function($){

/*********************** layout Resizer ******************************/
	var proto = Object.create(HTMLElement.prototype)
	
	proto.createdCallback = function() {
		
		/*this.iconPosition = 'afterBegin';
		
		if(this.innerHTML.trim() == '')
			this.innerHTML = 'Button'
		
		if(this.getAttribute('icon'))
			this.innerHTML = '<i class="fa '+this.getAttribute('icon')+'"></i> '+this.innerHTML
		
		for(i in jui2.method){
			this[i] = jui2.method[i];
		}*/
		
		var $el = $(this)
		
	};
	
	/*proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var enabledAttrChange = ['resize'];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);
	}*/
	
	jui2.ui.layoutResizer = {
		widget: document.registerElement('j-layout-resizer',  { 
			prototype: proto
		}),
		proto: proto
	}
	
	$( document ).ready(function() {
		$.data($('body')[0], 'jui2.drag.el', false)
		$('body').on('mousedown', function(e){
			var d;
			if($(e.target).hasClass('j-drag')){
				d = true;
				$.data($('body')[0], 'jui2.drag.el', $(e.target))
			}
			if($(e.target).parents('.j-drag').length>0){
				d = true;
				$.data($('body')[0], 'jui2.drag.el', $(e.target).parents('.j-drag').eq(0))
			}
			var el =$.data($('body')[0], 'jui2.drag.el')
			if(el != false){
				el.addClass('j-dragging')
				el.css('z-index', jui2.findHighestZIndex())
				var offset = el.offset(),
				clientX = offset.left,
				clientY = offset.top
				$.data($('body')[0], 'jui2.drag.el.offset', {x: clientX, y: clientY})
				$.data($('body')[0], 'jui2.drag.pos', {x: 0, y: 0})
			}
		})
		
		$('body').on('mousemove', function(e){
			var el = $.data($('body')[0], 'jui2.drag.el')
			if($.data($('body')[0], 'jui2.drag.el') != false){
				$('body').addClass('j-disable-select')
				var offset = $.data($('body')[0], 'jui2.drag.el.offset'),
				mouseX = e.clientX + $(document).scrollLeft(),
				mouseY = e.clientY + $(document).scrollTop(),
				x = mouseX > offset.x ? parseInt(mouseX) - parseInt(offset.x) : '-'+(parseInt(offset.x) - parseInt(mouseX)),
				y = mouseY > offset.y ? parseInt(mouseY) - parseInt(offset.y) : '-'+(parseInt(offset.y) - parseInt(mouseY))
				$.data($('body')[0], 'jui2.drag.pos', {x: x, y: y})
				if(el.prop('tagName') == 'J-LAYOUT-RESIZER'){
					if(el.parent().prop('tagName') == 'J-LAYOUT-HORIZONTAL'){
						el.css('transform', 'translate3d( '+x+'px, 0px, 0px)')
						$('body').css('cursor', 'w-resize');
					}
					else{
						el.css('transform', 'translate3d(0px, '+y+'px,  0px)')
						$('body').css('cursor', 'n-resize');
					}
				}
				else{
					el.trigger('jui2.drag', [{x: x, y: y}, {x: mouseX, y: mouseY}])
					el.css('transform', 'translate3d( '+x+'px, '+y+'px,  0px)')
				}
			}
		})
		
		$('body').on('mouseup', function(e){
			var el = $.data($('body')[0], 'jui2.drag.el')
			if(el){
				var pos = $.data($('body')[0], 'jui2.drag.pos'),
				mouseX = e.clientX + $(document).scrollLeft(),
				mouseY = e.clientY + $(document).scrollTop()
				if(el.prop('tagName') == 'J-LAYOUT-RESIZER'){
						$('body').css('cursor', '');
						if(el.parent().prop('tagName') == 'J-LAYOUT-HORIZONTAL'){
							var nWidth = parseInt(el.next().width())
							el.prev().width(parseInt(el.prev().width()) + parseInt(pos.x))
							el.prev().css('flex-grow', '0')
							if(el.next().prop('resize') != true){
								el.next().width(nWidth - parseInt(pos.x))
							}
						}
						else{
							var nHeight = parseInt(el.next().height())
							el.prev().height(parseInt(el.prev().height()) + parseInt(pos.y))
							el.prev().css('flex-grow', '0')
							if(el.next().prop('resize') != true){
								el.next().height(nHeight - parseInt(pos.y))
							}
						}
				}
				else{
					el.trigger('jui2.drop', [{x: pos.x, y: pos.y}, {x: mouseX, y: mouseY}]);
				}
				el.css('transform', '')
				el.removeClass('j-dragging')
				$.data($('body')[0], 'jui2.drag.el', false)
				$('body').removeClass('j-disable-select')
				el.css('z-index', '')
			}
		})
	})

}(jQuery))