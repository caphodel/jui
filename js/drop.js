(function($){

/*********************** drop ******************************/

	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function(label, type) {

		this.className += ' fa fa-plus-square-o';

		/*
		for(i in jui2.method){
			this[i] = jui2.method[i];
		}*/

		var self = this;

		if(this.getAttribute('type') == 'j-table'){
			$(this).parent().click(function(){
				var nextEl = $(this).parent().next()
				var openedDrop = $(this).parent().find('> td > j-drop[type="j-table"].fa-minus-square-o').not($(this).children());
				if(openedDrop.length > 0){
					nextEl.remove()
					openedDrop.removeClass('fa-minus-square-o').addClass('fa-plus-square-o')
					nextEl = $(this).parent().next()
				}
				if(nextEl.hasClass('j-drop')){
					nextEl.remove()
					$(self).removeClass('fa-minus-square-o').addClass('fa-plus-square-o')
				}
				else{
					var targetEl = $(this).parent()
					var tr = $('<tr class="j-drop"><td colspan="'+targetEl.children().length+'"></td></tr>').insertAfter(targetEl)
					window[self.getAttribute('onclick')](tr, targetEl.parent().parent().parent().parent()[0].aaData[targetEl.index()-targetEl.prevAll('.j-drop').length]||targetEl.parent().parent().parent().parent()[0].data[targetEl.index()-targetEl.prevAll('.j-drop').length])
					$(self).removeClass('fa-plus-square-o').addClass('fa-minus-square-o')
				}
			}).css('cursor', 'pointer')
		}

	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var enabledAttrChange = [];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.drop = {
		widget: document.registerElement('j-drop',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
