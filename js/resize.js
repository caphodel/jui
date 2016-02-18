
(function($){

	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function() {
    var x, y;
		var self = this;
		jui2.ui.base.proto.createdCallback.call(this, jui2.ui.resize);

    $(this).attr('drag', 'true').on('dragstart', function(e, pos){
      x = pos.x, y = pos.y

			$(self).triggerHandler('beforeresize')

      $('j-drag').css({
        height: $(self).parent().outerHeight(),
        width: $(self).parent().outerWidth()
      }).offset($(self).parent().offset())

			if($(self).attr('direction')=='horizontal'){
				$('j-drag').css({
					cursor: 'ew-resize !important'
				})
			}

    }).on('dragmove', function(e, pos){
			
			if($(self).attr('direction')=='horizontal'){
				$('j-drag').css({
	        width: $(self).parent().outerWidth()+(pos.x-x)
	      }).offset($(self).parent().offset())
			}
			else{
	      $('j-drag').css({
	        width: $(self).parent().outerWidth()+(pos.x-x),
	        height: $(self).parent().outerHeight()+(pos.y-y)
	      }).offset($(self).parent().offset())
			}

    }).on('dragend', function(e, pos){
			if($(self).attr('direction')=='horizontal'){
				$(self).parent().outerWidth($(self).parent().outerWidth()+(pos.x-x))
				$(self).css({
					'top': '',
					'bottom': ''
				}).triggerHandler('afterresize')
			}
			else{
      	$(self).parent().outerWidth($(self).parent().outerWidth()+(pos.x-x)).outerHeight($(self).parent().outerHeight()+(pos.y-y))
			}
    })

		for(i in this.attributes){
			var attrName = this.attributes[i].nodeName,
			newVal = this.attributes[i].nodeValue;
			if(jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName])
				jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName](this, false, newVal);
			else if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
				jui2.attrChange[attrName](this, false, newVal);
		}
	};

	//#TODO:0 Fixing toolbar to support table as extension
	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		if(jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName])
			jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName](this, oldVal, newVal);
    else if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
      jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.resize = {
		widget: document.registerElement('j-resize',  {
			prototype: proto
		}),
		proto: proto,
    extension: []
	}

}(jQuery))
;
